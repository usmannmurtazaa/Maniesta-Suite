// src/services/exportTracker.js
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, logEvent } from './firebase';

// -------------------------------------------------------------------
// Guard: if Firestore is not available, fail immediately (no silent skip)
// -------------------------------------------------------------------
function throwIfNoDb() {
  if (!db) {
    const err = new Error('Firestore instance (db) is not available');
    err.code = 'firestore/unavailable';
    throw err;
  }
}

// -------------------------------------------------------------------
// Retry helper (exponential backoff)
// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
// Default device info (used when none is provided)
// -------------------------------------------------------------------
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

// -------------------------------------------------------------------
// Main export tracking function
// -------------------------------------------------------------------
export async function trackExport(data) {
  // 1. Fail fast if Firestore is not initialized
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

  // 2. Write the export record with automatic retries
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

  // 3. Only after successful write: fire the analytics event
  logEvent('export_tracked', {
    export_type: exportType,
    scale,
    gpa,
    timestamp,
  });
}