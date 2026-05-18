import type { User as PrismaUser } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import { User } from "@modules/users/domain/entities/User";
import { DisplayName } from "@modules/users/domain/value-objects/DisplayName";
import { Username } from "@modules/users/domain/value-objects/Username";

export class UserMapper {
  public toDomain(prismaUser: PrismaUser): User {
    return User.create({
      id: prismaUser.id,
      email: prismaUser.email,
      username: Username.create(prismaUser.username),
      displayName: DisplayName.create(prismaUser.displayName),
      passwordHash: prismaUser.passwordHash,
      avatarUrl: prismaUser.avatarUrl,
      bio: prismaUser.bio,
      timezone: prismaUser.timezone,
      locale: prismaUser.locale,
      emailVerifiedAt: prismaUser.emailVerifiedAt,
      lastLoginAt: prismaUser.lastLoginAt,
      createdAt: prismaUser.createdAt,
      updatedAt: prismaUser.updatedAt,
      deletedAt: prismaUser.deletedAt,
    });
  }

  public toPersistenceUpdate(user: User): Prisma.UserUncheckedUpdateInput {
    return {
      email: user.email,
      username: user.username.value,
      displayName: user.displayName.value,
      passwordHash: user.passwordHash,
      avatarUrl: user.avatarUrl,
      bio: user.bio,
      timezone: user.timezone,
      locale: user.locale,
      emailVerifiedAt: user.emailVerifiedAt,
      lastLoginAt: user.lastLoginAt,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      deletedAt: user.deletedAt,
    };
  }
}
