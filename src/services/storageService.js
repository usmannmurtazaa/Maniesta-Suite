// src/services/storageService.js
export const STORAGE_KEYS = {
  RECENT_ACTIONS: 'maniesta_recent_actions',
  FAVORITE_TOOLS: 'maniesta_favorite_tools',
  LAST_GPA: 'maniesta_last_gpa',
  LAST_CURRENCY: 'maniesta_last_currency',
  EXPORT_HISTORY: 'maniesta_export_history',
  USER_PREFERENCES: 'maniesta_user_preferences',
};

const DEFAULT_STATE = {
  [STORAGE_KEYS.RECENT_ACTIONS]: [],
  [STORAGE_KEYS.FAVORITE_TOOLS]: [],
  [STORAGE_KEYS.LAST_GPA]: null,
  [STORAGE_KEYS.LAST_CURRENCY]: null,
  [STORAGE_KEYS.EXPORT_HISTORY]: [],
  [STORAGE_KEYS.USER_PREFERENCES]: { theme: 'system', defaultTool: 'gpa' },
};

export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    window.dispatchEvent(new CustomEvent('storage-update', { detail: { key, value } }));
  } catch (e) { console.warn('Storage save failed', e); }
}

export function get(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : DEFAULT_STATE[key];
  } catch { return DEFAULT_STATE[key]; }
}

/**
 * Merge partial data into an existing stored object.
 * NOTE: This function is designed for object values.
 * If the current stored value is an array, a warning is logged
 * and the partial object will be spread over it (which breaks the array).
 * Use save() directly for array keys.
 */
export function update(key, partial) {
  const current = get(key);
  if (Array.isArray(current)) {
    console.warn(
      `storageService.update() called on array key "${key}". Use save() directly for array data.`
    );
  }
  const updated = { ...current, ...partial };
  save(key, updated);
}

/**
 * Remove a key from storage and notify listeners with the default value.
 * This effectively resets the state for that key (e.g., an empty array or null)
 * rather than leaving consumers with stale data.
 */
export function remove(key) {
  localStorage.removeItem(key);
  window.dispatchEvent(
    new CustomEvent('storage-update', { detail: { key, value: DEFAULT_STATE[key] } })
  );
}

/**
 * Clear all known storage keys.
 * NOTE: This fires one storage-update event per key, which may trigger
 * multiple re‑renders in listeners. For a bulk clear with a single event,
 * a dedicated function could be added in the future.
 */
export function clearAll() {
  Object.keys(STORAGE_KEYS).forEach(key => remove(key));
}

// Helper to append a recent action (limit 20)
export function addRecentAction(action) {
  const recent = get(STORAGE_KEYS.RECENT_ACTIONS);
  const newRecent = [action, ...recent.filter(a => a.id !== action.id)].slice(0, 20);
  save(STORAGE_KEYS.RECENT_ACTIONS, newRecent);
}