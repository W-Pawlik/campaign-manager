export interface UserProfileProps {
  id: string;
  userId: string;
  preferredSystem: string | null;
  defaultTimezone: string | null;
  socialLinks: unknown;
  settings: unknown;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateUserProfileParams {
  preferredSystem?: string | null;
  defaultTimezone?: string | null;
  socialLinks?: unknown;
  settings?: unknown;
}

export class UserProfile {
  public readonly id: string;
  public readonly userId: string;
  public readonly preferredSystem: string | null;
  public readonly defaultTimezone: string | null;
  public readonly socialLinks: unknown;
  public readonly settings: unknown;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: UserProfileProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.preferredSystem = props.preferredSystem;
    this.defaultTimezone = props.defaultTimezone;
    this.socialLinks = props.socialLinks;
    this.settings = props.settings;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: UserProfileProps): UserProfile {
    return new UserProfile(props);
  }

  public withUpdates(params: UpdateUserProfileParams): UserProfile {
    return new UserProfile({
      id: this.id,
      userId: this.userId,
      preferredSystem:
        params.preferredSystem === undefined ? this.preferredSystem : params.preferredSystem,
      defaultTimezone:
        params.defaultTimezone === undefined ? this.defaultTimezone : params.defaultTimezone,
      socialLinks: params.socialLinks === undefined ? this.socialLinks : params.socialLinks,
      settings: params.settings === undefined ? this.settings : params.settings,
      createdAt: this.createdAt,
      updatedAt: new Date(),
    });
  }
}
