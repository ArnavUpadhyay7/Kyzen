import {
  createContext, useContext, useEffect, useState, type ReactNode,
} from "react";

export type Theme = "dark" | "light";

// ── Token shape ───────────────────────────────────────────────────────────────

export interface ThemeTokens {
  // Surfaces
  page:          string;
  card:          string;
  cardHover:     string;
  cardAlt:       string;
  modal:         string;
  sidebar:       string;
  sidebarBorder: string;
  topbar:        string;

  // Borders
  border:        string;
  borderMed:     string;

  // Text
  textPrimary:   string;
  textSecondary: string;
  textMuted:     string;
  textFaint:     string;

  // Interactive
  mutedBtn:      string;
  mutedBtnHov:   string;
  inputBg:       string;
  inputBorder:   string;

  // Accents (same in both themes)
  accent:        string;
  accentSoft:    string;
  accentBorder:  string;
  violet:        string;

  // Semantic colours
  success:       string;
  warning:       string;
  danger:        string;
  orange:        string;

  // Contribution graph
  graphEmpty:    string;
  graphL1:       string;
  graphL2:       string;
  graphL3:       string;
  graphL4:       string;
  graphLabel:    string;   // month label fill
  graphDayLabel: string;   // Mon/Wed/Fri fill
  contribText:   string;   // "N tasks completed…" muted colour

  // Theme flag
  isDark:        boolean;
}

// ── Dark palette ──────────────────────────────────────────────────────────────

const DARK: ThemeTokens = {
  page:          "#0c0c0f",
  card:          "#111115",
  cardHover:     "#16161a",
  cardAlt:       "rgba(255,255,255,0.025)",
  modal:         "#111115",
  sidebar:       "#0e0e12",
  sidebarBorder: "rgba(255,255,255,0.05)",
  topbar:        "rgba(11,11,15,0.95)",

  border:        "rgba(255,255,255,0.06)",
  borderMed:     "rgba(255,255,255,0.10)",

  textPrimary:   "#ffffff",
  textSecondary: "#bbbbbb",
  textMuted:     "#666666",
  textFaint:     "#3a3a3a",

  mutedBtn:      "rgba(255,255,255,0.05)",
  mutedBtnHov:   "rgba(255,255,255,0.09)",
  inputBg:       "rgba(255,255,255,0.04)",
  inputBorder:   "rgba(255,255,255,0.07)",

  accent:        "#6366f1",
  accentSoft:    "rgba(99,102,241,0.15)",
  accentBorder:  "rgba(99,102,241,0.25)",
  violet:        "#8b5cf6",

  success:       "#4ade80",
  warning:       "#facc15",
  danger:        "#f87171",
  orange:        "#f97316",

  graphEmpty:    "rgba(255,255,255,0.05)",
  graphL1:       "rgba(99,102,241,0.25)",
  graphL2:       "rgba(99,102,241,0.45)",
  graphL3:       "rgba(99,102,241,0.70)",
  graphL4:       "#6366f1",
  graphLabel:    "#444",
  graphDayLabel: "#3a3a3a",
  contribText:   "#888",

  isDark:        true,
};

// ── Light palette ─────────────────────────────────────────────────────────────

const LIGHT: ThemeTokens = {
  page:          "#f0f0f5",
  card:          "#ffffff",
  cardHover:     "#f8f8fc",
  cardAlt:       "rgba(0,0,0,0.03)",
  modal:         "#ffffff",
  sidebar:       "#fafafa",
  sidebarBorder: "rgba(0,0,0,0.08)",
  topbar:        "rgba(250,250,250,0.96)",

  border:        "rgba(0,0,0,0.08)",
  borderMed:     "rgba(0,0,0,0.13)",

  textPrimary:   "#0d0d10",
  textSecondary: "#444450",
  textMuted:     "#88889a",
  textFaint:     "#bbbbcc",

  mutedBtn:      "rgba(0,0,0,0.06)",
  mutedBtnHov:   "rgba(0,0,0,0.10)",
  inputBg:       "rgba(0,0,0,0.04)",
  inputBorder:   "rgba(0,0,0,0.10)",

  accent:        "#6366f1",
  accentSoft:    "rgba(99,102,241,0.12)",
  accentBorder:  "rgba(99,102,241,0.30)",
  violet:        "#8b5cf6",

  success:       "#16a34a",
  warning:       "#ca8a04",
  danger:        "#dc2626",
  orange:        "#ea580c",

  graphEmpty:    "rgba(0,0,0,0.07)",
  graphL1:       "rgba(99,102,241,0.20)",
  graphL2:       "rgba(99,102,241,0.38)",
  graphL3:       "rgba(99,102,241,0.58)",
  graphL4:       "#6366f1",
  graphLabel:    "#aaa",
  graphDayLabel: "#bbb",
  contribText:   "#666",

  isDark:        false,
};

// ── Context ───────────────────────────────────────────────────────────────────

interface ThemeContextValue {
  theme:    Theme;
  tokens:   ThemeTokens;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme:    "dark",
  tokens:   DARK,
  setTheme: () => {},
});

const STORAGE_KEY = "kyzen-dashboard-theme";

export function DashboardThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem(STORAGE_KEY) as Theme) ?? "dark"
  );

  const setTheme = (t: Theme) => {
    setThemeState(t);
    localStorage.setItem(STORAGE_KEY, t);
  };

  return (
    <ThemeContext.Provider value={{ theme, tokens: theme === "dark" ? DARK : LIGHT, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

/** Shorthand used in every dashboard component. */
export function useTokens(): ThemeTokens {
  return useContext(ThemeContext).tokens;
}