import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { PaletteMode } from "@mui/material";

type UiState = {
  sidebarOpen: boolean;
  themeMode: PaletteMode;
};

const initialState: UiState = {
  sidebarOpen: true,
  themeMode: "dark",
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setSidebarOpen(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload;
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setThemeMode(state, action: PayloadAction<PaletteMode>) {
      state.themeMode = action.payload;
    },
    toggleThemeMode(state) {
      state.themeMode = state.themeMode === "dark" ? "light" : "dark";
    },
  },
});

export const { setSidebarOpen, toggleSidebar, setThemeMode, toggleThemeMode } = uiSlice.actions;
export const uiReducer = uiSlice.reducer;
