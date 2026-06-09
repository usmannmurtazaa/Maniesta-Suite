import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
  useLayoutEffect,
} from "react";
import { logEvent } from "firebase/analytics";
import { analytics } from "../services/firebase";
import {
  getStoredTheme,
  setTheme as setThemeExternal,
  listenToSystemTheme,
} from "../theme-init";

export const ThemeContext = createContext();

const THEME_CYCLE = ["light", "dark", "system"];

const resolveEffectiveTheme = (stored) => {
  if (typeof window === "undefined") return "light";
  if (stored === "system") {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  }
  return stored;
};

export function ThemeProvider({ children }) {
  const initialStored = useRef(
    typeof window !== "undefined" ? getStoredTheme() : "system",
  ).current;

  const [theme, setThemeState] = useState(initialStored);
  const [resolvedTheme, setResolvedTheme] = useState(() =>
    resolveEffectiveTheme(initialStored),
  );

  const prevThemeRef = useRef(theme);

  // Apply theme to DOM immediately (before paint)
  useLayoutEffect(() => {
    setThemeExternal(theme);
    setResolvedTheme(resolveEffectiveTheme(theme));
  }, [theme]);

  // Track theme changes in analytics
  useEffect(() => {
    if (prevThemeRef.current !== theme && analytics) {
      logEvent(analytics, "theme_change", {
        theme,
        resolved: resolveEffectiveTheme(theme),
      });
    }
    prevThemeRef.current = theme;
  }, [theme]);

  // Listen for system preference changes when on 'system'
  useEffect(() => {
    if (theme !== "system") return;
    const cleanup = listenToSystemTheme(() => {
      setResolvedTheme(resolveEffectiveTheme(theme));
    });
    return cleanup;
  }, [theme]);

  const setTheme = useCallback((newTheme) => {
    if (!THEME_CYCLE.includes(newTheme)) return;
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
    [theme, resolvedTheme, setTheme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
