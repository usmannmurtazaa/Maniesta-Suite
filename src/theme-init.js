export function getStoredTheme() {
  try {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || theme === 'light' || theme === 'system') return theme;
  } catch {}
  return 'system';
}

export function applyThemeClass(theme) {
  const root = document.documentElement;
  if (theme === 'dark') root.classList.add('dark');
  else if (theme === 'light') root.classList.remove('dark');
  else {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle('dark', prefersDark);
  }
}

export function setTheme(theme) {
  if (theme === 'system') localStorage.removeItem('theme');
  else localStorage.setItem('theme', theme);
  applyThemeClass(theme);
}

export function initTheme() {
  const theme = getStoredTheme();
  applyThemeClass(theme);
  return theme;
}

export function listenToSystemTheme(onChange) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  const handler = () => {
    if (getStoredTheme() === 'system') {
      applyThemeClass('system');
      onChange(mq.matches ? 'dark' : 'light');
    }
  };
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}