import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@core/application/errors/AppError";
import { RegisterUserCommand } from "@modules/auth/application/commands/RegisterUserCommand";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import { RegisterUserHandler } from "@modules/auth/application/handlers/RegisterUserHandler";
import type { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";
import { UserCredentials } from "@modules/auth/domain/entities/UserCredentials";
import { Email } from "@modules/auth/domain/value-objects/Email";
import { PasswordHash } from "@modules/auth/domain/value-objects/PasswordHash";

describe("RegisterUserHandler", () => {
  it("registers user and issues tokens", async () => {
    const createdUsers: UserCredentials[] = [];
    const authRepository: AuthRepository = {
      findByEmail: vi.fn().mockResolvedValue(null),
      findById: vi.fn(),
      create: vi.fn(async (user: UserCredentials) => {
        createdUsers.push(user);
      }),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn().mockResolvedValue("hashed-password"),
      verify: vi.fn(),
    };
    const authTokensIssuer: AuthTokensIssuer = {
      issueForUser: vi.fn().mockResolvedValue({
        accessToken: "access",
        refreshToken: "refresh",
      }),
    } as unknown as AuthTokensIssuer;
    const handler = new RegisterUserHandler(authRepository, passwordHasher, authTokensIssuer);

    const result = await handler.execute(new RegisterUserCommand("test@example.com", "password123"));

    expect(result).toEqual({ accessToken: "access", refreshToken: "refresh" });
    expect(passwordHasher.hash).toHaveBeenCalledWith("password123");
    expect(authRepository.create).toHaveBeenCalledTimes(1);
    expect(createdUsers).toHaveLength(1);
    const createdUser = createdUsers[0];

    expect(createdUser).toBeDefined();
    expect(createdUser?.email.value).toBe("test@example.com");
    expect(createdUser?.passwordHash.value).toBe("hashed-password");
  });

  it("throws conflict when user exists", async () => {
    const existingUser = UserCredentials.create({
      id: "user-1",
      email: Email.create("test@example.com"),
      passwordHash: PasswordHash.create("hash"),
      createdAt: new Date(),
    });
    const authRepository: AuthRepository = {
      findByEmail: vi.fn().mockResolvedValue(existingUser),
      findById: vi.fn(),
      create: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn(),
    };
    const authTokensIssuer: AuthTokensIssuer = {
      issueForUser: vi.fn(),
    } as unknown as AuthTokensIssuer;
    const handler = new RegisterUserHandler(authRepository, passwordHasher, authTokensIssuer);

    await expect(
      handler.execute(new RegisterUserCommand("test@example.com", "password123")),
    ).rejects.toBeInstanceOf(ConflictError);
    expect(authRepository.create).not.toHaveBeenCalled();
  });
});
