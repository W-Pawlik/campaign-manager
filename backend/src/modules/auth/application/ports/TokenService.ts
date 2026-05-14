export interface AccessTokenPayload {
  userId: string;
  email: string;
}

export interface RefreshTokenPayload {
  sessionId: string;
  userId: string;
}

export interface IssuedRefreshToken {
  token: string;
  expiresAt: Date;
}

export interface TokenService {
  issueAccessToken(payload: AccessTokenPayload): string;
  verifyAccessToken(token: string): AccessTokenPayload;
  issueRefreshToken(payload: RefreshTokenPayload): IssuedRefreshToken;
  verifyRefreshToken(token: string): RefreshTokenPayload;
}
