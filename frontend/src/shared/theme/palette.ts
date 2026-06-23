import type { PaletteMode, ThemeOptions } from "@mui/material";

export function createPalette(mode: PaletteMode): ThemeOptions["palette"] {
  const dark = mode === "dark";

  return {
    mode,
    background: {
      default: dark ? "#111216" : "#ffffff",
      paper: dark ? "#1a1c22" : "#ffffff",
    },
    divider: dark ? "rgba(255, 255, 255, 0.08)" : "rgba(17, 18, 22, 0.08)",
    primary: {
      main: "#e6161a",
      light: "#ff5a5d",
      dark: "#b60f14",
      contrastText: "#ffffff",
    },
    secondary: {
      main: dark ? "#3d4049" : "#e8eaef",
      light: dark ? "#50545f" : "#f3f4f7",
      dark: dark ? "#2a2d34" : "#d3d7df",
      contrastText: dark ? "#f5f7fb" : "#17181c",
    },
    success: {
      main: "#2eae67",
    },
    warning: {
      main: "#e0a100",
    },
    error: {
      main: "#e6161a",
    },
    info: {
      main: "#3f8cff",
    },
    text: {
      primary: dark ? "#f5f7fb" : "#17181c",
      secondary: dark ? "#a4acb9" : "#5f6775",
    },
  };
}
