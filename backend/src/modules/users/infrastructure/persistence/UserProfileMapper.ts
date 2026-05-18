import { Prisma } from "@prisma/client";
import type { UserProfile as PrismaUserProfile } from "@prisma/client";
import type { UserProfile } from "@modules/users/domain/entities/UserProfile";
import { UserProfile as DomainUserProfile } from "@modules/users/domain/entities/UserProfile";

export class UserProfileMapper {
  public toDomain(prismaUserProfile: PrismaUserProfile): UserProfile {
    return DomainUserProfile.create({
      id: prismaUserProfile.id,
      userId: prismaUserProfile.userId,
      preferredSystem: prismaUserProfile.preferredSystem,
      defaultTimezone: prismaUserProfile.defaultTimezone,
      socialLinks: prismaUserProfile.socialLinks,
      settings: prismaUserProfile.settings,
      createdAt: prismaUserProfile.createdAt,
      updatedAt: prismaUserProfile.updatedAt,
    });
  }

  public toPersistenceCreate(userProfile: UserProfile): Prisma.UserProfileUncheckedCreateInput {
    return {
      id: userProfile.id,
      userId: userProfile.userId,
      preferredSystem: userProfile.preferredSystem,
      defaultTimezone: userProfile.defaultTimezone,
      socialLinks: this.toNullableJsonInput(userProfile.socialLinks),
      settings: this.toNullableJsonInput(userProfile.settings),
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }

  public toPersistenceUpdate(userProfile: UserProfile): Prisma.UserProfileUncheckedUpdateInput {
    return {
      preferredSystem: userProfile.preferredSystem,
      defaultTimezone: userProfile.defaultTimezone,
      socialLinks: this.toNullableJsonInput(userProfile.socialLinks),
      settings: this.toNullableJsonInput(userProfile.settings),
      createdAt: userProfile.createdAt,
      updatedAt: userProfile.updatedAt,
    };
  }

  private toNullableJsonInput(
    value: unknown,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    if (value === null || value === undefined) {
      return Prisma.JsonNull;
    }

    return value as Prisma.InputJsonValue;
  }
}
