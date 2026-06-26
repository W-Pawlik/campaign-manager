import { describe, expect, it, vi } from "vitest";
import { GetCurrentUserProfileHandler } from "@modules/users/application/handlers/GetCurrentUserProfileHandler";
import { GetCurrentUserProfileQuery } from "@modules/users/application/queries/GetCurrentUserProfileQuery";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { User } from "@modules/users/domain/entities/User";
import { UserProfile } from "@modules/users/domain/entities/UserProfile";
import { Username } from "@modules/users/domain/value-objects/Username";

describe("GetCurrentUserProfileHandler", () => {
  it("returns current user with profile", async () => {
    const user = User.create({
      id: "user-1",
      email: "user@example.com",
      username: Username.create("user_one"),
      passwordHash: "hash",
      avatarUrl: null,
      bio: "bio",
      timezone: "Europe/Warsaw",
      locale: "pl-PL",
      emailVerifiedAt: null,
      lastLoginAt: null,
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
      deletedAt: null,
    });
    const profile = UserProfile.create({
      id: "profile-1",
      userId: "user-1",
      preferredSystem: "DND5E",
      defaultTimezone: "Europe/Warsaw",
      socialLinks: { x: "https://example.com" },
      settings: { theme: "dark" },
      createdAt: new Date("2026-01-01T00:00:00.000Z"),
      updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(user),
      findByUsername: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn(),
    };
    const userProfileRepository: UserProfileRepository = {
      findByUserId: vi.fn().mockResolvedValue(profile),
      save: vi.fn(),
    };
    const handler = new GetCurrentUserProfileHandler(userRepository, userProfileRepository);

    const result = await handler.execute(new GetCurrentUserProfileQuery({ userId: "user-1" }));

    expect(result.id).toBe("user-1");
    expect(result.username).toBe("user_one");
    expect(result.profile?.preferredSystem).toBe("DND5E");
  });
});
