import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  Grid,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CurrentUserProfile } from "@/features/settings/model/settings.types";

const settingsProfileSchema = z.object({
  avatarUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  bio: z.string().max(1000, "Bio can contain up to 1000 characters.").optional(),
  defaultTimezone: z.string().trim().max(120).optional(),
  displayName: z.string().trim().min(2, "Display name must contain at least 2 characters.").max(80),
  locale: z.string().trim().max(32).optional(),
  preferredSystem: z.string().trim().max(120).optional(),
  timezone: z.string().trim().max(120).optional(),
  username: z
    .string()
    .trim()
    .min(3, "Username must contain at least 3 characters.")
    .max(32, "Username can contain up to 32 characters.")
    .regex(/^[A-Za-z0-9_-]+$/, "Use only letters, numbers, dashes, and underscores."),
});

type SettingsProfileFormValues = z.infer<typeof settingsProfileSchema>;

type SettingsProfileFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: SettingsProfileFormValues) => Promise<void>;
  profile: CurrentUserProfile;
  submitError: string | null;
  submitSuccess: string | null;
};

function toOptionalValue(value?: string | null): string {
  return value ?? "";
}

export function SettingsProfileForm({
  isSubmitting,
  onSubmit,
  profile,
  submitError,
  submitSuccess,
}: SettingsProfileFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SettingsProfileFormValues>({
    defaultValues: {
      avatarUrl: toOptionalValue(profile.avatarUrl),
      bio: toOptionalValue(profile.bio),
      defaultTimezone: toOptionalValue(profile.profile?.defaultTimezone),
      displayName: profile.displayName,
      locale: toOptionalValue(profile.locale),
      preferredSystem: toOptionalValue(profile.profile?.preferredSystem),
      timezone: toOptionalValue(profile.timezone),
      username: profile.username,
    },
    resolver: zodResolver(settingsProfileSchema),
  });

  useEffect(() => {
    reset({
      avatarUrl: toOptionalValue(profile.avatarUrl),
      bio: toOptionalValue(profile.bio),
      defaultTimezone: toOptionalValue(profile.profile?.defaultTimezone),
      displayName: profile.displayName,
      locale: toOptionalValue(profile.locale),
      preferredSystem: toOptionalValue(profile.profile?.preferredSystem),
      timezone: toOptionalValue(profile.timezone),
      username: profile.username,
    });
  }, [profile, reset]);

  return (
    <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing={2.5}>
      <Stack spacing={0.75}>
        <Typography variant="h6">Profile</Typography>
        <Typography color="text.secondary">
          Keep your account identity and default preferences aligned with how you run campaigns.
        </Typography>
      </Stack>

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}
      {submitSuccess ? <Alert severity="success">{submitSuccess}</Alert> : null}

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.username)}
            fullWidth
            helperText={errors.username?.message}
            label="Username"
            {...register("username")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.displayName)}
            fullWidth
            helperText={errors.displayName?.message}
            label="Display name"
            {...register("displayName")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Email"
            slotProps={{ input: { readOnly: true } }}
            value={profile.email}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.avatarUrl)}
            fullWidth
            helperText={errors.avatarUrl?.message ?? "Optional public avatar URL."}
            label="Avatar URL"
            {...register("avatarUrl")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.timezone)}
            fullWidth
            helperText={errors.timezone?.message}
            label="Timezone"
            placeholder="Europe/Warsaw"
            {...register("timezone")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.locale)}
            fullWidth
            helperText={errors.locale?.message}
            label="Locale"
            placeholder="en-US"
            {...register("locale")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.preferredSystem)}
            fullWidth
            helperText={errors.preferredSystem?.message}
            label="Preferred system"
            placeholder="D&D 5e"
            {...register("preferredSystem")}
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            error={Boolean(errors.defaultTimezone)}
            fullWidth
            helperText={errors.defaultTimezone?.message}
            label="Default campaign timezone"
            placeholder="Europe/Warsaw"
            {...register("defaultTimezone")}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            error={Boolean(errors.bio)}
            fullWidth
            helperText={errors.bio?.message ?? "Optional short bio for your account."}
            label="Bio"
            minRows={4}
            multiline
            {...register("bio")}
          />
        </Grid>
      </Grid>

      <Button
        disabled={isSubmitting}
        size="large"
        sx={{ alignSelf: "flex-start" }}
        type="submit"
        variant="contained"
      >
        {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Save profile"}
      </Button>
    </Stack>
  );
}
