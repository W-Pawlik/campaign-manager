import { CssBaseline, ThemeProvider } from "@mui/material";
import { useEffect, useMemo, type PropsWithChildren } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setThemeMode } from "@/app/store/slices/uiSlice";
import { readLocalStorage, writeLocalStorage } from "@/core/storage/localStorage";
import { createAppTheme } from "@/shared/theme";

const themeModeStorageKey = "ui:theme-mode";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  useEffect(() => {
    const storedThemeMode = readLocalStorage<"light" | "dark">(themeModeStorageKey);

    if (storedThemeMode) {
      dispatch(setThemeMode(storedThemeMode));
    }
  }, [dispatch]);

  useEffect(() => {
    writeLocalStorage(themeModeStorageKey, themeMode);
  }, [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
