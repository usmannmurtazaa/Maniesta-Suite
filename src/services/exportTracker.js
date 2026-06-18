// src/services/exportTracker.js
import { logEvent } from './firebase';

// Netlify Function endpoint (same origin — no CORS!)
const FUNCTION_URL = '/.netlify/functions/track-export';

// -------------------------------------------------------------------
// Timeout wrapper
// -------------------------------------------------------------------
function withTimeout(promise, ms = 15000) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Firestore write timed out — connection blocked')), ms)
    ),
  ]);
}

// -------------------------------------------------------------------
// Default device info
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

  const document = {
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
    timestamp,
    deviceInfo: deviceInfo || getDefaultDeviceInfo(),
    createdAt: new Date().toISOString(),
  };

  console.log('[trackExport] Sending to Netlify Function...');
  console.log('[trackExport] Document keys:', Object.keys(document));

  try {
    const response = await withTimeout(
      fetch(FUNCTION_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(document),
      })
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Proxy write failed: ${response.status} — ${errorText}`);
    }

    const result = await response.json();
    console.log('[trackExport] ✅ Document written via Netlify Function:', result.id);

    logEvent('export_tracked', {
      export_type: exportType,
      scale,
      gpa,
      timestamp,
    });

    return result.id;
  } catch (error) {
    console.error('[trackExport] ❌ Write failed:', {
      message: error.message,
      name: error.name,
    });
    throw error;
  }
}