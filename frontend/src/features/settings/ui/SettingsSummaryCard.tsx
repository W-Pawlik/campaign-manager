import { Chip, Stack, Typography } from "@mui/material";

import type { CurrentUserProfile } from "@/features/settings/model/settings.types";

type SettingsSummaryCardProps = {
  profile: CurrentUserProfile;
};

function formatDate(value?: string | null): string {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function SettingsSummaryCard({ profile }: SettingsSummaryCardProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="h6">Account summary</Typography>
        <Chip
          color={profile.emailVerifiedAt ? "success" : "warning"}
          label={profile.emailVerifiedAt ? "Email verified" : "Email not verified"}
          size="small"
          variant="outlined"
        />
      </Stack>

      <Stack spacing={1}>
        <Typography color="text.secondary" variant="body2">
          Last sign-in
        </Typography>
        <Typography>{formatDate(profile.lastLoginAt)}</Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography color="text.secondary" variant="body2">
          Preferred system
        </Typography>
        <Typography>{profile.profile?.preferredSystem ?? "Not configured yet"}</Typography>
      </Stack>

      <Stack spacing={1}>
        <Typography color="text.secondary" variant="body2">
          Default timezone
        </Typography>
        <Typography>{profile.profile?.defaultTimezone ?? profile.timezone ?? "Not configured yet"}</Typography>
      </Stack>
    </Stack>
  );
}
