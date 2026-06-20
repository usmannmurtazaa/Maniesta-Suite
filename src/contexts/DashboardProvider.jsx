import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { get, save, STORAGE_KEYS, addRecentAction } from '../services/storageService';

const DashboardContext = createContext();

export function DashboardProvider({ children }) {
  const [recentActions, setRecentActions] = useState([]);
  const [favoriteTools, setFavoriteTools] = useState([]);
  const [lastGPA, setLastGPA] = useState(null);
  const [lastCurrency, setLastCurrency] = useState(null);
  const [exportHistory, setExportHistory] = useState([]);
  const [preferences, setPreferences] = useState({});

  // Unique ID counter – avoids duplicate keys even for rapid calls
  const idCounterRef = useRef(0);

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

  // Favorite tools – now uses functional update to avoid stale closure
  const toggleFavorite = useCallback((toolId) => {
    setFavoriteTools(prev => {
      const newFav = prev.includes(toolId)
        ? prev.filter(id => id !== toolId)
        : [...prev, toolId];
      save(STORAGE_KEYS.FAVORITE_TOOLS, newFav);
      return newFav;
    });
  }, []); // stable – no dependency on favoriteTools

  // Save GPA after calculation – uses unique ID
  const saveGPA = useCallback((gpaData) => {
    const id = `gpa-${Date.now()}-${++idCounterRef.current}`;
    setLastGPA(gpaData);
    save(STORAGE_KEYS.LAST_GPA, gpaData);
    addRecent({ id, type: 'gpa', value: gpaData.gpa, credits: gpaData.credits, timestamp: Date.now() });
  }, [addRecent]);

  // Save currency conversion – uses unique ID
  const saveCurrency = useCallback((convData) => {
    const id = `currency-${Date.now()}-${++idCounterRef.current}`;
    setLastCurrency(convData);
    save(STORAGE_KEYS.LAST_CURRENCY, convData);
    addRecent({ id, type: 'currency', from: convData.from, to: convData.to, value: convData.value, result: convData.result, timestamp: Date.now() });
  }, [addRecent]);

  // Save export record – functional update, no stale closure, unique ID
  const addExportRecord = useCallback((exportData) => {
    const id = `export-${Date.now()}-${++idCounterRef.current}`;
    setExportHistory(prev => {
      const newHistory = [exportData, ...prev].slice(0, 15);
      save(STORAGE_KEYS.EXPORT_HISTORY, newHistory);
      return newHistory;
    });
    addRecent({ id, type: 'export', filename: exportData.filename, timestamp: Date.now() });
  }, [addRecent]);

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