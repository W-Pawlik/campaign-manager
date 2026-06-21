import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateQuestObjectiveRequestBody,
  CreateQuestRequestBody,
  UpdateQuestObjectiveRequestBody,
  UpdateQuestRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { AddQuestObjectiveInput } from "@modules/quests/application/commands/AddQuestObjectiveCommand";
import type { CreateQuestInput } from "@modules/quests/application/commands/CreateQuestCommand";
import type { UpdateQuestInput } from "@modules/quests/application/commands/UpdateQuestCommand";
import type { UpdateQuestObjectiveInput } from "@modules/quests/application/commands/UpdateQuestObjectiveCommand";

interface MapCreateQuestCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateQuestRequestBody;
}

interface MapUpdateQuestCommandInputParams {
  campaignId: string;
  questId: string;
  actorUserId: string;
  body: UpdateQuestRequestBody;
}

interface MapAddQuestObjectiveCommandInputParams {
  campaignId: string;
  questId: string;
  actorUserId: string;
  body: CreateQuestObjectiveRequestBody;
}

interface MapUpdateQuestObjectiveCommandInputParams {
  campaignId: string;
  questId: string;
  objectiveId: string;
  actorUserId: string;
  body: UpdateQuestObjectiveRequestBody;
}

function mapDate(value: string | null | undefined): Date | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value === null ? null : new Date(value);
}

export function mapCreateQuestCommandInput(params: MapCreateQuestCommandInputParams): CreateQuestInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
    startedAt: mapDate(body.startedAt as string | null | undefined),
    completedAt: mapDate(body.completedAt as string | null | undefined),
    failedAt: mapDate(body.failedAt as string | null | undefined),
  } as CreateQuestInput;
}

export function mapUpdateQuestCommandInput(params: MapUpdateQuestCommandInputParams): UpdateQuestInput {
  const body = omitUndefinedProperties(params.body);

  return {
    campaignId: params.campaignId,
    questId: params.questId,
    actorUserId: params.actorUserId,
    ...body,
    startedAt: mapDate(body.startedAt as string | null | undefined),
    completedAt: mapDate(body.completedAt as string | null | undefined),
    failedAt: mapDate(body.failedAt as string | null | undefined),
  } as UpdateQuestInput;
}

export function mapAddQuestObjectiveCommandInput(
  params: MapAddQuestObjectiveCommandInputParams,
): AddQuestObjectiveInput {
  const body = omitUndefinedProperties(params.body) as Omit<AddQuestObjectiveInput, "campaignId" | "questId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    questId: params.questId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateQuestObjectiveCommandInput(
  params: MapUpdateQuestObjectiveCommandInputParams,
): UpdateQuestObjectiveInput {
  const body = omitUndefinedProperties(params.body) as Omit<UpdateQuestObjectiveInput, "campaignId" | "questId" | "objectiveId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    questId: params.questId,
    objectiveId: params.objectiveId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
