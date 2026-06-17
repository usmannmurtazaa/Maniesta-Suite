import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, logEvent } from './firebase';

function throwIfNoDb() {
  if (!db) {
    // This error cannot be stripped and will appear in the console / UI.
    const err = new Error('Firestore instance (db) is not available');
    err.code = 'firestore/unavailable';
    throw err;
  }
}

async function withRetry(fn, maxRetries = 3, baseDelayMs = 500) {
  let lastError;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries) {
        const delay = baseDelayMs * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
  throw lastError;
}

function getDefaultDeviceInfo() {
  return {
    userAgent: navigator.userAgent || '',
    platform: navigator.platform || '',
    language: navigator.language || '',
    screenWidth: window.screen?.width || 0,
    screenHeight: window.screen?.height || 0,
    viewportWidth: window.innerWidth || 0,
    viewportHeight: window.innerHeight || 0,
  };
}

export async function trackExport(data) {
  // 1. Fail loudly if Firestore is missing – no silent skip
  throwIfNoDb();

  const {
    studentName = '',
    studentId = '',
    university = '',
    degree = '',
    semester = '',
    scale = '4.0',
    gpa = 0,
    credits = 0,
    date = new Date().toLocaleDateString(),
    exportType = 'unknown',
    timestamp = new Date().toISOString(),
    deviceInfo,
  } = data;

  // 2. Write with retries
  await withRetry(async () => {
    const exportsCollection = collection(db, 'exports');
    await addDoc(exportsCollection, {
      studentName,
      studentId,
      university,
      degree,
      semester,
      scale,
      gpa,
      credits,
      date,
      exportType,
      timestamp: serverTimestamp(),
      deviceInfo: deviceInfo || getDefaultDeviceInfo(),
      createdAt: new Date().toISOString(),
    });
  });

  // 3. Analytics only after a successful write
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}