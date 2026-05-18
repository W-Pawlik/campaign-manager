import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import type { DisplayName } from "@modules/users/domain/value-objects/DisplayName";
import type { Username } from "@modules/users/domain/value-objects/Username";

export interface UserProps {
  id: string;
  email: string;
  username: Username;
  displayName: DisplayName;
  passwordHash: string;
  avatarUrl: string | null;
  bio: string | null;
  timezone: string | null;
  locale: string | null;
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface UpdateUserDetailsParams {
  username?: Username;
  displayName?: DisplayName;
  avatarUrl?: string | null;
  bio?: string | null;
  timezone?: string | null;
  locale?: string | null;
}

export class User {
  public readonly id: string;
  public readonly email: string;
  public readonly username: Username;
  public readonly displayName: DisplayName;
  public readonly passwordHash: string;
  public readonly avatarUrl: string | null;
  public readonly bio: string | null;
  public readonly timezone: string | null;
  public readonly locale: string | null;
  public readonly emailVerifiedAt: Date | null;
  public readonly lastLoginAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;
  public readonly deletedAt: Date | null;

  private constructor(props: UserProps) {
    this.id = props.id;
    this.email = props.email;
    this.username = props.username;
    this.displayName = props.displayName;
    this.passwordHash = props.passwordHash;
    this.avatarUrl = props.avatarUrl;
    this.bio = props.bio;
    this.timezone = props.timezone;
    this.locale = props.locale;
    this.emailVerifiedAt = props.emailVerifiedAt;
    this.lastLoginAt = props.lastLoginAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  public static create(props: UserProps): User {
    return new User(props);
  }

  public ensureIsActive(): void {
    if (this.deletedAt !== null) {
      throw new ForbiddenError("Deleted user cannot perform this operation");
    }
  }

  public withUpdatedDetails(params: UpdateUserDetailsParams): User {
    this.ensureIsActive();

    if (params.bio !== undefined && params.bio !== null && params.bio.length > 1000) {
      throw new ValidationError("Bio must have at most 1000 characters");
    }

    return new User({
      ...this.toProps(),
      username: params.username ?? this.username,
      displayName: params.displayName ?? this.displayName,
      avatarUrl: params.avatarUrl === undefined ? this.avatarUrl : params.avatarUrl,
      bio: params.bio === undefined ? this.bio : params.bio,
      timezone: params.timezone === undefined ? this.timezone : params.timezone,
      locale: params.locale === undefined ? this.locale : params.locale,
      updatedAt: new Date(),
    });
  }

  public withPasswordHash(passwordHash: string): User {
    this.ensureIsActive();

    if (passwordHash.trim().length === 0) {
      throw new ValidationError("Password hash is required");
    }

    return new User({
      ...this.toProps(),
      passwordHash,
      updatedAt: new Date(),
    });
  }

  public withSoftDelete(deletedAt: Date): User {
    if (this.deletedAt !== null) {
      return this;
    }

    return new User({
      ...this.toProps(),
      deletedAt,
      updatedAt: deletedAt,
    });
  }

  private toProps(): UserProps {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      displayName: this.displayName,
      passwordHash: this.passwordHash,
      avatarUrl: this.avatarUrl,
      bio: this.bio,
      timezone: this.timezone,
      locale: this.locale,
      emailVerifiedAt: this.emailVerifiedAt,
      lastLoginAt: this.lastLoginAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      deletedAt: this.deletedAt,
    };
  }
}
