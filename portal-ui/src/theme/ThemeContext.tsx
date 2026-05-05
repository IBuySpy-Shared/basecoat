import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';

export type Theme = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  isDarkMode: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider Component
 *
 * Provides theme context with automatic dark mode detection.
 * Stores user preference in localStorage.
 *
 * @example
 * <ThemeProvider>
 *   <App />
 * </ThemeProvider>
 */
export const ThemeProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  // Initialize theme on mount
  useEffect(() => {
    setMounted(true);

    // Get user preference
    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initialTheme: 'light' | 'dark' = 'light';

    if (stored === 'dark' || stored === 'auto') {
      initialTheme = stored === 'auto' && prefersDark ? 'dark' : 'light';
    } else if (stored === 'light') {
      initialTheme = 'light';
    } else if (prefersDark) {
      initialTheme = 'dark';
    }

    setThemeState(initialTheme);
    applyTheme(initialTheme);
  }, []);

  // Listen for system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme');
      if (stored === 'auto' || !stored) {
        const newTheme = e.matches ? 'dark' : 'light';
        setThemeState(newTheme);
        applyTheme(newTheme);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setTheme = (newTheme: Theme) => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let finalTheme: 'light' | 'dark' = 'light';

    if (newTheme === 'dark') {
      finalTheme = 'dark';
    } else if (newTheme === 'auto') {
      finalTheme = prefersDark ? 'dark' : 'light';
    }

    setThemeState(finalTheme);
    applyTheme(finalTheme);
    localStorage.setItem('theme', newTheme);
  };

  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        isDarkMode: theme === 'dark',
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

/**
 * Hook to access theme context
 */
export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

/**
 * Apply theme to DOM
 */
const applyTheme = (theme: 'light' | 'dark') => {
  if (theme === 'dark') {
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.style.colorScheme = 'light';
  }
};

export default ThemeProvider;
