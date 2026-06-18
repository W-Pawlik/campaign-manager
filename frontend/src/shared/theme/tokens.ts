export const fantasyTokens = {
  layout: {
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
    card: "0 18px 48px rgba(0, 0, 0, 0.24)",
    focus: "0 0 0 3px rgba(201, 162, 77, 0.28)",
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
