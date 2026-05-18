import type { Command } from "@core/application/cqrs/Command";
import type { CurrentUserProfileDTO } from "@modules/users/application/dto/CurrentUserProfileDTO";

export interface UpdateCurrentUserProfileInput {
  userId: string;
  displayName?: string;
  username?: string;
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
}

export class UpdateCurrentUserProfileCommand implements Command<CurrentUserProfileDTO> {
  public constructor(public readonly input: UpdateCurrentUserProfileInput) {}
}
