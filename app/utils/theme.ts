// Function to check if dark mode should be enabled
export function shouldEnableDarkMode(): boolean {
  if (typeof window === 'undefined') return false;

  return (
    localStorage.theme === 'dark' ||
    (!('theme' in localStorage) &&
      window.matchMedia('(prefers-color-scheme: dark)').matches)
  );
}

// Function to initialize theme
export function initializeTheme(): void {
  if (typeof window === 'undefined') return;

  // On page load or when changing themes, best to add inline in `head` to avoid FOUC
  document.documentElement.classList.toggle('dark', shouldEnableDarkMode());
}

// Function to set theme
export function setTheme(theme: 'light' | 'dark' | 'system'): void {
  if (typeof window === 'undefined') return;

  if (theme === 'system') {
    localStorage.removeItem('theme');
  } else {
    localStorage.theme = theme;
  }

  initializeTheme();
}
