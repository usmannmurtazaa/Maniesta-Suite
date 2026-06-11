// src/hooks/useUserActivity.js
import { useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../services/storageService';

// Helper: safely parse JSON, returning a fallback on error
function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

export function useUserActivity() {
  // Combine all activity data into a single state object to batch updates
  const [activity, setActivity] = useState({
    lastGPA: null,
    lastCurrency: null,
    lastExport: null,
    favoriteTools: [],
    recentActions: [],
  });

  useEffect(() => {
    const handleStorageUpdate = () => {
      const lastGPA = safeParse(localStorage.getItem(STORAGE_KEYS.LAST_GPA), null);
      const lastCurrency = safeParse(localStorage.getItem(STORAGE_KEYS.LAST_CURRENCY), null);
      const exports = safeParse(localStorage.getItem(STORAGE_KEYS.EXPORT_HISTORY), []);
      const lastExport = exports[0] || null;
      const favoriteTools = safeParse(localStorage.getItem(STORAGE_KEYS.FAVORITE_TOOLS), []);
      const recentActions = safeParse(localStorage.getItem(STORAGE_KEYS.RECENT_ACTIONS), []);

      // Single state update prevents cascading re‑renders
      setActivity({ lastGPA, lastCurrency, lastExport, favoriteTools, recentActions });
    };

    handleStorageUpdate();
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  // Return the individual values for convenience (matches previous API)
  return {
    lastGPA: activity.lastGPA,
    lastCurrency: activity.lastCurrency,
    lastExport: activity.lastExport,
    favoriteTools: activity.favoriteTools,
    recentActions: activity.recentActions,
  };
}