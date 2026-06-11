// src/hooks/useUserActivity.js
import { useState, useEffect } from 'react';

const STORAGE_KEYS = {
  RECENT_ACTIONS: 'maniesta_recent_actions',
  LAST_GPA: 'maniesta_last_gpa',
  LAST_CURRENCY: 'maniesta_last_currency',
  EXPORT_HISTORY: 'maniesta_export_history',
  FAVORITE_TOOLS: 'maniesta_favorite_tools',
};

export function useUserActivity() {
  const [lastGPA, setLastGPA] = useState(null);
  const [lastCurrency, setLastCurrency] = useState(null);
  const [lastExport, setLastExport] = useState(null);
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [recentActions, setRecentActions] = useState([]);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setLastGPA(JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_GPA) || 'null'));
      setLastCurrency(JSON.parse(localStorage.getItem(STORAGE_KEYS.LAST_CURRENCY) || 'null'));
      const exports = JSON.parse(localStorage.getItem(STORAGE_KEYS.EXPORT_HISTORY) || '[]');
      setLastExport(exports[0] || null);
      setFavoriteTools(JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVORITE_TOOLS) || '[]'));
      setRecentActions(JSON.parse(localStorage.getItem(STORAGE_KEYS.RECENT_ACTIONS) || '[]'));
    };
    handleStorageUpdate();
    window.addEventListener('storage-update', handleStorageUpdate);
    return () => window.removeEventListener('storage-update', handleStorageUpdate);
  }, []);

  return { lastGPA, lastCurrency, lastExport, favoriteTools, recentActions };
}