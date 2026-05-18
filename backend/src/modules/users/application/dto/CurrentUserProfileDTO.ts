import type { UserProfileDTO } from "@modules/users/application/dto/UserProfileDTO";

export interface CurrentUserProfileDTO {
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
  profile: UserProfileDTO | null;
}
