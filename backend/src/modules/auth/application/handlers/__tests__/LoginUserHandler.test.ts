import { describe, expect, it, vi } from "vitest";
import { UnauthorizedError } from "@core/application/errors/AppError";
import { LoginUserCommand } from "@modules/auth/application/commands/LoginUserCommand";
import { LoginUserHandler } from "@modules/auth/application/handlers/LoginUserHandler";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { Email } from "@modules/auth/domain/value-objects/Email";
import { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

describe("LoginUserHandler", () => {
  it("logs user in and issues tokens", async () => {
    const user = UserCredentials.create({
      id: "user-1",
      email: Email.create("test@example.com"),
      passwordHash: PasswordHash.create("hashed-password"),
      createdAt: new Date(),
    });
    const authRepository: AuthRepository = {
      findByEmail: vi.fn().mockResolvedValue(user),
      findById: vi.fn(),
      create: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn().mockResolvedValue(true),
    };
    const authTokensIssuer: AuthTokensIssuer = {
      issueForUser: vi.fn().mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
      }),
    } as unknown as AuthTokensIssuer;
    const handler = new LoginUserHandler(authRepository, passwordHasher, authTokensIssuer);

    const result = await handler.execute(new LoginUserCommand("test@example.com", "password123"));

    expect(result).toEqual({ accessToken: "access", refreshToken: "refresh" });
    expect(passwordHasher.verify).toHaveBeenCalledWith("password123", "hashed-password");
  });

  it("throws when password is invalid", async () => {
    const user = UserCredentials.create({
      id: "user-1",
      email: Email.create("test@example.com"),
      passwordHash: PasswordHash.create("hashed-password"),
      createdAt: new Date(),
    });
    const authRepository: AuthRepository = {
      findByEmail: vi.fn().mockResolvedValue(user),
      findById: vi.fn(),
      create: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn().mockResolvedValue(false),
    };
    const authTokensIssuer: AuthTokensIssuer = {
      issueForUser: vi.fn(),
    } as unknown as AuthTokensIssuer;
    const handler = new LoginUserHandler(authRepository, passwordHasher, authTokensIssuer);

    await expect(
      handler.execute(new LoginUserCommand("test@example.com", "password123")),
    ).rejects.toBeInstanceOf(UnauthorizedError);
  });
});
