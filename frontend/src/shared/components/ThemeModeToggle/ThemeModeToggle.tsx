import { Button, type ButtonProps } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { toggleThemeMode } from "@/app/store/slices/uiSlice";

type ThemeModeToggleProps = Omit<ButtonProps, "onClick">;

export function ThemeModeToggle(props: ThemeModeToggleProps) {
  const dispatch = useAppDispatch();
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  const nextModeLabel = themeMode === "dark" ? "Light mode" : "Dark mode";

  return (
    <Button
      color="inherit"
      onClick={() => dispatch(toggleThemeMode())}
      variant="outlined"
      {...props}
    >
      {nextModeLabel}
    </Button>
  );
}
