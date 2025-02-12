import { useTheme } from './theme-provider';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex items-center gap-4">
      <select
        value={theme}
        onChange={(e) =>
          setTheme(e.target.value as 'light' | 'dark' | 'system')
        }
        className="border-input bg-background text-foreground hover:bg-accent hover:text-accent-foreground focus-visible:ring-ring h-9 rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none"
      >
        <option value="light">Light</option>
        <option value="dark">Dark</option>
        <option value="system">System</option>
      </select>
    </div>
  );
}
