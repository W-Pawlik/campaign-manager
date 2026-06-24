import type {
  CopyCatalogItemToCampaignRequestBody,
  CreatePublishedItemRequestBody,
  UpdatePublishedItemRequestBody,
} from "@api/schemas/item-catalog.schemas";
import type { CreateItemTemplateInput } from "@modules/items/application/commands/CreateItemTemplateCommand";
import type { CreateInventoryItemInput } from "@modules/items/application/commands/CreateInventoryItemCommand";
import type { ImportOpen5eItemToInventoryInput } from "@modules/items/application/commands/ImportOpen5eItemToInventoryCommand";
import type { UpdateItemTemplateInput } from "@modules/items/application/commands/UpdateItemTemplateCommand";

export function mapCreatePublishedItemCommandInput(params: {
  actorUserId: string;
  body: CreatePublishedItemRequestBody;
}): CreateItemTemplateInput {
  const body = params.body;

  return {
    actorUserId: params.actorUserId,
    name: body.name,
    ...(body.type === undefined ? {} : { type: body.type }),
    ...(body.rarity === undefined ? {} : { rarity: body.rarity }),
    ...(body.isMagical === undefined ? {} : { isMagical: body.isMagical }),
    ...(body.description === undefined ? {} : { description: body.description }),
    ...(body.properties === undefined ? {} : { properties: body.properties }),
    ...(body.weight === undefined ? {} : { weight: body.weight }),
    ...(body.valueAmount === undefined ? {} : { valueAmount: body.valueAmount }),
    ...(body.valueCurrency === undefined ? {} : { valueCurrency: body.valueCurrency }),
  };
}

export function mapUpdatePublishedItemCommandInput(params: {
  actorUserId: string;
  itemTemplateId: string;
  body: UpdatePublishedItemRequestBody;
}): UpdateItemTemplateInput {
  const body = params.body;

  return {
    actorUserId: params.actorUserId,
    itemTemplateId: params.itemTemplateId,
    ...(body.name === undefined ? {} : { name: body.name }),
    ...(body.type === undefined ? {} : { type: body.type }),
    ...(body.rarity === undefined ? {} : { rarity: body.rarity }),
    ...(body.isMagical === undefined ? {} : { isMagical: body.isMagical }),
    ...(body.description === undefined ? {} : { description: body.description }),
    ...(body.properties === undefined ? {} : { properties: body.properties }),
    ...(body.weight === undefined ? {} : { weight: body.weight }),
    ...(body.valueAmount === undefined ? {} : { valueAmount: body.valueAmount }),
    ...(body.valueCurrency === undefined ? {} : { valueCurrency: body.valueCurrency }),
  };
}

export function mapCopyPublishedItemToCampaignCommandInput(params: {
  actorUserId: string;
  itemTemplateId: string;
  body: CopyCatalogItemToCampaignRequestBody;
}): CreateInventoryItemInput {
  const body = params.body;

  return {
    campaignId: body.campaignId,
    actorUserId: params.actorUserId,
    itemTemplateId: params.itemTemplateId,
    ownerType: body.ownerType,
    ownerId: body.ownerId,
    ...(body.quantity === undefined ? {} : { quantity: body.quantity }),
    ...(body.charges === undefined ? {} : { charges: body.charges }),
    ...(body.maxCharges === undefined ? {} : { maxCharges: body.maxCharges }),
    ...(body.isAttuned === undefined ? {} : { isAttuned: body.isAttuned }),
    ...(body.isIdentified === undefined ? {} : { isIdentified: body.isIdentified }),
    ...(body.visibility === undefined ? {} : { visibility: body.visibility }),
    ...(body.nameOverride === undefined ? {} : { name: body.nameOverride }),
    ...(body.customProperties === undefined ? {} : { customProperties: body.customProperties }),
  };
}

export function mapCopyOpen5eItemToCampaignCommandInput(params: {
  actorUserId: string;
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
  resourceKey: string;
  body: CopyCatalogItemToCampaignRequestBody;
}): ImportOpen5eItemToInventoryInput {
  const body = params.body;

  return {
    campaignId: body.campaignId,
    actorUserId: params.actorUserId,
    resourceType: params.resourceType,
    resourceKey: params.resourceKey,
    ownerType: body.ownerType,
    ownerId: body.ownerId,
    ...(body.quantity === undefined ? {} : { quantity: body.quantity }),
    ...(body.charges === undefined ? {} : { charges: body.charges }),
    ...(body.maxCharges === undefined ? {} : { maxCharges: body.maxCharges }),
    ...(body.isAttuned === undefined ? {} : { isAttuned: body.isAttuned }),
    ...(body.isIdentified === undefined ? {} : { isIdentified: body.isIdentified }),
    ...(body.visibility === undefined ? {} : { visibility: body.visibility }),
    ...(body.nameOverride === undefined ? {} : { nameOverride: body.nameOverride }),
    ...(body.customProperties === undefined ? {} : { customProperties: body.customProperties }),
  };
}
