import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { coreConfig } from "@core/config/core.config";
import type { JwtSigningKeyConfig, RotatingJwtSigningKeysConfig } from "@core/config/core.config";
import { ForbiddenError } from "@core/application/errors/AppError";
import type {
  AccessTokenPayload,
  IssuedRefreshToken,
  RefreshTokenPayload,
  TokenService,
} from "@modules/auth/application/ports/TokenService";

type JwtPayload = {
  sub: string;
  email?: string;
  sid?: string;
  type: "access" | "refresh";
};

export class JwtTokenService implements TokenService {
  public issueAccessToken(payload: AccessTokenPayload): string {
    const activeKey = coreConfig.auth.accessTokenKeys.active;

    return jwt.sign(
      {
        sub: payload.userId,
        email: payload.email,
        type: "access",
      } satisfies JwtPayload,
      activeKey.secret,
      {
        keyid: activeKey.kid,
        expiresIn: coreConfig.auth.accessTokenTtlSeconds,
      },
    );
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    const payload = this.verifyJwt(token, coreConfig.auth.accessTokenKeys);

    if (payload.type !== "access" || payload.email === undefined) {
      throw new ForbiddenError("Access token is invalid");
    }

    return {
      userId: payload.sub,
      email: payload.email,
    };
  }

  public issueRefreshToken(payload: RefreshTokenPayload): IssuedRefreshToken {
    const activeKey = coreConfig.auth.refreshTokenKeys.active;

    const token = jwt.sign(
      {
        sub: payload.userId,
        sid: payload.sessionId,
        type: "refresh",
      } satisfies JwtPayload,
      activeKey.secret,
      {
        keyid: activeKey.kid,
        expiresIn: coreConfig.auth.refreshTokenTtlSeconds,
      },
    );
    const expiresAt = new Date(Date.now() + coreConfig.auth.refreshTokenTtlSeconds * 1000);

    return {
      token,
      expiresAt,
    };
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    const payload = this.verifyJwt(token, coreConfig.auth.refreshTokenKeys);

    if (payload.type !== "refresh" || payload.sid === undefined) {
      throw new ForbiddenError("Refresh token is invalid");
    }

    return {
      sessionId: payload.sid,
      userId: payload.sub,
    };
  }

  private verifyJwt(token: string, keys: RotatingJwtSigningKeysConfig): JwtPayload {
    const keyCandidates = this.resolveVerificationKeys(token, keys);

    for (const key of keyCandidates) {
      try {
        const payload = jwt.verify(token, key.secret, { algorithms: ["HS256"] });

        if (typeof payload !== "object" || payload === null) {
          throw new ForbiddenError("Token is invalid");
        }

        const sub = payload.sub;
        const type = payload.type;
        const email = payload.email;
        const sid = payload.sid;

        if (typeof sub !== "string") {
          throw new ForbiddenError("Token is invalid");
        }

        if (type !== "access" && type !== "refresh") {
          throw new ForbiddenError("Token is invalid");
        }

        if (email !== undefined && typeof email !== "string") {
          throw new ForbiddenError("Token is invalid");
        }

        if (sid !== undefined && typeof sid !== "string") {
          throw new ForbiddenError("Token is invalid");
        }

        return {
          sub,
          type,
          ...(email === undefined ? {} : { email }),
          ...(sid === undefined ? {} : { sid }),
        };
      } catch (error) {
        if (error instanceof TokenExpiredError) {
          throw new ForbiddenError("Token is expired", error);
        }

        if (error instanceof JsonWebTokenError) {
          continue;
        }

        throw error;
      }
    }

    throw new ForbiddenError("Token is invalid");
  }

  private resolveVerificationKeys(
    token: string,
    keys: RotatingJwtSigningKeysConfig,
  ): JwtSigningKeyConfig[] {
    const decodedToken = jwt.decode(token, { complete: true });

    if (!decodedToken || typeof decodedToken !== "object") {
      throw new ForbiddenError("Token is invalid");
    }

    const kid = decodedToken.header?.kid;

    if (typeof kid !== "string" || kid.length === 0) {
      return keys.previous === undefined ? [keys.active] : [keys.active, keys.previous];
    }

    const key = this.findKeyByKid(keys, kid);

    if (!key) {
      throw new ForbiddenError("Token is invalid");
    }

    return [key];
  }

  private findKeyByKid(
    keys: RotatingJwtSigningKeysConfig,
    kid: string,
  ): JwtSigningKeyConfig | undefined {
    if (keys.active.kid === kid) {
      return keys.active;
    }

    if (keys.previous?.kid === kid) {
      return keys.previous;
    }

    return undefined;
  }
}
