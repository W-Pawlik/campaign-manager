import { Grid, Stack } from "@mui/material";
import { useMemo, useState } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { setThemeMode } from "@/app/store/slices/uiSlice";
import {
  useChangeCurrentUserPasswordMutation,
  useCurrentUserProfileQuery,
  useUpdateCurrentUserProfileMutation,
} from "@/features/settings/api/settingsQueries";
import { SettingsPasswordForm } from "@/features/settings/ui/SettingsPasswordForm";
import { SettingsProfileForm } from "@/features/settings/ui/SettingsProfileForm";
import { SettingsSummaryCard } from "@/features/settings/ui/SettingsSummaryCard";
import { SettingsThemeCard } from "@/features/settings/ui/SettingsThemeCard";
import {
  ErrorState,
  LoadingScreen,
  PageHeader,
  SectionCard,
} from "@/shared/components";

type ProfileFormValues = {
  username: string;
  avatarUrl?: string;
  bio?: string;
  timezone?: string;
  locale?: string;
  preferredSystem?: string;
  defaultTimezone?: string;
};

type PasswordFormValues = {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
};

function normalizeOptionalText(value?: string): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function SettingsPage() {
  const dispatch = useAppDispatch();
  const currentThemeMode = useAppSelector((state) => state.ui.themeMode);
  const currentUserProfileQuery = useCurrentUserProfileQuery();
  const updateCurrentUserProfileMutation = useUpdateCurrentUserProfileMutation();
  const changeCurrentUserPasswordMutation = useChangeCurrentUserPasswordMutation();
  const [profileFeedback, setProfileFeedback] = useState<string | null>(null);
  const [passwordFeedback, setPasswordFeedback] = useState<string | null>(null);

  const profileError = useMemo(() => {
    if (!updateCurrentUserProfileMutation.isError) {
      return null;
    }

    return updateCurrentUserProfileMutation.error.message;
  }, [updateCurrentUserProfileMutation.error, updateCurrentUserProfileMutation.isError]);

  const passwordError = useMemo(() => {
    if (!changeCurrentUserPasswordMutation.isError) {
      return null;
    }

    return changeCurrentUserPasswordMutation.error.message;
  }, [changeCurrentUserPasswordMutation.error, changeCurrentUserPasswordMutation.isError]);

  if (currentUserProfileQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (currentUserProfileQuery.isError || !currentUserProfileQuery.data) {
    return (
      <ErrorState
        message="Settings could not be loaded right now. Try again in a moment."
        onRetry={() => void currentUserProfileQuery.refetch()}
        title="Unable to load settings"
      />
    );
  }

  const profile = currentUserProfileQuery.data;
  const savedThemeMode = profile.profile?.settings?.themeMode ?? null;

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    setProfileFeedback(null);

    await updateCurrentUserProfileMutation.mutateAsync({
      avatarUrl: normalizeOptionalText(values.avatarUrl),
      bio: normalizeOptionalText(values.bio),
      locale: normalizeOptionalText(values.locale),
      profile: {
        defaultTimezone: normalizeOptionalText(values.defaultTimezone),
        preferredSystem: normalizeOptionalText(values.preferredSystem),
      },
      timezone: normalizeOptionalText(values.timezone),
      username: values.username.trim(),
    });

    setProfileFeedback("Profile settings saved.");
  };

  const handleThemeModeChange = async (mode: "light" | "dark") => {
    dispatch(setThemeMode(mode));
    setProfileFeedback(null);

    await updateCurrentUserProfileMutation.mutateAsync({
      profile: {
        settings: {
          ...(profile.profile?.settings ?? {}),
          themeMode: mode,
        },
      },
    });

    setProfileFeedback("Theme preference saved.");
  };

  const handlePasswordSubmit = async (values: PasswordFormValues) => {
    setPasswordFeedback(null);

    await changeCurrentUserPasswordMutation.mutateAsync({
      currentPassword: values.currentPassword,
      newPassword: values.newPassword,
    });

    setPasswordFeedback("Password updated successfully.");
  };

  return (
    <Stack spacing={3.5}>
      <PageHeader
        description="Manage your account identity, visual preferences, and security from one place."
        title="Settings"
      />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, xl: 4 }}>
          <SectionCard>
            <SettingsSummaryCard profile={profile} />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, xl: 8 }}>
          <SectionCard>
            <SettingsProfileForm
              isSubmitting={updateCurrentUserProfileMutation.isPending}
              onSubmit={handleProfileSubmit}
              profile={profile}
              submitError={profileError}
              submitSuccess={profileFeedback}
            />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard>
            <SettingsThemeCard
              currentThemeMode={currentThemeMode}
              isSubmitting={updateCurrentUserProfileMutation.isPending}
              onSelectThemeMode={handleThemeModeChange}
              savedThemeMode={savedThemeMode}
            />
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard>
            <SettingsPasswordForm
              isSubmitting={changeCurrentUserPasswordMutation.isPending}
              onSubmit={handlePasswordSubmit}
              submitError={passwordError}
              submitSuccess={passwordFeedback}
            />
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
