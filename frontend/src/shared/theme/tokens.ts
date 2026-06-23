export const fantasyTokens = {
  layout: {
    sidebarCollapsedWidth: 84,
    sidebarWidth: 288,
    topbarHeight: 64,
    contentMaxWidth: 1320,
  },
  radius: {
    sm: 6,
    md: 8,
    lg: 12,
  },
  shadows: {
    card: "0 24px 60px rgba(6, 8, 12, 0.22)",
    focus: "0 0 0 3px rgba(230, 22, 26, 0.26)",
  },
} as const;

export type FantasyTokens = typeof fantasyTokens;

declare module "@mui/material/styles" {
  interface Theme {
    fantasyTokens: FantasyTokens;
  }

  interface ThemeOptions {
    fantasyTokens?: FantasyTokens;
  }
}
