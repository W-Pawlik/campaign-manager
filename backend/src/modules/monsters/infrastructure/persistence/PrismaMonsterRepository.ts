import type { PrismaClient } from "@prisma/client";
import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";
import type { Monster } from "@modules/monsters/domain/entities/Monster";
import type { MonsterMapper, MonsterPersistenceRecord } from "@modules/monsters/infrastructure/persistence/MonsterMapper";

interface MonsterDelegate {
  findFirst(args: unknown): Promise<MonsterPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaMonsterRepository implements MonsterRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: MonsterMapper,
  ) {}

  public async findById(monsterId: string): Promise<Monster | null> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterDelegate };
    const monster = await monsterClient.monster.findFirst({
      where: {
        id: monsterId,
        deletedAt: null,
      },
    });

    return monster === null ? null : this.mapper.toDomain(monster);
  }

  public async findByCampaignIdAndSlug(campaignId: string | null, slug: string): Promise<Monster | null> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterDelegate };
    const monster = await monsterClient.monster.findFirst({
      where: {
        campaignId,
        slug,
        deletedAt: null,
      },
    });

    return monster === null ? null : this.mapper.toDomain(monster);
  }

  public async create(monster: Monster): Promise<void> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterDelegate };
    await monsterClient.monster.create({
      data: this.mapper.toPersistenceCreate(monster),
    });
  }

  public async save(monster: Monster): Promise<void> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterDelegate };
    await monsterClient.monster.update({
      where: { id: monster.id },
      data: this.mapper.toPersistenceUpdate(monster),
    });
  }
}
