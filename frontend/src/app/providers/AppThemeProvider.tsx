import { CssBaseline, ThemeProvider } from "@mui/material";
import { useMemo, type PropsWithChildren } from "react";

import { useAppSelector } from "@/app/store/hooks";
import { createAppTheme } from "@/shared/theme";

export function AppThemeProvider({ children }: PropsWithChildren) {
  const themeMode = useAppSelector((state) => state.ui.themeMode);
  const theme = useMemo(() => createAppTheme(themeMode), [themeMode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
