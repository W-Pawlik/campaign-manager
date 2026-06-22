import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateMonsterRequestBody,
  UpdateMonsterRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { CreateCustomMonsterInput } from "@modules/monsters/application/commands/CreateCustomMonsterCommand";
import type { UpdateMonsterInput } from "@modules/monsters/application/commands/UpdateMonsterCommand";

interface MapCreateMonsterCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateMonsterRequestBody;
}

interface MapUpdateMonsterCommandInputParams {
  campaignId: string;
  monsterId: string;
  actorUserId: string;
  body: UpdateMonsterRequestBody;
}

export function mapCreateMonsterCommandInput(
  params: MapCreateMonsterCommandInputParams,
): CreateCustomMonsterInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    CreateCustomMonsterInput,
    "campaignId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateMonsterCommandInput(
  params: MapUpdateMonsterCommandInputParams,
): UpdateMonsterInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    UpdateMonsterInput,
    "campaignId" | "monsterId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    monsterId: params.monsterId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
