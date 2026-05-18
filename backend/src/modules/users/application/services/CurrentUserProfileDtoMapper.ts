import type { CurrentUserProfileDTO } from "@modules/users/application/dto/CurrentUserProfileDTO";
import type { UserProfileDTO } from "@modules/users/application/dto/UserProfileDTO";
import type { User } from "@modules/users/domain/entities/User";
import type { UserProfile } from "@modules/users/domain/entities/UserProfile";

export function mapCurrentUserProfileDTO(
  user: User,
  profile: UserProfile | null,
): CurrentUserProfileDTO {
  const profileDto: UserProfileDTO | null =
    profile === null
      ? null
      : {
          preferredSystem: profile.preferredSystem,
          defaultTimezone: profile.defaultTimezone,
          socialLinks: profile.socialLinks,
          settings: profile.settings,
        };

  return {
    id: user.id,
    email: user.email,
    username: user.username.value,
    displayName: user.displayName.value,
    avatarUrl: user.avatarUrl,
    bio: user.bio,
    timezone: user.timezone,
    locale: user.locale,
    emailVerifiedAt: user.emailVerifiedAt?.toISOString() ?? null,
    lastLoginAt: user.lastLoginAt?.toISOString() ?? null,
    profile: profileDto,
  };
}
