// src/contexts/DashboardProvider.jsx
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { get, save, STORAGE_KEYS, addRecentAction } from '../services/storageService';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [recentActions, setRecentActions] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [lastGPA, setLastGPA] = useState(null);
  const [lastCurrency, setLastCurrency] = useState(null);
  const [exportHistory, setExportHistory] = useState([]);
  const [preferences, setPreferences] = useState({});

  // Load all on mount
  useEffect(() => {
    setRecentActions(get(STORAGE_KEYS.RECENT_ACTIONS));
    setFavoriteTools(get(STORAGE_KEYS.FAVORITE_TOOLS));
    setLastGPA(get(STORAGE_KEYS.LAST_GPA));
    setLastCurrency(get(STORAGE_KEYS.LAST_CURRENCY));
    setExportHistory(get(STORAGE_KEYS.EXPORT_HISTORY));
    setPreferences(get(STORAGE_KEYS.USER_PREFERENCES));
  }, []);

  // Listen to cross‑component / cross‑tab storage updates
  useEffect(() => {
    const handler = (e) => {
      if (e.detail?.key === STORAGE_KEYS.RECENT_ACTIONS) setRecentActions(e.detail.value);
      if (e.detail?.key === STORAGE_KEYS.FAVORITE_TOOLS) setFavoriteTools(e.detail.value);
      if (e.detail?.key === STORAGE_KEYS.LAST_GPA) setLastGPA(e.detail.value);
      if (e.detail?.key === STORAGE_KEYS.LAST_CURRENCY) setLastCurrency(e.detail.value);
      if (e.detail?.key === STORAGE_KEYS.EXPORT_HISTORY) setExportHistory(e.detail.value);
      if (e.detail?.key === STORAGE_KEYS.USER_PREFERENCES) setPreferences(e.detail.value);
    };
    window.addEventListener('storage-update', handler);
    return () => window.removeEventListener('storage-update', handler);
  }, []);

  // Action: add recent (auto‑saved)
  const addRecent = useCallback((action) => {
    addRecentAction(action);
    setRecentActions(prev => [action, ...prev.filter(a => a.id !== action.id)].slice(0, 20));
  }, []);

  // Favorite tools
  const toggleFavorite = useCallback((toolId) => {
    const newFav = favoriteTools.includes(toolId)
      ? favoriteTools.filter(id => id !== toolId)
      : [...favoriteTools, toolId];
    setFavoriteTools(newFav);
    save(STORAGE_KEYS.FAVORITE_TOOLS, newFav);
  }, [favoriteTools]);

  // Save GPA after calculation
  const saveGPA = useCallback((gpaData) => {
    setLastGPA(gpaData);
    save(STORAGE_KEYS.LAST_GPA, gpaData);
    addRecent({ id: `gpa-${Date.now()}`, type: 'gpa', value: gpaData.gpa, credits: gpaData.credits, timestamp: Date.now() });
  }, [addRecent]);

  // Save currency conversion
  const saveCurrency = useCallback((convData) => {
    setLastCurrency(convData);
    save(STORAGE_KEYS.LAST_CURRENCY, convData);
    addRecent({ id: `currency-${Date.now()}`, type: 'currency', from: convData.from, to: convData.to, value: convData.value, result: convData.result, timestamp: Date.now() });
  }, [addRecent]);

  // Save export record
  const addExportRecord = useCallback((exportData) => {
    const newHistory = [exportData, ...exportHistory].slice(0, 15);
    setExportHistory(newHistory);
    save(STORAGE_KEYS.EXPORT_HISTORY, newHistory);
    addRecent({ id: `export-${Date.now()}`, type: 'export', filename: exportData.filename, timestamp: Date.now() });
  }, [exportHistory, addRecent]);

  const value = {
    recentActions,
    favoriteTools,
    lastGPA,
    lastCurrency,
    exportHistory,
    preferences,
    addRecent,
    toggleFavorite,
    saveGPA,
    saveCurrency,
    addExportRecord,
    setPreferences,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

export const useDashboard = () => useContext(DashboardContext);