import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { ConfigProvider, theme as antdTheme } from 'antd';
import esES from 'antd/locale/es_ES';
import { ThemeMode, getTheme, cssVariables } from '@/app/styles/theme';

interface ThemeContextType {
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'xplan-theme';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function getStoredTheme(): ThemeMode {
  if (typeof window === 'undefined') return 'system';
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && ['light', 'dark', 'system'].includes(stored)) {
    return stored as ThemeMode;
  }
  return 'system';
}

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // Cargar tema guardado
    const stored = getStoredTheme();
    setModeState(stored);

    // Resolver tema
    const resolved = stored === 'system' ? getSystemTheme() : stored;
    setResolvedTheme(resolved);
  }, []);

  useEffect(() => {
    // Escuchar cambios en el tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = () => {
      if (mode === 'system') {
        setResolvedTheme(getSystemTheme());
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [mode]);

  useEffect(() => {
    // Aplicar variables CSS
    const vars = cssVariables[resolvedTheme];
    Object.entries(vars).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });

    // Aplicar clase al body
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolvedTheme);

    // Meta theme-color para el navegador
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#141414' : '#1677ff');
    }
  }, [resolvedTheme]);

  const setMode = (newMode: ThemeMode) => {
    setModeState(newMode);
    localStorage.setItem(THEME_STORAGE_KEY, newMode);

    const resolved = newMode === 'system' ? getSystemTheme() : newMode;
    setResolvedTheme(resolved);
  };

  const toggleTheme = () => {
    const newMode = resolvedTheme === 'light' ? 'dark' : 'light';
    setMode(newMode);
  };

  const themeConfig = {
    ...getTheme(resolvedTheme),
    algorithm: resolvedTheme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
  };

  return (
    <ThemeContext.Provider
      value={{
        mode,
        isDark: resolvedTheme === 'dark',
        setMode,
        toggleTheme,
      }}
    >
      <ConfigProvider theme={themeConfig} locale={esES}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
