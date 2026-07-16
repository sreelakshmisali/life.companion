import React, { createContext, useContext, useMemo, useState } from 'react';
import { Theme, ThemeId, themes, defaultThemeId } from './themes';

interface ThemeContextValue {
  theme: Theme;
  themeId: ThemeId;
  setThemeId: (id: ThemeId) => void;
  allThemes: Theme[];
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [themeId, setThemeId] = useState<ThemeId>(defaultThemeId);

  const value = useMemo(
    () => ({
      theme: themes[themeId],
      themeId,
      setThemeId,
      allThemes: Object.values(themes),
    }),
    [themeId]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useAppTheme must be used within a ThemeProvider');
  return ctx;
}
