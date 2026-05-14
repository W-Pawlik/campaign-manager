import { describe, expect, it } from "vitest";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type {
  AccessTokenPayload,
  IssuedRefreshToken,
  RefreshTokenPayload,
  TokenService,
} from "@modules/auth/application/ports/TokenService";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import { RefreshTokenHandler } from "@modules/auth/application/handlers/RefreshTokenHandler";
import { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { RefreshTokenCommand } from "@modules/auth/application/commands/RefreshTokenCommand";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";
import { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { Email } from "@modules/auth/domain/value-objects/Email";
import { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

class InMemoryAuthRepository implements AuthRepository {
  private readonly users = new Map<string, UserCredentials>();

  public constructor(initialUsers: UserCredentials[]) {
    for (const user of initialUsers) {
      this.users.set(user.id, user);
    }
  }

  public async findByEmail(email: Email): Promise<UserCredentials | null> {
    for (const user of this.users.values()) {
      if (user.email.value === email.value) {
        return user;
      }
    }

    return null;
  }

  public async findById(userId: string): Promise<UserCredentials | null> {
    return this.users.get(userId) ?? null;
  }

  public async create(userCredentials: UserCredentials): Promise<void> {
    this.users.set(userCredentials.id, userCredentials);
  }
}

class InMemoryUserSessionRepository implements UserSessionRepository {
  private readonly sessions = new Map<string, RefreshToken>();

  public async create(session: RefreshToken): Promise<void> {
    this.sessions.set(session.id, session);
  }

  public async findById(sessionId: string): Promise<RefreshToken | null> {
    return this.sessions.get(sessionId) ?? null;
  }

  public async revokeById(sessionId: string, revokedAt: Date): Promise<void> {
    const session = this.sessions.get(sessionId);

    if (!session) {
      return;
    }

    this.sessions.set(
      sessionId,
      RefreshToken.create({
        id: session.id,
        userId: session.userId,
        tokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        revokedAt,
      }),
    );
  }
}

class FakePasswordHasher implements PasswordHasher {
  public async hash(plainValue: string): Promise<string> {
    return `hash:${plainValue}`;
  }

  public async verify(plainValue: string, hashedValue: string): Promise<boolean> {
    return hashedValue === `hash:${plainValue}`;
  }
}

class FakeTokenService implements TokenService {
  public issueAccessToken(payload: AccessTokenPayload): string {
    return `access:${payload.userId}:${payload.email}`;
  }

  public verifyAccessToken(token: string): AccessTokenPayload {
    const [type, userId, email] = token.split(":");

    if (type !== "access" || !userId || !email) {
      throw new Error("invalid access token");
    }

    return { userId, email };
  }

  public issueRefreshToken(payload: RefreshTokenPayload): IssuedRefreshToken {
    return {
      token: `refresh:${payload.sessionId}:${payload.userId}`,
      expiresAt: new Date(Date.now() + 60_000),
    };
  }

  public verifyRefreshToken(token: string): RefreshTokenPayload {
    const [type, sessionId, userId] = token.split(":");

    if (type !== "refresh" || !sessionId || !userId) {
      throw new Error("invalid refresh token");
    }

    return { sessionId, userId };
  }
}

describe("Refresh token flow", () => {
  it("rotates refresh token and issues a new token pair", async () => {
    const user = UserCredentials.create({
      id: "user-1",
      email: Email.create("test@example.com"),
      passwordHash: PasswordHash.create("hash:password"),
      createdAt: new Date(),
    });
    const authRepository = new InMemoryAuthRepository([user]);
    const userSessionRepository = new InMemoryUserSessionRepository();
    const passwordHasher = new FakePasswordHasher();
    const tokenService = new FakeTokenService();
    const authTokensIssuer = new AuthTokensIssuer(tokenService, passwordHasher, userSessionRepository);

    const initialTokens = await authTokensIssuer.issueForUser(user);
    const initialPayload = tokenService.verifyRefreshToken(initialTokens.refreshToken);
    const refreshTokenHandler = new RefreshTokenHandler(
      authRepository,
      userSessionRepository,
      tokenService,
      passwordHasher,
      authTokensIssuer,
    );

    const nextTokens = await refreshTokenHandler.execute(
      new RefreshTokenCommand(initialTokens.refreshToken),
    );
    const revokedSession = await userSessionRepository.findById(initialPayload.sessionId);

    expect(nextTokens.accessToken.startsWith("access:user-1:")).toBe(true);
    expect(nextTokens.refreshToken).not.toBe(initialTokens.refreshToken);
    expect(revokedSession?.revokedAt).not.toBeNull();
  });
});
