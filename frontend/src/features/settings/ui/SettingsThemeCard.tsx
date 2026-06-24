import { Alert, Button, Chip, Stack, Typography } from "@mui/material";

import type { PaletteMode } from "@mui/material";

type SettingsThemeCardProps = {
  currentThemeMode: PaletteMode;
  isSubmitting: boolean;
  onSelectThemeMode: (mode: PaletteMode) => void;
  savedThemeMode?: PaletteMode | null;
};

export function SettingsThemeCard({
  currentThemeMode,
  isSubmitting,
  onSelectThemeMode,
  savedThemeMode,
}: SettingsThemeCardProps) {
  const isSynced = savedThemeMode === currentThemeMode;

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h6">Theme mode</Typography>
        <Chip
          color={currentThemeMode === "dark" ? "primary" : "default"}
          label={currentThemeMode === "dark" ? "Dark mode active" : "Light mode active"}
          size="small"
          variant={currentThemeMode === "dark" ? "filled" : "outlined"}
        />
      </Stack>
      <Typography color="text.secondary">
        Adjust the workspace look for planning sessions, reviewing notes, and running your campaign.
      </Typography>
      <Stack direction="row" spacing={1.5}>
        <Button
          disabled={isSubmitting || currentThemeMode === "dark"}
          onClick={() => onSelectThemeMode("dark")}
          variant={currentThemeMode === "dark" ? "contained" : "outlined"}
        >
          Dark mode
        </Button>
        <Button
          disabled={isSubmitting || currentThemeMode === "light"}
          onClick={() => onSelectThemeMode("light")}
          variant={currentThemeMode === "light" ? "contained" : "outlined"}
        >
          Light mode
        </Button>
      </Stack>
      <Alert severity="info" variant="outlined">
        {isSynced
          ? "Theme preference is saved to your account and applies immediately on this device."
          : "Theme change is applied immediately and then synced to your account."}
      </Alert>
    </Stack>
  );
}
