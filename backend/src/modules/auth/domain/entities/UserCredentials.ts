import type { Email } from "@modules/auth/domain/value-objects/Email";
import type { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

export interface UserCredentialsProps {
  id: string;
  email: Email;
  passwordHash: PasswordHash;
  username?: string;
  avatarUrl?: string | null;
  createdAt: Date;
}

export class UserCredentials {
  public readonly id: string;
  public readonly email: Email;
  public readonly passwordHash: PasswordHash;
  public readonly username: string | undefined;
  public readonly avatarUrl: string | null | undefined;
  public readonly createdAt: Date;

  private constructor(props: UserCredentialsProps) {
    this.id = props.id;
    this.email = props.email;
    this.passwordHash = props.passwordHash;
    this.username = props.username;
    this.avatarUrl = props.avatarUrl;
    this.createdAt = props.createdAt;
  }

  public static create(props: UserCredentialsProps): UserCredentials {
    return new UserCredentials(props);
  }
}
