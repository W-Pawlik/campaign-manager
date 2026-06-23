import { Alert, Chip, Stack, Typography } from "@mui/material";

import { useAppSelector } from "@/app/store/hooks";
import { ThemeModeToggle } from "@/shared/components";

export function SettingsThemeCard() {
  const themeMode = useAppSelector((state) => state.ui.themeMode);

  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h6">Theme mode</Typography>
        <Chip
          color={themeMode === "dark" ? "primary" : "default"}
          label={themeMode === "dark" ? "Dark mode active" : "Light mode active"}
          size="small"
          variant={themeMode === "dark" ? "filled" : "outlined"}
        />
      </Stack>
      <Typography color="text.secondary">
        Adjust the workspace look for planning sessions, reviewing notes, and running your campaign.
      </Typography>
      <ThemeModeToggle sx={{ alignSelf: "flex-start" }} />
      <Alert severity="info" variant="outlined">
        Theme changes apply immediately on this device.
      </Alert>
    </Stack>
  );
}
