// services/firestore.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/* -------------------------------------------------------------------------- */
/*   Constants                                                                 */
/* -------------------------------------------------------------------------- */

// Machine‑readable identifiers (matching the route paths)
const ALLOWED_CALCULATOR_IDS = [
  'gpa',
  'cgpa',
  'calculator',
  'converter',
  'interest',
];

// Maximum allowed length for string fields to prevent abuse
const MAX_STRING_LENGTH = 300;

// Maximum courses / semesters to store
const MAX_COURSES = 20;
const MAX_SEMESTERS = 15;

/* -------------------------------------------------------------------------- */
/*   Custom error class                                                        */
/* -------------------------------------------------------------------------- */
export class FirestoreError extends Error {
  constructor(message, originalError = null) {
    super(message);
    this.name = 'FirestoreError';
    this.originalError = originalError;
  }
}

/* -------------------------------------------------------------------------- */
/*   Sanitisation helpers                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Strips HTML tags and trims whitespace.
 */
function stripHtml(str) {
  if (typeof str !== 'string') return str;
  return str.replace(/<[^>]*>/g, '').trim();
}

/**
 * Truncates a string to a safe maximum length.
 */
function truncate(str, maxLength = MAX_STRING_LENGTH) {
  if (typeof str !== 'string') return str;
  return str.slice(0, maxLength);
}

/**
 * Deep sanitisation of the userData object.
 * Removes potential XSS vectors and limits field sizes.
 */
function sanitizeUserData(userData) {
  if (!userData || typeof userData !== 'object') return {};

  const safe = {};
  for (const [key, value] of Object.entries(userData)) {
    if (typeof value === 'string') {
      safe[key] = truncate(stripHtml(value));
    } else {
      safe[key] = value; // keep numbers, etc.
    }
  }
  return safe;
}

/**
 * Ensures resultData doesn't contain an unreasonable amount of entries.
 */
function sanitizeResultData(resultData, calculatorId) {
  if (!resultData || typeof resultData !== 'object') return {};

  const safe = { ...resultData };

  // Limit courses/semesters arrays
  if (calculatorId === 'gpa' && Array.isArray(safe.courses)) {
    safe.courses = safe.courses.slice(0, MAX_COURSES).map((c) => ({
      name: truncate(stripHtml(c.name || '')),
      creditHours: c.creditHours,
      grade: c.grade,
    }));
  }

  if (calculatorId === 'cgpa' && Array.isArray(safe.semesters)) {
    safe.semesters = safe.semesters.slice(0, MAX_SEMESTERS).map((sem) => ({
      name: truncate(stripHtml(sem.name || '')),
      courses: Array.isArray(sem.courses)
        ? sem.courses.slice(0, MAX_COURSES).map((c) => ({
            name: truncate(stripHtml(c.name || '')),
            creditHours: c.creditHours,
            grade: c.grade,
          }))
        : [],
    }));
  }

  return safe;
}

/* -------------------------------------------------------------------------- */
/*   Validation                                                                */
/* -------------------------------------------------------------------------- */
function validateExportPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new FirestoreError('Export payload must be an object.');
  }

  const { calculatorId, userData, resultData } = payload;

  if (!calculatorId || !ALLOWED_CALCULATOR_IDS.includes(calculatorId)) {
    throw new FirestoreError(
      `Invalid calculatorId. Allowed: ${ALLOWED_CALCULATOR_IDS.join(', ')}`
    );
  }

  if (!userData || typeof userData !== 'object') {
    throw new FirestoreError('userData is required and must be an object.');
  }

  if (!resultData || typeof resultData !== 'object') {
    throw new FirestoreError('resultData is required and must be an object.');
  }
}

/* -------------------------------------------------------------------------- */
/*   Save export data to Firestore                                             */
/* -------------------------------------------------------------------------- */

/**
 * Persists an export payload to Firestore.
 *
 * @param {Object} exportData
 * @param {string} exportData.calculatorId - e.g. 'gpa', 'cgpa'
 * @param {string} [exportData.calculatorType] - display name (optional)
 * @param {Object} exportData.userData - { fullName, studentId, ... }
 * @param {Object} exportData.resultData - the calculation result
 * @param {Object} [options]
 * @param {AbortSignal} [options.signal] - pass an AbortSignal to cancel the operation
 * @returns {Promise<string>} Firestore document ID
 * @throws {FirestoreError}
 */
export async function saveExportData(exportData, { signal } = {}) {
  // 1. Firestore availability
  if (!db) {
    throw new FirestoreError(
      'Firestore is not configured. Check your Firebase environment variables.'
    );
  }

  // 2. Validate shape
  validateExportPayload(exportData);

  // 3. Sanitise to prevent PII leakage / injection
  const safeUserData = sanitizeUserData(exportData.userData);
  const safeResultData = sanitizeResultData(
    exportData.resultData,
    exportData.calculatorId
  );

  const document = {
    calculatorId: exportData.calculatorId,
    calculatorType: exportData.calculatorType || exportData.calculatorId,
    userData: safeUserData,
    resultData: safeResultData,
    createdAt: serverTimestamp(),
    metadata: {
      userAgent: navigator.userAgent.slice(0, 200),
      platform: navigator.platform?.slice(0, 100),
      language: navigator.language?.slice(0, 30),
      screen: `${window.screen?.width ?? 0}x${window.screen?.height ?? 0}`,
      timestamp: new Date().toISOString(),
    },
  };

  // 4. Firestore write with optional abort
  const writePromise = addDoc(collection(db, 'exports'), document);

  if (signal) {
    return new Promise((resolve, reject) => {
      const onAbort = () => {
        reject(new DOMException('The operation was aborted.', 'AbortError'));
      };

      signal.addEventListener('abort', onAbort);
      writePromise
        .then((docRef) => {
          signal.removeEventListener('abort', onAbort);
          resolve(docRef.id);
        })
        .catch((error) => {
          signal.removeEventListener('abort', onAbort);
          reject(
            error instanceof FirestoreError
              ? error
              : new FirestoreError('Unable to save your data.', error)
          );
        });
    });
  }

  try {
    const docRef = await writePromise;
    return docRef.id;
  } catch (error) {
    throw new FirestoreError(
      'Unable to save your data. Please check your connection and try again.',
      error
    );
  }
}