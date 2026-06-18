// services/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  initializeFirestore,
  persistentLocalCache,
} from 'firebase/firestore';
import { getAnalytics, isSupported } from 'firebase/analytics';

/* -------------------------------------------------------------------------- */
/*   Environment validation                                                    */
/* -------------------------------------------------------------------------- */
const REQUIRED_KEYS = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_APP_ID',
];

const missingRequired = REQUIRED_KEYS.filter((key) => !import.meta.env[key]);

if (missingRequired.length > 0) {
  console.error(
    `[Maniesta Firebase] Missing required environment variables: ${missingRequired.join(', ')}. ` +
    'Firebase features will be disabled. Create a .env file based on .env.example.'
  );
}

/* -------------------------------------------------------------------------- */
/*   App initialisation                                                       */
/* -------------------------------------------------------------------------- */
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
};

function getFirebaseApp() {
  // Do not attempt initialisation without required keys
  if (missingRequired.length > 0) return null;

  // Prevent duplicate apps (e.g., HMR in Vite)
  if (getApps().length > 0) return getApp();

  try {
    return initializeApp(firebaseConfig);
  } catch (error) {
    console.error('[Maniesta Firebase] App initialisation failed:', error);
    return null;
  }
}

const app = getFirebaseApp();

/* -------------------------------------------------------------------------- */
/*   Firestore – persistent local cache with graceful fallback                 */
/* -------------------------------------------------------------------------- */
let db = null;

if (app) {
  try {
    db = initializeFirestore(app, {
      localCache: persistentLocalCache(),
    });
  } catch {
    console.warn(
      '[Maniesta Firebase] Persistent cache unavailable. Falling back to default Firestore.'
    );
    db = getFirestore(app);
  }
}

export { db };

/* -------------------------------------------------------------------------- */
/*   Analytics – lazy, singleton, non‑blocking                                  */
/* -------------------------------------------------------------------------- */
let analytics = null;
let analyticsInitialised = false;
let analyticsInitPromise = null;

export async function initializeAnalytics() {
  if (!app) {
    console.warn('[Maniesta Analytics] Initialisation skipped – no Firebase app.');
    return;
  }

  if (analyticsInitialised) return;

  // Only one concurrent initialisation attempt
  if (analyticsInitPromise) {
    await analyticsInitPromise;
    return;
  }

  analyticsInitPromise = (async () => {
    try {
      const supported = await isSupported();
      if (supported) {
        analytics = getAnalytics(app);
        if (import.meta.env.DEV) {
          console.log('[Maniesta Analytics] Initialised.');
        }
      } else {
        console.info('[Maniesta Analytics] Not supported in this environment.');
      }
    } catch (error) {
      console.error('[Maniesta Analytics] Initialisation error:', error);
    } finally {
      analyticsInitialised = true;
      analyticsInitPromise = null;
    }
  })();

  await analyticsInitPromise;
}

export { analytics };