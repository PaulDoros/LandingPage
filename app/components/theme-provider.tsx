import { createContext, useContext, type ReactNode } from 'react';

interface ThemeContextType {
  colors: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
  };
  typography: {
    fontFamily: string;
    fontSize: {
      base: string;
      heading1: string;
      heading2: string;
      heading3: string;
      paragraph: string;
    };
  };
}

const defaultTheme: ThemeContextType = {
  colors: {
    primary: '#3b82f6',
    secondary: '#1e40af',
    background: '#ffffff',
    text: '#000000',
    accent: '#f59e0b',
  },
  typography: {
    fontFamily: 'Inter',
    fontSize: {
      base: '16px',
      heading1: '48px',
      heading2: '36px',
      heading3: '24px',
      paragraph: '16px',
    },
  },
};

const ThemeContext = createContext<ThemeContextType>(defaultTheme);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    return defaultTheme;
  }
  return context;
}

interface ThemeProviderProps {
  children: ReactNode;
  theme?: ThemeContextType;
}

export function ThemeProvider({
  children,
  theme = defaultTheme,
}: ThemeProviderProps) {
  const themeValue = theme || defaultTheme;

  // Create CSS variables for the theme
  const cssVariables = {
    '--color-primary': themeValue.colors.primary,
    '--color-secondary': themeValue.colors.secondary,
    '--color-background': themeValue.colors.background,
    '--color-text': themeValue.colors.text,
    '--color-accent': themeValue.colors.accent,
    '--font-family': themeValue.typography.fontFamily,
    '--font-size-base': themeValue.typography.fontSize.base,
    '--font-size-h1': themeValue.typography.fontSize.heading1,
    '--font-size-h2': themeValue.typography.fontSize.heading2,
    '--font-size-h3': themeValue.typography.fontSize.heading3,
    '--font-size-p': themeValue.typography.fontSize.paragraph,
  } as React.CSSProperties;

  return (
    <ThemeContext.Provider value={themeValue}>
      <div
        style={cssVariables}
        className="min-h-screen bg-[var(--color-background)] text-[var(--color-text)]"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}
