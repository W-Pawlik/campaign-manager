import type { PaletteMode } from "@mui/material";

export type UserProfileSettings = {
  preferredSystem?: string | null;
  defaultTimezone?: string | null;
  socialLinks?: unknown;
  settings?: unknown;
};

export type CurrentUserProfile = {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatarUrl?: string | null;
  bio?: string | null;
  timezone?: string | null;
  locale?: string | null;
  emailVerifiedAt?: string | null;
  lastLoginAt?: string | null;
  profile: UserProfileSettings | null;
};

export type UpdateCurrentUserProfilePayload = {
  username?: string;
  displayName?: string;
  avatarUrl?: string | null;
  bio?: string | null;
  timezone?: string | null;
  locale?: string | null;
  profile?: {
    preferredSystem?: string | null;
    defaultTimezone?: string | null;
    socialLinks?: unknown;
    settings?: unknown;
  };
};

export type ChangeCurrentUserPasswordPayload = {
  currentPassword: string;
  newPassword: string;
};

export type ThemePreferenceOption = {
  mode: PaletteMode;
  label: string;
  description: string;
};
