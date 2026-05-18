import { describe, expect, it, vi } from "vitest";
import { ForbiddenError, ValidationError } from "@core/application/errors/AppError";
import { ChangeCurrentUserPasswordCommand } from "@modules/users/application/commands/ChangeCurrentUserPasswordCommand";
import { ChangeCurrentUserPasswordHandler } from "@modules/users/application/handlers/ChangeCurrentUserPasswordHandler";
import type { PasswordHasher } from "@modules/users/application/ports/PasswordHasher";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { User } from "@modules/users/domain/entities/User";
import { DisplayName } from "@modules/users/domain/value-objects/DisplayName";
import { Username } from "@modules/users/domain/value-objects/Username";

function createUser(): User {
  return User.create({
    id: "user-1",
    email: "user@example.com",
    username: Username.create("user_one"),
    displayName: DisplayName.create("User One"),
    passwordHash: "old-hash",
    avatarUrl: null,
    bio: null,
    timezone: null,
    locale: null,
    emailVerifiedAt: null,
    lastLoginAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
}

describe("ChangeCurrentUserPasswordHandler", () => {
  it("changes password when current password is valid", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn(),
      save: vi.fn().mockResolvedValue(undefined),
      softDelete: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn().mockResolvedValue("new-hash"),
      verify: vi.fn().mockResolvedValue(true),
    };
    const handler = new ChangeCurrentUserPasswordHandler(userRepository, passwordHasher);

    await handler.execute(
      new ChangeCurrentUserPasswordCommand({
        userId: "user-1",
        currentPassword: "old-password",
        newPassword: "new-password-123",
      }),
    );

    expect(passwordHasher.verify).toHaveBeenCalledWith("old-password", "old-hash");
    expect(userRepository.save).toHaveBeenCalledTimes(1);
  });

  it("throws when current password is invalid", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn().mockResolvedValue(false),
    };
    const handler = new ChangeCurrentUserPasswordHandler(userRepository, passwordHasher);

    await expect(
      handler.execute(
        new ChangeCurrentUserPasswordCommand({
          userId: "user-1",
          currentPassword: "wrong",
          newPassword: "new-password-123",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
  });

  it("throws when new password policy is violated", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn(),
    };
    const passwordHasher: PasswordHasher = {
      hash: vi.fn(),
      verify: vi.fn().mockResolvedValue(true),
    };
    const handler = new ChangeCurrentUserPasswordHandler(userRepository, passwordHasher);

    await expect(
      handler.execute(
        new ChangeCurrentUserPasswordCommand({
          userId: "user-1",
          currentPassword: "old-password",
          newPassword: "short",
        }),
      ),
    ).rejects.toBeInstanceOf(ValidationError);
  });
});
