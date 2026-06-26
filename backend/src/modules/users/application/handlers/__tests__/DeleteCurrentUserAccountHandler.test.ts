import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { DeleteCurrentUserAccountCommand } from "@modules/users/application/commands/DeleteCurrentUserAccountCommand";
import { DeleteCurrentUserAccountHandler } from "@modules/users/application/handlers/DeleteCurrentUserAccountHandler";
import type { UserCampaignOwnershipChecker } from "@modules/users/application/ports/UserCampaignOwnershipChecker";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import { User } from "@modules/users/domain/entities/User";
import { Username } from "@modules/users/domain/value-objects/Username";

function createUser(): User {
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
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
}

describe("DeleteCurrentUserAccountHandler", () => {
  it("soft deletes user when they do not own active campaigns", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn().mockResolvedValue(undefined),
    };
    const ownershipChecker: UserCampaignOwnershipChecker = {
      hasActiveOwnedCampaigns: vi.fn().mockResolvedValue(false),
    };
    const handler = new DeleteCurrentUserAccountHandler(userRepository, ownershipChecker);

    await handler.execute(new DeleteCurrentUserAccountCommand({ userId: "user-1" }));

    expect(userRepository.softDelete).toHaveBeenCalledTimes(1);
  });

  it("throws when user owns active campaigns", async () => {
    const userRepository: UserRepository = {
      findById: vi.fn().mockResolvedValue(createUser()),
      findByUsername: vi.fn(),
      save: vi.fn(),
      softDelete: vi.fn(),
    };
    const ownershipChecker: UserCampaignOwnershipChecker = {
      hasActiveOwnedCampaigns: vi.fn().mockResolvedValue(true),
    };
    const handler = new DeleteCurrentUserAccountHandler(userRepository, ownershipChecker);

    await expect(
      handler.execute(new DeleteCurrentUserAccountCommand({ userId: "user-1" })),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(userRepository.softDelete).not.toHaveBeenCalled();
  });
});
