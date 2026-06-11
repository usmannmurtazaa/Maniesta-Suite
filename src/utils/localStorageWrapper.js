// src/utils/localStorageWrapper.js
const STORAGE_KEY_PREFIX = 'maniesta_';

function getFullKey(key) {
  // Warn if the caller already included the prefix (prevents double-prefixing)
  if (key.startsWith(STORAGE_KEY_PREFIX)) {
    console.warn(
      `localStorageWrapper: key "${key}" already contains the prefix "${STORAGE_KEY_PREFIX}". ` +
      'Provide keys without the prefix to avoid double-prefixing.'
    );
    // Still apply prefix to avoid accidental cross-app leakage; caller should fix its code.
  }
  return `${STORAGE_KEY_PREFIX}${key}`;
}

/**
 * Dispatch a custom 'storage-update' event so that other parts of the app
 * (DashboardProvider, Home, etc.) stay in sync.
 * @param {string} key - The unprefixed key.
 * @param {any} value - The stored value (already parsed/stringified).
 */
function notifyStorageUpdate(key, value) {
  try {
    window.dispatchEvent(
      new CustomEvent('storage-update', {
        detail: { key: getFullKey(key), value },
      })
    );
  } catch (error) {
    console.warn('Failed to dispatch storage-update event:', error);
  }
}

/**
 * Safely retrieve and parse a value from localStorage.
 * @param {string} key - Storage key (without prefix)
 * @param {any} defaultValue - Value to return if read fails or value is null
 * @returns {any} Parsed value or defaultValue
 */
export function safeGetItem(key, defaultValue = null) {
  try {
    const fullKey = getFullKey(key);
    const raw = localStorage.getItem(fullKey);
    if (raw === null) return defaultValue;
    return JSON.parse(raw);
  } catch (error) {
    console.error(`localStorage.getItem failed for key "${key}":`, error);
    // Optionally clean up the corrupted entry
    try {
      localStorage.removeItem(getFullKey(key));
    } catch (_) {}
    return defaultValue;
  }
}

/**
 * Safely stringify and store a value in localStorage.
 * @param {string} key - Storage key (without prefix)
 * @param {any} value - Value to store (will be JSON.stringify)
 * @param {Object} [options]
 * @param {boolean} [options.dispatchEvent=false] - Whether to fire 'storage-update' event
 * @returns {boolean} Success status
 */
export function safeSetItem(key, value, { dispatchEvent = false } = {}) {
  try {
    const fullKey = getFullKey(key);
    const serialized = JSON.stringify(value);
    localStorage.setItem(fullKey, serialized);
    if (dispatchEvent) {
      notifyStorageUpdate(key, value);
    }
    return true;
  } catch (error) {
    console.error(`localStorage.setItem failed for key "${key}":`, error);
    // If quota exceeded, you might attempt to clear old data here.
    return false;
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key - Storage key (without prefix)
 * @param {Object} [options]
 * @param {boolean} [options.dispatchEvent=false] - Whether to fire 'storage-update' event
 */
export function safeRemoveItem(key, { dispatchEvent = false } = {}) {
  try {
    const fullKey = getFullKey(key);
    localStorage.removeItem(fullKey);
    if (dispatchEvent) {
      notifyStorageUpdate(key, null); // null value indicates removal
    }
  } catch (error) {
    console.error(`localStorage.removeItem failed for key "${key}":`, error);
  }
}