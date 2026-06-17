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
  console.log('[trackExport] Called with data:', {
    studentName: data.studentName,
    exportType: data.exportType,
    dbExists: !!db,
  });

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

  // Firestore write with retry (non‑blocking)
  if (db) {
    console.log('[trackExport] db exists, attempting Firestore write...');
    try {
      await withRetry(async () => {
        console.log('[trackExport] withRetry: Creating collection reference...');
        const exportsCollection = collection(db, 'exports');
        console.log('[trackExport] withRetry: Adding document...');
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
        console.log('[trackExport] ✅ Document successfully added');
      });
    } catch (error) {
      console.error('[trackExport] ❌ Firestore write failed:', {
        errorCode: error.code,
        errorMessage: error.message,
        errorName: error.name,
      });
      if (process.env.NODE_ENV !== 'production') {
        console.error('Full error:', error);
      }
    }
  } else {
    console.warn('[trackExport] db is falsy - Firestore not available');
  }

  // Analytics event
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}