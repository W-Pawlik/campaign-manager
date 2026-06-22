import type { PrismaClient } from "@prisma/client";
import type { ListCampaignMonstersFilters, MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { Monster } from "@modules/monsters/domain/entities/Monster";
import type { MonsterMapper, MonsterPersistenceRecord } from "@modules/monsters/infrastructure/persistence/MonsterMapper";

interface MonsterReadDelegate {
  findMany(args: unknown): Promise<MonsterPersistenceRecord[]>;
  findFirst(args: unknown): Promise<MonsterPersistenceRecord | null>;
}

export class PrismaMonsterReadRepository implements MonsterReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: MonsterMapper,
  ) {}

  public async listCampaignMonsters(filters: ListCampaignMonstersFilters): Promise<Monster[]> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterReadDelegate };
    const where: Record<string, unknown> = {
      deletedAt: null,
      OR: filters.includeGlobal === true
        ? [
            { campaignId: filters.campaignId },
            { campaignId: null },
          ]
        : [{ campaignId: filters.campaignId }],
    };

    if (filters.search !== undefined) {
      where["name"] = { contains: filters.search, mode: "insensitive" };
    }

    if (filters.type !== undefined) {
      where["type"] = filters.type;
    }

    if (filters.status !== undefined) {
      where["status"] = filters.status;
    }

    if (filters.minCr !== undefined || filters.maxCr !== undefined) {
      where["challengeRatingDecimal"] = {
        ...(filters.minCr === undefined ? {} : { gte: filters.minCr }),
        ...(filters.maxCr === undefined ? {} : { lte: filters.maxCr }),
      };
    }

    const monsters = await monsterClient.monster.findMany({
      where,
      orderBy: [
        { campaignId: "desc" },
        { challengeRatingDecimal: "asc" },
        { name: "asc" },
      ],
    });

    return monsters.map((monster) => this.mapper.toDomain(monster));
  }

  public async getDetails(monsterId: string): Promise<Monster | null> {
    const monsterClient = this.prismaClient as PrismaClient & { monster: MonsterReadDelegate };
    const monster = await monsterClient.monster.findFirst({
      where: {
        id: monsterId,
        deletedAt: null,
      },
    });

    return monster === null ? null : this.mapper.toDomain(monster);
  }
}
