/**
 * ⚠️ DEPRECATED THEME CONFIGURATION
 *
 * This file originally provided a centralized design‑token system.
 * The application has since migrated to Tailwind CSS with utility classes
 * and uses the global font stack "Inter" (see index.html and tailwind.config).
 *
 * The `generateCSSVariables` function and the `typography` scale are no longer
 * actively consumed.  They are kept here for reference only and may be removed
 * in a future cleanup.
 *
 * If you need to modify the visual appearance, prefer updating the Tailwind
 * configuration or the global styles in `src/index.css`.
 */

const theme = {
  colors: {
    primary: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryDark: '#6d28d9',
    backgroundDark: '#080617',
    backgroundLight: '#f5f5f5',
    cardDark: 'rgba(255,255,255,0.03)',
    cardLight: 'rgba(0,0,0,0.02)',
    borderDark: 'rgba(255,255,255,0.08)',
    borderLight: 'rgba(0,0,0,0.08)',
    textPrimaryDark: '#fff',
    textPrimaryLight: '#333',
    textSecondaryDark: 'rgba(255,255,255,0.5)',
    textSecondaryLight: 'rgba(0,0,0,0.5)',
    error: '#f87171',
    success: '#34d399',
    warning: '#fbbf24',
    // Gradient stops – these could be derived from the primary palette in the future
    gradientDark1: '#1a1035',
    gradientDark2: '#2d1b4e',
  },
  spacing: {
    xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32, xxxxl: 48,
    section: 'clamp(32px, 6vw, 64px)',
  },
  borderRadius: {
    sm: 8, md: 12, lg: 16, xl: 20, full: 9999,
  },
  // Fonts now match the global app stack (Inter)
  fonts: {
    heading: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    body: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    mono: "'JetBrains Mono', monospace",
  },
  shadows: {
    sm: '0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06)',
    md: '0 4px 12px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
    lg: '0 12px 32px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04)',
    xl: '0 20px 48px rgba(0,0,0,0.12), 0 8px 16px rgba(0,0,0,0.04)',
    glow: '0 0 20px rgba(124, 58, 237, 0.15)',
    darkSm: '0 1px 3px rgba(0,0,0,0.2), 0 1px 2px rgba(0,0,0,0.3)',
    darkMd: '0 4px 12px rgba(0,0,0,0.3), 0 1px 2px rgba(0,0,0,0.2)',
    darkLg: '0 12px 32px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.2)',
    darkGlow: '0 0 24px rgba(124, 58, 237, 0.25)',
  },
  animation: '0.3s ease',
  breakpoints: {
    xs: 320, sm: 480, md: 768, lg: 1024, xl: 1280, xxl: 1536,
  },
  zIndex: {
    dropdown: 10, sticky: 20, modal: 100, toast: 200, tooltip: 300,
  },
  // The `typography` object is kept for reference but is not currently used.
  // typography: { ... },
  transitions: {
    fast: '0.15s cubic-bezier(0.4, 0, 0.2, 1)',
    base: '0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '0.5s cubic-bezier(0.4, 0, 0.2, 1)',
    spring: '0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

/**
 * Generates a set of CSS custom properties based on the current theme mode.
 * Note: This function is no longer actively used in the application.
 * Kept for potential backward compatibility with legacy components.
 */
export function generateCSSVariables(darkMode) {
  return {
    '--color-primary': theme.colors.primary,
    '--color-primary-light': theme.colors.primaryLight,
    '--color-primary-dark': theme.colors.primaryDark,
    '--bg-app': darkMode
      ? `linear-gradient(135deg, ${theme.colors.backgroundDark}, ${theme.colors.gradientDark1} 25%, ${theme.colors.gradientDark2} 75%, ${theme.colors.backgroundDark})`
      : `linear-gradient(135deg, ${theme.colors.backgroundLight}, #eef1ff 25%, #f0e6ff 75%, ${theme.colors.backgroundLight})`,
    '--bg-ambient': darkMode
      ? 'radial-gradient(circle at 20% 80%, rgba(120,50,220,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80,150,255,0.06) 0%, transparent 50%)'
      : 'radial-gradient(circle at 20% 80%, rgba(120,50,220,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(80,150,255,0.03) 0%, transparent 50%)',
    '--text-primary': darkMode ? theme.colors.textPrimaryDark : theme.colors.textPrimaryLight,
    '--text-secondary': darkMode ? theme.colors.textSecondaryDark : theme.colors.textSecondaryLight,
    '--text-tertiary': darkMode ? 'rgba(255,255,255,0.45)' : 'rgba(0,0,0,0.45)',
    '--glass-bg': darkMode ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.7)',
    '--glass-border': darkMode ? theme.colors.borderDark : theme.colors.borderLight,
    '--glass-shadow': darkMode ? '0 8px 32px rgba(0,0,0,0.2)' : '0 8px 32px rgba(0,0,0,0.06)',
    '--card-bg': darkMode ? theme.colors.cardDark : theme.colors.cardLight,
    '--card-border': darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
    '--color-error': theme.colors.error,
    '--color-success': theme.colors.success,
    '--color-warning': theme.colors.warning,
    '--focus-ring': theme.colors.primary,
    '--scrollbar-thumb': '#7c3aed44',
    '--scrollbar-thumb-hover': '#7c3aed66',
    '--animation-duration': '0.3s',
    '--animation-easing': 'cubic-bezier(0.4, 0, 0.2, 1)',
  };
}

export default theme;