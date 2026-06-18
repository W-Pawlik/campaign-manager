import type { ThemeOptions } from "@mui/material";

import { fantasyTokens } from "@/shared/theme/tokens";

export const components: ThemeOptions["components"] = {
  MuiAppBar: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
      }),
    },
  },
  MuiButton: {
    defaultProps: {
      disableElevation: true,
    },
    styleOverrides: {
      root: {
        borderRadius: fantasyTokens.radius.sm,
        minHeight: 40,
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        borderColor: theme.palette.divider,
        borderRadius: fantasyTokens.radius.md,
      }),
    },
  },
  MuiDialog: {
    styleOverrides: {
      paper: {
        borderRadius: fantasyTokens.radius.lg,
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: ({ theme }) => ({
        backgroundImage: "none",
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.paper,
      }),
    },
  },
  MuiMenu: {
    styleOverrides: {
      paper: {
        borderRadius: fantasyTokens.radius.md,
      },
    },
  },
  MuiPaper: {
    styleOverrides: {
      root: ({ theme }) => ({
        backgroundImage: "none",
        borderColor: theme.palette.divider,
        borderRadius: fantasyTokens.radius.md,
      }),
    },
  },
  MuiTabs: {
    styleOverrides: {
      indicator: ({ theme }) => ({
        backgroundColor: theme.palette.primary.main,
      }),
    },
  },
  MuiTextField: {
    defaultProps: {
      variant: "outlined",
    },
  },
  MuiTooltip: {
    styleOverrides: {
      tooltip: ({ theme }) => ({
        backgroundColor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        color: theme.palette.text.primary,
        fontSize: 12,
      }),
    },
  },
};
