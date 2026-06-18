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
export async function performSave(exportData, options = {}) {
  console.log('[Firestore] performSave called with:', {
    dataKeys: Object.keys(exportData),
    hasSignal: !!options.signal,
    dbExists: !!db,
  });

  if (!db) {
    console.error('[Firestore] CRITICAL: db is undefined or falsy');
    throw new Error('Firestore is not configured.');
  }

  // Validate the payload before proceeding
  console.log('[Firestore] Validating payload...');
  validateExportPayload(exportData);
  console.log('[Firestore] Validation passed');

  // Handle abort if a signal is provided
  if (options.signal) {
    console.log('[Firestore] Signal provided, setting up abort handler');
    if (options.signal.aborted) {
      console.warn('[Firestore] Signal already aborted before write');
      throw new AbortError();
    }
    // Create a race between the actual Firestore write and the abort event
    const abortPromise = new Promise((_, reject) => {
      options.signal.addEventListener('abort', () => {
        console.warn('[Firestore] Write aborted via signal');
        reject(new AbortError());
      }, { once: true });
    });
    const firestorePromise = saveToFirestore(exportData);
    return Promise.race([firestorePromise, abortPromise]);
  }

  // No signal – just save directly
  console.log('[Firestore] No signal, proceeding with direct save');
  return saveToFirestore(exportData);
}

/**
 * Internal helper that builds the document and writes to Firestore.
 */
async function saveToFirestore(exportData) {
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

  console.log('[Firestore] Building document for write:', {
    docKeys: Object.keys(document),
    hasMetadata: !!document.metadata,
  });

  try {
    console.log('[Firestore] Calling addDoc to exports collection...');
    const exportsCollection = collection(db, 'exports');
    console.log('[Firestore] Collection reference created');

    const docRef = await addDoc(exportsCollection, document);

    console.log('[Firestore] ✅ SUCCESS: Document written with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('[Firestore] ❌ WRITE FAILED', {
      errorCode: error.code,
      errorMessage: error.message,
      errorName: error.name,
      fullError: error,
    });
    throw error;
  }
}