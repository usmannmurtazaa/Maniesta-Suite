// src/utils/localStorageWrapper.js
const STORAGE_KEY_PREFIX = 'maniesta_';

function getFullKey(key) {
  return `${STORAGE_KEY_PREFIX}${key}`;
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
    return defaultValue;
  }
}

/**
 * Safely stringify and store a value in localStorage.
 * @param {string} key - Storage key (without prefix)
 * @param {any} value - Value to store (will be JSON.stringify)
 * @returns {boolean} Success status
 */
export function safeSetItem(key, value) {
  try {
    const fullKey = getFullKey(key);
    const serialized = JSON.stringify(value);
    localStorage.setItem(fullKey, serialized);
    return true;
  } catch (error) {
    console.error(`localStorage.setItem failed for key "${key}":`, error);
    // If quota exceeded, clear old data? Not implemented here.
    return false;
  }
}

/**
 * Remove a key from localStorage.
 * @param {string} key - Storage key (without prefix)
 */
export function safeRemoveItem(key) {
  try {
    const fullKey = getFullKey(key);
    localStorage.removeItem(fullKey);
  } catch (error) {
    console.error(`localStorage.removeItem failed for key "${key}":`, error);
  }
}