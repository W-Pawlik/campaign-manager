import type {
  CreateCharacterInput,
} from "@modules/characters/application/commands/CreateCharacterCommand";
import type {
  UpdateCharacterInput,
} from "@modules/characters/application/commands/UpdateCharacterCommand";
import type {
  CreateCharacterRequestBody,
  UpdateCharacterRequestBody,
} from "@api/schemas/campaigns.schemas";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";

interface MapCreateCharacterCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateCharacterRequestBody;
}

interface MapUpdateCharacterCommandInputParams {
  campaignId: string;
  characterId: string;
  actorUserId: string;
  body: UpdateCharacterRequestBody;
}

export function mapCreateCharacterCommandInput(
  params: MapCreateCharacterCommandInputParams,
): CreateCharacterInput {
  const body = omitUndefinedProperties(params.body) as Omit<CreateCharacterInput, "campaignId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateCharacterCommandInput(
  params: MapUpdateCharacterCommandInputParams,
): UpdateCharacterInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    UpdateCharacterInput,
    "campaignId" | "characterId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    characterId: params.characterId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
