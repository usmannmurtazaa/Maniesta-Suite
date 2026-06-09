// src/services/exportTracker.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, logEvent } from './firebase';

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
  const {
    studentName = '',
    studentId = '',
    university = '',
    degree = '',               // ✅ Added degree field
    semester = '',
    scale = '4.0',
    gpa = 0,
    credits = 0,
    date = new Date().toLocaleDateString(),
    exportType = 'unknown',
    timestamp = new Date().toISOString(),
    deviceInfo,
  } = data;

  // Firestore write with retry (non‑blocking)
  if (db) {
    try {
      await withRetry(async () => {
        const exportsCollection = collection(db, 'exports');
        await addDoc(exportsCollection, {
          studentName,
          studentId,
          university,
          degree,               // ✅ Saved to Firestore
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
    } catch (error) {
      if (process.env.NODE_ENV !== 'production') {
        console.error('Firestore export tracking failed after retries:', error);
      }
    }
  }

  // Analytics event
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}