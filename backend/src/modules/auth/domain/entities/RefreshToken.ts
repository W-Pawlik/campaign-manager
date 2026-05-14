export interface RefreshTokenProps {
  id: string;
  userId: string;
  tokenHash: string;
  expiresAt: Date;
  createdAt: Date;
  revokedAt: Date | null;
}

export class RefreshToken {
  public readonly id: string;
  public readonly userId: string;
  public readonly tokenHash: string;
  public readonly expiresAt: Date;
  public readonly createdAt: Date;
  public readonly revokedAt: Date | null;

  private constructor(props: RefreshTokenProps) {
    this.id = props.id;
    this.userId = props.userId;
    this.tokenHash = props.tokenHash;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
    this.revokedAt = props.revokedAt;
  }

  public static create(props: RefreshTokenProps): RefreshToken {
    return new RefreshToken(props);
  }

  public canBeUsed(now: Date): boolean {
    if (this.revokedAt !== null) {
      return false;
    }

    return this.expiresAt.getTime() > now.getTime();
  }
}
