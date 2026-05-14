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

    const registerResponse = await request(app).post("/api/v1/auth/register").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(registerResponse.status).toBe(201);
    expect(typeof registerResponse.body.accessToken).toBe("string");
    expect(typeof registerResponse.body.refreshToken).toBe("string");

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("authorization", `Bearer ${registerResponse.body.accessToken}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.email).toBe("test@example.com");

    const loginResponse = await request(app).post("/api/v1/auth/login").send({
      email: "test@example.com",
      password: "password123",
    });

    expect(loginResponse.status).toBe(200);
    expect(typeof loginResponse.body.refreshToken).toBe("string");

    const refreshResponse = await request(app).post("/api/v1/auth/refresh-token").send({
      refreshToken: loginResponse.body.refreshToken,
    });

    expect(refreshResponse.status).toBe(200);
    expect(refreshResponse.body.refreshToken).not.toBe(loginResponse.body.refreshToken);

    const logoutResponse = await request(app).post("/api/v1/auth/logout").send({
      refreshToken: refreshResponse.body.refreshToken,
    });

    expect(logoutResponse.status).toBe(204);

    const revokedRefreshResponse = await request(app).post("/api/v1/auth/refresh-token").send({
      refreshToken: refreshResponse.body.refreshToken,
    });

    expect(revokedRefreshResponse.status).toBe(403);
  });
});
