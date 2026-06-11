import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ALLOWED_CALCULATOR_TYPES = ['GPA', 'CGPA', 'Calculator', 'Converter', 'Interest'];

/**
 * Custom AbortError – mimics the native DOMException when AbortController aborts.
 */
class AbortError extends Error {
  constructor(message = 'Aborted') {
    super(message);
    this.name = 'AbortError';
  }
}

/**
 * Validate export payload, accepting both legacy and new shapes.
 *
 * Legacy shape: { calculatorType, userData, resultData }
 * New shape:    { studentName, scale, courses, gpaResult, ... }
 */
function validateExportPayload(payload) {
  if (!payload || typeof payload !== 'object') {
    throw new Error('Export payload must be an object.');
  }

  // Legacy validation (contains calculatorType)
  if (payload.calculatorType) {
    if (!ALLOWED_CALCULATOR_TYPES.includes(payload.calculatorType)) {
      throw new Error(`Invalid calculatorType: "${payload.calculatorType}".`);
    }
    if (!payload.userData || typeof payload.userData !== 'object') {
      throw new Error('Legacy export requires userData.');
    }
    if (!payload.resultData) {
      throw new Error('Legacy export requires resultData.');
    }
    return;
  }

  // New shape validation (contains studentName or other known fields)
  if (!payload.studentName) {
    throw new Error('New export payload must contain studentName.');
  }
  // Additional optional checks can be added here (e.g., scale, courses)
}

/**
 * Save export data to Firestore.
 *
 * @param {Object} exportData – the export payload (legacy or new shape).
 * @param {Object} [options] – optional settings.
 * @param {AbortSignal} [options.signal] – external AbortSignal to cancel the operation.
 * @returns {Promise<string>} The Firestore document ID.
 */
export async function saveExportData(exportData, options = {}) {
  if (!db) throw new Error('Firestore is not configured.');

  // Validate the payload before proceeding
  validateExportPayload(exportData);

  // Handle abort if a signal is provided
  if (options.signal) {
    if (options.signal.aborted) {
      throw new AbortError();
    }
    // Create a race between the actual Firestore write and the abort event
    const abortPromise = new Promise((_, reject) => {
      options.signal.addEventListener('abort', () => reject(new AbortError()), { once: true });
    });
    const firestorePromise = performSave(exportData);
    return Promise.race([firestorePromise, abortPromise]);
  }

  // No signal – just save directly
  return performSave(exportData);
}

/**
 * Internal helper that builds the document and writes to Firestore.
 */
async function performSave(exportData) {
  const document = {
    ...exportData,
    createdAt: serverTimestamp(),
    metadata: {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      timestamp: new Date().toISOString(),
    },
  };

  const docRef = await addDoc(collection(db, 'exports'), document);
  return docRef.id;
}