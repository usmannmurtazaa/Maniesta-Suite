import { createContext, useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../services/firebase';
import { getStoredTheme, setTheme as setThemeExternal, listenToSystemTheme } from '../theme-init';

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => {
    if (typeof window !== 'undefined') return getStoredTheme();
    return 'system';
  });

  const applyAndPersistTheme = useCallback((newTheme) => {
    setThemeExternal(newTheme);
    setThemeState(newTheme);
  }, []);

  const prevThemeRef = useRef(theme);
  useEffect(() => {
    if (prevThemeRef.current !== theme && analytics) {
      logEvent(analytics, 'theme_change', { theme });
    }
    prevThemeRef.current = theme;
  }, [theme]);

  useEffect(() => {
    if (theme === 'system') {
      const cleanup = listenToSystemTheme(() => setThemeState('system'));
      return cleanup;
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setThemeState(prev => {
      const next = prev === 'light' ? 'dark' : prev === 'dark' ? 'system' : 'light';
      setThemeExternal(next);
      return next;
    });
  }, []);

  const contextValue = useMemo(() => ({
    theme,
    setTheme: applyAndPersistTheme,
    toggleTheme,
  }), [theme, applyAndPersistTheme, toggleTheme]);

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}