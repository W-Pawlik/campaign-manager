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

function omitUndefinedProperties<T extends Record<string, unknown>>(input: T): Partial<T> {
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);

  return Object.fromEntries(entries) as Partial<T>;
}
