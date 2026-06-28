import type { ThemeOptions } from "@mui/material";

import { fantasyTokens } from "@/shared/theme/tokens";

export const components: ThemeOptions["components"] = {
  MuiCssBaseline: {
    styleOverrides: (theme) => ({
      "*": {
        scrollbarColor: `rgba(173, 138, 86, 0.46) rgba(255, 255, 255, 0.06)`,
        scrollbarWidth: "thin",
      },
      "*::-webkit-scrollbar": {
        height: 10,
        width: 10,
      },
      "*::-webkit-scrollbar-track": {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(255,255,255,0.025) 0%, rgba(255,255,255,0.015) 100%)"
            : "rgba(17, 18, 22, 0.06)",
        borderRadius: fantasyTokens.radius.lg,
      },
      "*::-webkit-scrollbar-thumb": {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(166, 129, 78, 0.48) 0%, rgba(97, 67, 36, 0.72) 100%)"
            : "linear-gradient(180deg, rgba(166, 129, 78, 0.5) 0%, rgba(110, 78, 43, 0.72) 100%)",
        backgroundClip: "padding-box",
        border: "2px solid transparent",
        borderRadius: fantasyTokens.radius.lg,
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
      },
      "*::-webkit-scrollbar-thumb:hover": {
        background:
          theme.palette.mode === "dark"
            ? "linear-gradient(180deg, rgba(199, 160, 101, 0.62) 0%, rgba(120, 84, 48, 0.84) 100%)"
            : "linear-gradient(180deg, rgba(194, 156, 101, 0.66) 0%, rgba(128, 90, 51, 0.84) 100%)",
      },
      "*::-webkit-scrollbar-corner": {
        background: "transparent",
      },
    }),
  },
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
      root: ({ theme }) => ({
        borderRadius: fantasyTokens.radius.sm,
        minHeight: 40,
        ...(theme.palette.mode === "light"
          ? {}
          : {
              "&.MuiButton-outlined": {
                borderColor: "rgba(255, 255, 255, 0.14)",
              },
            }),
      }),
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
  MuiOutlinedInput: {
    styleOverrides: {
      root: ({ theme }) => ({
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.divider,
        },
        "&:hover .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.primary.main,
        },
      }),
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
