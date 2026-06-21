import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { QuestDetailsDTO, QuestGmViewDTO, QuestPlayerViewDTO } from "@modules/quests/application/dto/QuestDetailsDTO";
import type { QuestListItemDTO } from "@modules/quests/application/dto/QuestListItemDTO";
import type { QuestObjectiveDTO } from "@modules/quests/application/dto/QuestObjectiveDTO";
import type { QuestRelationDTO } from "@modules/quests/application/dto/QuestRelationDTO";
import type { Quest } from "@modules/quests/domain/entities/Quest";
import type { QuestObjective } from "@modules/quests/domain/entities/QuestObjective";
import type { QuestRelation } from "@modules/quests/domain/entities/QuestRelation";

export function mapQuestListItemFromDomain(quest: Quest): QuestListItemDTO {
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
    startedAt: quest.startedAt?.toISOString() ?? null,
    completedAt: quest.completedAt?.toISOString() ?? null,
    failedAt: quest.failedAt?.toISOString() ?? null,
    rewardDescription: quest.rewardDescription,
    createdAt: quest.createdAt.toISOString(),
    updatedAt: quest.updatedAt.toISOString(),
  };
}

export function mapQuestObjectiveDtoFromDomain(objective: QuestObjective): QuestObjectiveDTO {
  return {
    id: objective.id,
    questId: objective.questId,
    title: objective.title,
    description: objective.description,
    status: objective.status.value,
    sortOrder: objective.sortOrder,
    createdAt: objective.createdAt.toISOString(),
    updatedAt: objective.updatedAt.toISOString(),
  };
}

export function mapQuestRelationDtoFromDomain(relation: QuestRelation): QuestRelationDTO {
  return {
    id: relation.id,
    questId: relation.questId,
    entityType: relation.entityType.value,
    entityId: relation.entityId,
    relationType: relation.relationType,
    createdAt: relation.createdAt.toISOString(),
  };
}

export function mapQuestPlayerViewFromDomain(
  quest: Quest,
  objectives: QuestObjective[],
  relations: QuestRelation[],
): QuestPlayerViewDTO {
  return {
    ...mapQuestListItemFromDomain(quest),
    objectives: objectives.map(mapQuestObjectiveDtoFromDomain),
    relations: relations.map(mapQuestRelationDtoFromDomain),
  };
}

export function mapQuestGmViewFromDomain(
  quest: Quest,
  objectives: QuestObjective[],
  relations: QuestRelation[],
): QuestGmViewDTO {
  return {
    ...mapQuestPlayerViewFromDomain(quest, objectives, relations),
    gmNotes: quest.gmNotes,
    createdById: quest.createdById,
  };
}

export function mapQuestDetailsFromDomain(
  quest: Quest,
  objectives: QuestObjective[],
  relations: QuestRelation[],
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): QuestDetailsDTO {
  return visibilityService.canSeeSecretContent(role)
    ? mapQuestGmViewFromDomain(quest, objectives, relations)
    : mapQuestPlayerViewFromDomain(quest, objectives, relations);
}
