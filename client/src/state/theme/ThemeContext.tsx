import {
  createContext, useContext, useState, type ReactNode,
} from "react";

export type Theme = "dark" | "light";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: "dark",
  isDark: true,
  setTheme: () => {},
});

const STORAGE_KEY = "kyzen-dashboard-theme";

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_KEY) as Theme) ?? "dark",
  );

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  const isDark = theme === "dark";

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme }}>
      <div
        data-theme={theme}
        className="min-h-full h-full w-full transition-colors duration-300"
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Read a dashboard CSS variable from the themed wrapper (for SVG/canvas). */
export function getDashCssVar(name: `--dash-${string}`, el?: HTMLElement | null): string {
  const root = el ?? document.querySelector<HTMLElement>("[data-theme]");
  if (!root) return "";
  return getComputedStyle(root).getPropertyValue(name).trim();
}
