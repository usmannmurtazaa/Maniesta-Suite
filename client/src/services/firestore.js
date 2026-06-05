import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const ALLOWED_CALCULATOR_TYPES = ['GPA', 'CGPA', 'Calculator', 'Converter', 'Interest'];

function validateExportPayload(payload) {
  if (!payload || typeof payload !== 'object') throw new Error('Export payload must be an object.');
  if (!payload.calculatorType || !ALLOWED_CALCULATOR_TYPES.includes(payload.calculatorType)) {
    throw new Error(`Invalid calculatorType.`);
  }
  if (!payload.userData || typeof payload.userData !== 'object') throw new Error('userData is required.');
  if (!payload.resultData) throw new Error('resultData is required.');
}

export async function saveExportData(exportData) {
  if (!db) throw new Error('Firestore is not configured.');
  validateExportPayload(exportData);

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