import { Prisma } from "@prisma/client";
import { RelatedEntityType } from "@modules/notes/domain/value-objects/RelatedEntityType";
import { Quest } from "@modules/quests/domain/entities/Quest";
import { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";
import { ObjectiveStatus } from "@modules/quests/domain/value-objects/ObjectiveStatus";
import { QuestPriority } from "@modules/quests/domain/value-objects/QuestPriority";
import { QuestStatus } from "@modules/quests/domain/value-objects/QuestStatus";
import { QuestType } from "@modules/quests/domain/value-objects/QuestType";
import { QuestVisibility } from "@modules/quests/domain/value-objects/QuestVisibility";

export interface QuestPersistenceRecord {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  visibility: string;
  priority: string;
  giverNpcId: string | null;
  relatedLocationId: string | null;
  startedAt: Date | null;
  completedAt: Date | null;
  failedAt: Date | null;
  rewardDescription: string | null;
  gmNotes: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface QuestObjectivePersistenceRecord {
  id: string;
  questId: string;
  title: string;
  description: string | null;
  status: string;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuestRelationPersistenceRecord {
  id: string;
  questId: string;
  entityType: string;
  entityId: string;
  relationType: string;
  createdAt: Date;
}

export class QuestMapper {
  public toDomain(record: QuestPersistenceRecord): Quest {
    return Quest.create({
      id: record.id,
      campaignId: record.campaignId,
      title: record.title,
      description: record.description,
      status: QuestStatus.create(record.status),
      type: QuestType.create(record.type),
      visibility: QuestVisibility.create(record.visibility),
      priority: QuestPriority.create(record.priority),
      giverNpcId: record.giverNpcId,
      relatedLocationId: record.relatedLocationId,
      startedAt: record.startedAt,
      completedAt: record.completedAt,
      failedAt: record.failedAt,
      rewardDescription: record.rewardDescription,
      gmNotes: record.gmNotes,
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      deletedAt: record.deletedAt,
    });
  }

  public objectiveToDomain(record: QuestObjectivePersistenceRecord): QuestObjective {
    return QuestObjective.create({
      id: record.id,
      questId: record.questId,
      title: record.title,
      description: record.description,
      status: ObjectiveStatus.create(record.status),
      sortOrder: record.sortOrder,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public relationToDomain(record: QuestRelationPersistenceRecord): QuestRelation {
    return QuestRelation.create({
      id: record.id,
      questId: record.questId,
      entityType: RelatedEntityType.create(record.entityType),
      entityId: record.entityId,
      relationType: record.relationType,
      createdAt: record.createdAt,
    });
  }

  public toPersistenceCreate(quest: Quest): Record<string, unknown> {
    return {
      id: quest.id,
      campaignId: quest.campaignId,
      title: quest.title,
      description: quest.description,
      status: quest.status.value,
      type: quest.type.value,
      visibility: quest.visibility.value,
      priority: quest.priority.value,
      giverNpcId: quest.giverNpcId,
      relatedLocationId: quest.relatedLocationId,
      startedAt: quest.startedAt,
      completedAt: quest.completedAt,
      failedAt: quest.failedAt,
      rewardDescription: quest.rewardDescription,
      gmNotes: quest.gmNotes,
      createdById: quest.createdById,
      createdAt: quest.createdAt,
      updatedAt: quest.updatedAt,
      deletedAt: quest.deletedAt,
    };
  }

  public toPersistenceUpdate(quest: Quest): Record<string, unknown> {
    return this.toPersistenceCreate(quest);
  }

  public objectiveToPersistenceCreate(objective: QuestObjective): Record<string, unknown> {
    return {
      id: objective.id,
      questId: objective.questId,
      title: objective.title,
      description: objective.description,
      status: objective.status.value,
      sortOrder: objective.sortOrder,
      createdAt: objective.createdAt,
      updatedAt: objective.updatedAt,
    };
  }

  public objectiveToPersistenceUpdate(objective: QuestObjective): Record<string, unknown> {
    return this.objectiveToPersistenceCreate(objective);
  }

  public relationToPersistenceCreate(relation: QuestRelation): Record<string, unknown> {
    return {
      id: relation.id,
      questId: relation.questId,
      entityType: relation.entityType.value,
      entityId: relation.entityId,
      relationType: relation.relationType,
      createdAt: relation.createdAt,
    };
  }

  public toJsonValue(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
