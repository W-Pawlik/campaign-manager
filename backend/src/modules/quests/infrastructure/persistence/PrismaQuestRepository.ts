import type { PrismaClient } from "@prisma/client";
import type { QuestRepository } from "@modules/quests/application/ports/QuestRepository";
import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import type { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";
import type {
  QuestMapper,
  QuestObjectivePersistenceRecord,
  QuestPersistenceRecord,
} from "@modules/quests/infrastructure/persistence/QuestMapper";

interface QuestDelegate {
  findFirst(args: unknown): Promise<QuestPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

interface QuestObjectiveDelegate {
  findFirst(args: unknown): Promise<QuestObjectivePersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
  deleteMany(args: unknown): Promise<unknown>;
}

interface QuestRelationDelegate {
  create(args: unknown): Promise<unknown>;
  deleteMany(args: unknown): Promise<unknown>;
}

export class PrismaQuestRepository implements QuestRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: QuestMapper,
  ) {}

  public async findById(campaignId: string, questId: string): Promise<Quest | null> {
    const questClient = this.prismaClient as PrismaClient & { quest: QuestDelegate };
    const quest = await questClient.quest.findFirst({
      where: {
        id: questId,
        campaignId,
        deletedAt: null,
      },
    });

    return quest === null ? null : this.mapper.toDomain(quest);
  }

  public async create(quest: Quest): Promise<void> {
    const questClient = this.prismaClient as PrismaClient & { quest: QuestDelegate };
    await questClient.quest.create({
      data: this.mapper.toPersistenceCreate(quest),
    });
  }

  public async save(quest: Quest): Promise<void> {
    const questClient = this.prismaClient as PrismaClient & { quest: QuestDelegate };
    await questClient.quest.update({
      where: { id: quest.id },
      data: this.mapper.toPersistenceUpdate(quest),
    });
  }

  public async createObjective(objective: QuestObjective): Promise<void> {
    const objectiveClient = this.prismaClient as PrismaClient & { questObjective: QuestObjectiveDelegate };
    await objectiveClient.questObjective.create({
      data: this.mapper.objectiveToPersistenceCreate(objective),
    });
  }

  public async findObjectiveById(questId: string, objectiveId: string): Promise<QuestObjective | null> {
    const objectiveClient = this.prismaClient as PrismaClient & { questObjective: QuestObjectiveDelegate };
    const objective = await objectiveClient.questObjective.findFirst({
      where: {
        id: objectiveId,
        questId,
      },
    });

    return objective === null ? null : this.mapper.objectiveToDomain(objective);
  }

  public async saveObjective(objective: QuestObjective): Promise<void> {
    const objectiveClient = this.prismaClient as PrismaClient & { questObjective: QuestObjectiveDelegate };
    await objectiveClient.questObjective.update({
      where: { id: objective.id },
      data: this.mapper.objectiveToPersistenceUpdate(objective),
    });
  }

  public async deleteObjective(questId: string, objectiveId: string): Promise<void> {
    const objectiveClient = this.prismaClient as PrismaClient & { questObjective: QuestObjectiveDelegate };
    await objectiveClient.questObjective.deleteMany({
      where: {
        id: objectiveId,
        questId,
      },
    });
  }

  public async createRelation(relation: QuestRelation): Promise<void> {
    const relationClient = this.prismaClient as PrismaClient & { questRelation: QuestRelationDelegate };
    await relationClient.questRelation.create({
      data: this.mapper.relationToPersistenceCreate(relation),
    });
  }

  public async deleteRelation(questId: string, relationId: string): Promise<void> {
    const relationClient = this.prismaClient as PrismaClient & { questRelation: QuestRelationDelegate };
    await relationClient.questRelation.deleteMany({
      where: {
        id: relationId,
        questId,
      },
    });
  }
}
