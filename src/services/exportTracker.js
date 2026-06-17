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
  // 1) Fail fast if Firestore is not available
  if (!db) {
    const err = new Error('Firestore is not initialized');
    err.code = 'firestore/unavailable';
    console.error('[exportTracker]', err);
    throw err;
  }

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

  // 2) Attempt the write with retries
  try {
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
  } catch (error) {
    // 3) Always log the full error (production included)
    console.error('[exportTracker] Firestore write failed', {
      code: error.code,
      message: error.message,
      name: error.name,
    });

    // 4) Re‑throw so the caller can show a toast and the developer sees it
    throw error;
  }

  // 5) Analytics event (only fires if the write succeeded)
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}