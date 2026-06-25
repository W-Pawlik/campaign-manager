import { describe, expect, it, vi } from "vitest";

import { SearchUsersHandler } from "@modules/users/application/handlers/SearchUsersHandler";
import { SearchUsersQuery } from "@modules/users/application/queries/SearchUsersQuery";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { User } from "@modules/users/domain/entities/User";
import { DisplayName } from "@modules/users/domain/value-objects/DisplayName";
import { Username } from "@modules/users/domain/value-objects/Username";

function createUser(id: string, username: string, displayName: string): User {
  return User.create({
    id,
    email: `${username}@example.com`,
    username: Username.create(username),
    displayName: DisplayName.create(displayName),
    passwordHash: "hashed-password",
    avatarUrl: null,
    bio: null,
    timezone: null,
    locale: null,
    emailVerifiedAt: null,
    lastLoginAt: null,
    createdAt: new Date("2026-01-01T00:00:00.000Z"),
    updatedAt: new Date("2026-01-01T00:00:00.000Z"),
    deletedAt: null,
  });
}

describe("SearchUsersHandler", () => {
  it("maps matched users to lookup DTO items", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn(),
      findByUsername: vi.fn(),
      save: vi.fn(),
      search: vi
        .fn()
        .mockResolvedValue([createUser("user-1", "gm_master", "Game Master")]),
      softDelete: vi.fn(),
    };
    const handler = new SearchUsersHandler(userRepository);

    const result = await handler.execute(new SearchUsersQuery({ limit: 8, query: "gm" }));

    expect(userRepository.search).toHaveBeenCalledWith("gm", 8);
    expect(result).toEqual([
      {
        id: "user-1",
        username: "gm_master",
        displayName: "Game Master",
        avatarUrl: null,
      },
    ]);
  });
});
