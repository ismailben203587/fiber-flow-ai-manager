import { ReactNode } from 'react';
import { useThemeProvider } from '@/hooks/useTheme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const { theme, toggleTheme, ThemeContext } = useThemeProvider();

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};