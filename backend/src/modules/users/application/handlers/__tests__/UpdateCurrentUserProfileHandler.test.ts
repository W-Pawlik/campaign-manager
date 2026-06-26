import { describe, expect, it, vi } from "vitest";
import { ConflictError } from "@core/application/errors/AppError";
import { UpdateCurrentUserProfileCommand } from "@modules/users/application/commands/UpdateCurrentUserProfileCommand";
import { UpdateCurrentUserProfileHandler } from "@modules/users/application/handlers/UpdateCurrentUserProfileHandler";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { User, type UserProps } from "@modules/users/domain/entities/User";
import { Username } from "@modules/users/domain/value-objects/Username";

function createUser(overrides?: Partial<UserProps>): User {
  return User.create({
    id: "user-1",
    email: "user@example.com",
    username: Username.create("user_one"),
    passwordHash: "hash",
    avatarUrl: null,
    bio: null,
    timezone: null,
    locale: null,
    emailVerifiedAt: null,
    lastLoginAt: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    deletedAt: null,
    ...overrides,
  });
}

describe("UpdateCurrentUserProfileHandler", () => {
  it("updates user profile fields and creates profile when missing", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
      softDelete: vi.fn(),
    };
    const userProfileRepository: UserProfileRepository = {
      findByUserId: vi.fn().mockResolvedValue(null),
      save: vi.fn().mockResolvedValue(undefined),
    };
    const handler = new UpdateCurrentUserProfileHandler(userRepository, userProfileRepository);

    const result = await handler.execute(
      new UpdateCurrentUserProfileCommand({
        userId: "user-1",
        username: "updated_user",
        bio: "Updated bio",
        profile: {
          preferredSystem: "DND5E",
        },
      }),
    );

    expect(result.username).toBe("updated_user");
    expect(result.profile?.preferredSystem).toBe("DND5E");
    expect(userRepository.save).toHaveBeenCalledTimes(1);
    expect(userProfileRepository.save).toHaveBeenCalledTimes(1);
  });

  it("throws conflict when username is already taken by another user", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn().mockResolvedValue(
        createUser({
          id: "user-2",
          username: Username.create("taken_name"),
        }),
      ),
      save: vi.fn(),
      softDelete: vi.fn(),
    };
    const userProfileRepository: UserProfileRepository = {
      findByUserId: vi.fn(),
      save: vi.fn(),
    };
    const handler = new UpdateCurrentUserProfileHandler(userRepository, userProfileRepository);

    await expect(
      handler.execute(
        new UpdateCurrentUserProfileCommand({
          userId: "user-1",
          username: "taken_name",
        }),
      ),
    ).rejects.toBeInstanceOf(ConflictError);
  });
});
