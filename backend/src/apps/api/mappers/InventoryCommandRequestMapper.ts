import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type {
  CreateInventoryItemRequestBody,
  TransferInventoryItemRequestBody,
  UpdateInventoryItemRequestBody,
} from "@api/schemas/campaigns.schemas";
import type { CreateInventoryItemInput } from "@modules/items/application/commands/CreateInventoryItemCommand";
import type { TransferInventoryItemInput } from "@modules/items/application/commands/TransferInventoryItemCommand";
import type { UpdateInventoryItemInput } from "@modules/items/application/commands/UpdateInventoryItemCommand";

interface MapCreateInventoryItemCommandInputParams {
  campaignId: string;
  actorUserId: string;
  body: CreateInventoryItemRequestBody;
}

interface MapUpdateInventoryItemCommandInputParams {
  campaignId: string;
  itemId: string;
  actorUserId: string;
  body: UpdateInventoryItemRequestBody;
}

interface MapTransferInventoryItemCommandInputParams {
  campaignId: string;
  itemId: string;
  actorUserId: string;
  body: TransferInventoryItemRequestBody;
}

export function mapCreateInventoryItemCommandInput(
  params: MapCreateInventoryItemCommandInputParams,
): CreateInventoryItemInput {
  const body = omitUndefinedProperties(params.body) as Omit<CreateInventoryItemInput, "campaignId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapUpdateInventoryItemCommandInput(
  params: MapUpdateInventoryItemCommandInputParams,
): UpdateInventoryItemInput {
  const body = omitUndefinedProperties(params.body) as Omit<UpdateInventoryItemInput, "campaignId" | "itemId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    itemId: params.itemId,
    actorUserId: params.actorUserId,
    ...body,
  };
}

export function mapTransferInventoryItemCommandInput(
  params: MapTransferInventoryItemCommandInputParams,
): TransferInventoryItemInput {
  const body = omitUndefinedProperties(params.body) as Omit<TransferInventoryItemInput, "campaignId" | "itemId" | "actorUserId">;

  return {
    campaignId: params.campaignId,
    itemId: params.itemId,
    actorUserId: params.actorUserId,
    ...body,
  };
}
