import type { PaletteMode, ThemeOptions } from "@mui/material";

export function createPalette(mode: PaletteMode): ThemeOptions["palette"] {
  const dark = mode === "dark";

  return {
    mode,
    background: {
      default: dark ? "#16110d" : "#f5efe2",
      paper: dark ? "#241a14" : "#fffaf0",
    },
    divider: dark ? "rgba(214, 184, 115, 0.18)" : "rgba(96, 67, 36, 0.18)",
    primary: {
      main: "#c9a24d",
      light: "#e4c878",
      dark: "#8f6a23",
      contrastText: "#1b130c",
    },
    secondary: {
      main: "#7f5539",
      light: "#a9774d",
      dark: "#513522",
      contrastText: "#fff8e8",
    },
    success: {
      main: "#6f9d55",
    },
    warning: {
      main: "#d99a36",
    },
    error: {
      main: "#c95c4d",
    },
    info: {
      main: "#5f9ea0",
    },
    text: {
      primary: dark ? "#f5ead7" : "#2c2118",
      secondary: dark ? "#c9b99a" : "#6e5b42",
    },
  };
}
