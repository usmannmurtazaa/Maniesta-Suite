import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, initializeFirestore, persistentLocalCache } from 'firebase/firestore';
import { getAnalytics, isSupported, logEvent as firebaseLogEvent } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

function getFirebaseApp() {
  if (getApps().length > 0) return getApp();
  return initializeApp(firebaseConfig);
}

const app = getFirebaseApp();

let db;
try {
  db = initializeFirestore(app, { localCache: persistentLocalCache() });
} catch {
  db = getFirestore(app);
}
export { db };

let analytics = null;
export const initializeAnalytics = async () => {
  if (!app) return;
  if (await isSupported()) {
    analytics = getAnalytics(app);
  }
};
export { analytics };

// ── Enhanced analytics wrapper ──────────────────────────────────
let deviceInfoCache = null;

function getDeviceInfo() {
  if (deviceInfoCache) return deviceInfoCache;
  const ua = navigator.userAgent;
  const platform = navigator.platform || '';
  const language = navigator.language || 'unknown';
  const screenWidth = window.screen?.width || 0;
  const screenHeight = window.screen?.height || 0;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  let deviceType = 'desktop';
  if (/Mobi|Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua)) {
    deviceType = 'mobile';
    if (/iPad|Tablet|PlayBook|Silk/i.test(ua) || (platform === 'MacIntel' && navigator.maxTouchPoints > 1)) {
      deviceType = 'tablet';
    }
  }

  let browserName = 'Unknown';
  if (ua.includes('Firefox/')) browserName = 'Firefox';
  else if (ua.includes('Edg/')) browserName = 'Edge';
  else if (ua.includes('Chrome/') && !ua.includes('Edg/')) browserName = 'Chrome';
  else if (ua.includes('Safari/') && !ua.includes('Chrome/')) browserName = 'Safari';
  else if (ua.includes('OPR/') || ua.includes('Opera/')) browserName = 'Opera';

  deviceInfoCache = {
    device_type: deviceType,
    browser: browserName,
    platform,
    language,
    screen_resolution: `${screenWidth}x${screenHeight}`,
    viewport: `${viewportWidth}x${viewportHeight}`,
  };
  return deviceInfoCache;
}

export function logEvent(eventName, params = {}) {
  if (!analytics) return;
  try {
    const deviceInfo = getDeviceInfo();
    firebaseLogEvent(analytics, eventName, {
      ...params,
      page_location: window.location.href,
      page_title: document.title,
      timestamp: new Date().toISOString(),
      ...deviceInfo,
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn('Analytics logEvent error:', error);
    }
  }
}