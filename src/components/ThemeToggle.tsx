import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="flex items-center gap-2 glass-card border-border/50 hover:bg-accent/50"
    >
      {theme === 'dark' ? (
        <>
          <Moon className="h-4 w-4" />
          <span className="hidden sm:inline">Sombre</span>
        </>
      ) : (
        <>
          <Sun className="h-4 w-4" />
          <span className="hidden sm:inline">Clair</span>
        </>
      )}
    </Button>
  );
};