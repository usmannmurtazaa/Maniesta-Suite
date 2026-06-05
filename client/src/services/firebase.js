// firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

// ── Validate required env vars ─────────────────
const REQUIRED = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missing = REQUIRED.filter(key => !import.meta.env[key]);

if (missing.length > 0) {
  console.error(
    `🚨 Firebase: Missing environment variables: ${missing.join(', ')}.\n` +
    'Create a .env file at client/.env with the required keys (see .env.example).'
  );
}

// ── Config ────────────────────────────────────
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

// ── Safe app initialisation ───────────────────
function getFirebaseApp() {
  if (!firebaseConfig.projectId) {
    console.error('Cannot initialise Firebase: projectId is empty.');
    return null;
  }

  if (getApps().length > 0) return getApp();

  try {
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('Firebase initialisation error:', error);
    return null;
  }
}

const app = getFirebaseApp();

// ── Firestore ─────────────────────────────────
let db = null;
if (app) {
  try {
    db = initializeFirestore(app, { localCache: persistentLocalCache() });
  } catch {
    db = getFirestore(app);
  }
}

export { db };

// ── Analytics (lazy) ──────────────────────────
let analytics = null;
export const initializeAnalytics = async () => {
  if (!app || !firebaseConfig.measurementId) {
    console.warn('Analytics skipped: missing app or measurementId.');
    return;
  }

  try {
    if (await isSupported()) {
      analytics = getAnalytics(app);
    }
  } catch (error) {
    console.error('Analytics initialization error:', error);
  }
};

export { analytics };