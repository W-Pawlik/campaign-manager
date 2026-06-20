import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateNpcRequestBody,
  UpdateNpcRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { CreateNpcInput } from "@modules/npcs/application/commands/CreateNpcCommand";
import type { UpdateNpcInput } from "@modules/npcs/application/commands/UpdateNpcCommand";

interface MapCreateNpcCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateNpcRequestBody;
}

interface MapUpdateNpcCommandInputParams {
  campaignId: string;
  npcId: string;
  actorUserId: string;
  body: UpdateNpcRequestBody;
}

export function mapCreateNpcCommandInput(params: MapCreateNpcCommandInputParams): CreateNpcInput {
  const body = omitUndefinedProperties(params.body) as Omit<CreateNpcInput, "campaignId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateNpcCommandInput(params: MapUpdateNpcCommandInputParams): UpdateNpcInput {
  const body = omitUndefinedProperties(params.body) as Omit<
    UpdateNpcInput,
    "campaignId" | "npcId" | "actorUserId"
  >;

  return {
    campaignId: params.campaignId,
    npcId: params.npcId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
