import type { PrismaClient } from "@prisma/client";
import type { QuestDetailsReadModel } from "@modules/quests/application/dto/QuestDetailsReadModel";
import type { QuestReadRepository } from "@modules/quests/application/ports/QuestReadRepository";
import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import type {
  QuestMapper,
  QuestObjectivePersistenceRecord,
  QuestPersistenceRecord,
  QuestRelationPersistenceRecord,
} from "@modules/quests/infrastructure/persistence/QuestMapper";

interface QuestDetailsPersistenceRecord extends QuestPersistenceRecord {
  objectives: QuestObjectivePersistenceRecord[];
  relations: QuestRelationPersistenceRecord[];
}

interface QuestReadDelegate {
  findMany(args: unknown): Promise<QuestPersistenceRecord[]>;
  findFirst(args: unknown): Promise<QuestDetailsPersistenceRecord | null>;
}

export class PrismaQuestReadRepository implements QuestReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: QuestMapper,
  ) {}

  public async listCampaignQuests(campaignId: string): Promise<Quest[]> {
    const questClient = this.prismaClient as PrismaClient & { quest: QuestReadDelegate };
    const quests = await questClient.quest.findMany({
      where: {
        campaignId,
        deletedAt: null,
      },
      orderBy: [
        { updatedAt: "desc" },
        { createdAt: "desc" },
      ],
    });

    return quests.map((quest) => this.mapper.toDomain(quest));
  }

  public async getQuestDetails(campaignId: string, questId: string): Promise<QuestDetailsReadModel | null> {
    const questClient = this.prismaClient as PrismaClient & { quest: QuestReadDelegate };
    const quest = await questClient.quest.findFirst({
      where: {
        id: questId,
        campaignId,
        deletedAt: null,
      },
      include: {
        objectives: {
          orderBy: [
            { sortOrder: "asc" },
            { createdAt: "asc" },
          ],
        },
        relations: {
          orderBy: [
            { createdAt: "asc" },
            { relationType: "asc" },
          ],
        },
      },
    });

    if (quest === null) {
      return null;
    }

    return {
      quest: this.mapper.toDomain(quest),
      objectives: quest.objectives.map((objective) => this.mapper.objectiveToDomain(objective)),
      relations: quest.relations.map((relation) => this.mapper.relationToDomain(relation)),
    };
  }

  public async listQuestObjectives(campaignId: string, questId: string): Promise<QuestObjective[]> {
    const details = await this.getQuestDetails(campaignId, questId);

    return details?.objectives ?? [];
  }
}
