// src/contexts/ThemeProvider.jsx
import { useState, useEffect, useLayoutEffect, useCallback, useMemo, useRef } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../services/firebase.js';
import {
  getStoredTheme,
  setTheme as setThemeExternal,
  listenToSystemTheme,
} from '../theme-init';
import { ThemeContext } from './ThemeContext';

/* -------------------------------------------------------------------------- */
/*   Constants                                                                 */
/* -------------------------------------------------------------------------- */
const THEME_CYCLE = ['light', 'dark', 'system'];

/* -------------------------------------------------------------------------- */
/*   Helper: resolve effective visual theme                                    */
/* -------------------------------------------------------------------------- */
const resolveEffectiveTheme = (stored) => {
  if (typeof window === 'undefined') return 'light';
  if (stored === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return stored;
};

/* -------------------------------------------------------------------------- */
/*   Provider                                                                  */
/* -------------------------------------------------------------------------- */
export function ThemeProvider({ children }) {
  const initialStored = useRef(
    typeof window !== 'undefined' ? getStoredTheme() : 'system'
  ).current;

  const [theme, setThemeState] = useState(initialStored);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveEffectiveTheme(initialStored)
  );

  const prevThemeRef = useRef(theme);

  // Apply theme to DOM immediately (before paint)
  useLayoutEffect(() => {
    setThemeExternal(theme);
    const nextResolved = resolveEffectiveTheme(theme);
    setResolvedTheme(nextResolved);
  }, [theme]);

  // Track theme changes in analytics
  useEffect(() => {
    if (prevThemeRef.current !== theme && analytics) {
      logEvent(analytics, 'theme_change', {
        theme,
        resolved: resolveEffectiveTheme(theme),
      });
    }
    prevThemeRef.current = theme;
  }, [theme]);

  // Listen for system preference changes when on 'system'
  useEffect(() => {
    if (theme !== 'system') return;

    const cleanup = listenToSystemTheme((newResolved) => {
      setResolvedTheme(newResolved);
    });

    return cleanup;
  }, [theme]);

  // Actions
  const setTheme = useCallback((newTheme) => {
    if (!['light', 'dark', 'system'].includes(newTheme)) return;
    setThemeState(newTheme);
    setThemeExternal(newTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const idx = THEME_CYCLE.indexOf(prev);
      const next = THEME_CYCLE[(idx + 1) % THEME_CYCLE.length];
      setThemeExternal(next);
      return next;
    });
  }, []);

  const contextValue = useMemo(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
    }),
    [theme, resolvedTheme, setTheme, toggleTheme]
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}