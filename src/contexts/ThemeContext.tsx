import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type ThemePreference = 'system' | 'light' | 'dark';
export type EffectiveTheme = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemePreference;
  effectiveTheme: EffectiveTheme;
  isDark: boolean;
  isLight: boolean;
  setTheme: (theme: ThemePreference) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'theme';

function getSystemTheme(): EffectiveTheme {
  if (typeof window === 'undefined') return 'dark';
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveEffectiveTheme(pref: ThemePreference): EffectiveTheme {
  if (pref === 'system') {
    return getSystemTheme();
  }
  return pref;
}

function applyThemeClasses(effective: EffectiveTheme) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  if (effective === 'dark') {
    root.classList.add('dark');
    root.classList.remove('light');
    root.style.colorScheme = 'dark';
  } else {
    root.classList.add('light');
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemePreference>(() => {
    if (typeof window === 'undefined') return 'system';
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored as ThemePreference;
    }
    return 'system';
  });

  const [effectiveTheme, setEffectiveTheme] = useState<EffectiveTheme>(() => {
    return resolveEffectiveTheme(theme);
  });

  const setTheme = useCallback((newTheme: ThemePreference) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    const resolved = resolveEffectiveTheme(newTheme);
    setEffectiveTheme(resolved);
    applyThemeClasses(resolved);
  }, []);

  const toggleTheme = useCallback(() => {
    const next: ThemePreference = effectiveTheme === 'dark' ? 'light' : 'dark';
    setTheme(next);
  }, [effectiveTheme, setTheme]);

  // Synchronize on mount and apply classes immediately
  useEffect(() => {
    const resolved = resolveEffectiveTheme(theme);
    setEffectiveTheme(resolved);
    applyThemeClasses(resolved);
  }, [theme]);

  // Listen for device / system appearance changes live
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = (e: MediaQueryListEvent) => {
      const currentPref = (localStorage.getItem(THEME_STORAGE_KEY) as ThemePreference) || 'system';
      if (currentPref === 'system') {
        const newEffective: EffectiveTheme = e.matches ? 'dark' : 'light';
        setEffectiveTheme(newEffective);
        applyThemeClasses(newEffective);
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else if ((mediaQuery as any).addListener) {
      (mediaQuery as any).addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else if ((mediaQuery as any).removeListener) {
        (mediaQuery as any).removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        effectiveTheme,
        isDark: effectiveTheme === 'dark',
        isLight: effectiveTheme === 'light',
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
