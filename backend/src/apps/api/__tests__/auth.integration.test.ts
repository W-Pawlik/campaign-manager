import type { Container } from "inversify";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApiApp } from "@api/app";
import { loadApiContainerModule } from "@api/di/api.container-module";
import { buildContainer, type ContainerModuleLoader } from "@core/di/container";
import { loadAuthContainerModule } from "@modules/auth/auth.container-module";
import { AUTH_TYPES } from "@modules/auth/auth.types";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";
import type { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import type { Email } from "@modules/auth/domain/value-objects/Email";

class InMemoryAuthRepository implements AuthRepository {
  private readonly usersById = new Map<string, UserCredentials>();
  private readonly userIdsByEmail = new Map<string, string>();

  public async findByEmail(email: Email): Promise<UserCredentials | null> {
    const userId = this.userIdsByEmail.get(email.value);

    if (!userId) {
      return null;
    }

    return this.usersById.get(userId) ?? null;
  }

  public async findById(userId: string): Promise<UserCredentials | null> {
    return this.usersById.get(userId) ?? null;
  }

  public async create(userCredentials: UserCredentials): Promise<void> {
    this.usersById.set(userCredentials.id, userCredentials);
    this.userIdsByEmail.set(userCredentials.email.value, userCredentials.id);
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

function createAuthTestingModule(): ContainerModuleLoader {
  const authRepository = new InMemoryAuthRepository();
  const userSessionRepository = new InMemoryUserSessionRepository();

  return (container: Container) => {
    container.rebind<AuthRepository>(AUTH_TYPES.AuthRepository).toConstantValue(authRepository);
    container
      .rebind<UserSessionRepository>(AUTH_TYPES.UserSessionRepository)
      .toConstantValue(userSessionRepository);
  };
}

function extractRefreshTokenFromSetCookie(
  setCookieHeaders: string | string[] | undefined,
): string {
  const headersArray =
    setCookieHeaders === undefined
      ? []
      : Array.isArray(setCookieHeaders)
        ? setCookieHeaders
        : [setCookieHeaders];

  if (headersArray.length === 0) {
    throw new Error("Expected Set-Cookie header with refresh token");
  }

  const refreshTokenCookie = headersArray.find((header) => header.startsWith("refreshToken="));

  if (!refreshTokenCookie) {
    throw new Error("Expected refreshToken cookie");
  }

  const cookieValue = refreshTokenCookie.split(";")[0] ?? "";
  const token = cookieValue.slice("refreshToken=".length);

  if (token.length === 0) {
    throw new Error("Expected non-empty refresh token cookie value");
  }

  return token;
}

describe("Auth API flow", () => {
  it("registers, logs in, refreshes token, logs out and blocks revoked refresh token", async () => {
    const container = buildContainer(
      loadAuthContainerModule,
      createAuthTestingModule(),
      loadApiContainerModule,
    );
    const app = createApiApp({
      container,
    });
    const agent = request.agent(app);

    const registerResponse = await agent.post("/api/v1/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(registerResponse.status).toBe(201);
    expect(typeof registerResponse.body.accessToken).toBe("string");
    expect(registerResponse.body.refreshToken).toBeUndefined();
    expect(extractRefreshTokenFromSetCookie(registerResponse.headers["set-cookie"])).toBeTruthy();

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${registerResponse.body.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe("test@example.com");
    expect(meResponse.body.username).toBeTruthy();
    expect(meResponse.body.displayName).toBeTruthy();
    expect(meResponse.body.avatarUrl).toBeNull();

    const loginResponse = await agent.post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(typeof loginResponse.body.accessToken).toBe("string");
    const revokedRefreshTokenCandidate = extractRefreshTokenFromSetCookie(
      loginResponse.headers["set-cookie"],
    );

    const refreshResponse = await agent.post("/api/v1/auth/refresh-token");

    expect(refreshResponse.status).toBe(200);
    expect(typeof refreshResponse.body.accessToken).toBe("string");
    const activeRefreshToken = extractRefreshTokenFromSetCookie(refreshResponse.headers["set-cookie"]);
    expect(activeRefreshToken).not.toBe(revokedRefreshTokenCandidate);

    const revokedRefreshResponse = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", `refreshToken=${revokedRefreshTokenCandidate}`);

    expect(revokedRefreshResponse.status).toBe(401);

    const logoutResponse = await agent.post("/api/v1/auth/logout");

    expect(logoutResponse.status).toBe(204);
    const setCookieHeader = logoutResponse.headers["set-cookie"];
    const setCookieValues =
      setCookieHeader === undefined
        ? []
        : Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
    const clearCookieHeader = setCookieValues.find((header) => header.startsWith("refreshToken="));
    expect(clearCookieHeader).toContain("Expires=");

    const refreshAfterLogoutResponse = await request(app)
      .post("/api/v1/auth/refresh-token")
      .set("Cookie", `refreshToken=${activeRefreshToken}`);

    expect(refreshAfterLogoutResponse.status).toBe(401);
  });
});
