import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/hooks/useTheme';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center space-x-3 p-2">
      <Sun className="h-4 w-4 text-muted-foreground" />
      <div className="flex items-center space-x-2">
        <Switch
          id="theme-toggle"
          checked={theme === 'dark'}
          onCheckedChange={toggleTheme}
          className="data-[state=checked]:bg-primary"
        />
        <Label htmlFor="theme-toggle" className="sr-only">
          Toggle theme
        </Label>
      </div>
      <Moon className="h-4 w-4 text-muted-foreground" />
    </div>
  );
};