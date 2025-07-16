import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const useThemeProvider = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check if theme is stored in localStorage
    const savedTheme = localStorage.getItem('theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    // Default to dark theme (keeping current behavior)
    return 'dark';
  });

  useEffect(() => {
    // Apply theme class to document element immediately
    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    
    // Also set attribute for better compatibility
    root.setAttribute('data-theme', theme);
    
    // Save theme to localStorage
    localStorage.setItem('theme', theme);
    
    console.log('Theme applied:', theme, 'Root classes:', root.className);
  }, [theme]);

  // Apply initial theme immediately on mount
  useEffect(() => {
    const root = document.documentElement;
    if (!root.classList.contains('light') && !root.classList.contains('dark')) {
      root.classList.add(theme);
      console.log('Initial theme applied:', theme);
    }
  }, []);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return {
    theme,
    toggleTheme,
    ThemeContext,
  };
};