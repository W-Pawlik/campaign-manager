import type { PrismaClient } from "@prisma/client";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserProfile as UserProfileEntity } from "@modules/users/domain/entities/UserProfile";
import type { UserProfileMapper } from "@modules/users/infrastructure/persistence/UserProfileMapper";

export class PrismaUserProfileRepository implements UserProfileRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly userProfileMapper: UserProfileMapper,
  ) {}

  public async findByUserId(userId: string): Promise<UserProfileEntity | null> {
    const userProfile = await this.prismaClient.userProfile.findUnique({
      where: { userId },
    });

    if (userProfile === null) {
      return null;
    }

    return this.userProfileMapper.toDomain(userProfile);
  }

  public async save(profile: UserProfileEntity): Promise<void> {
    await this.prismaClient.userProfile.upsert({
      where: { userId: profile.userId },
      create: this.userProfileMapper.toPersistenceCreate(profile),
      update: this.userProfileMapper.toPersistenceUpdate(profile),
    });
  }
}
