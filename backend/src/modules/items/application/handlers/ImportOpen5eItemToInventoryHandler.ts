import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { Open5eInvalidResponseError } from "@modules/external-references/application/errors/Open5eErrors";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { EXTERNAL_RESOURCE_TYPE } from "@modules/external-references/domain/value-objects/ExternalResourceType";
import type { ImportOpen5eItemToInventoryCommand } from "@modules/items/application/commands/ImportOpen5eItemToInventoryCommand";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemSource } from "@modules/items/domain/value-objects/ItemSource";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

function toNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim().length > 0 ? value : null;
}

function toNullableNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function getNormalizedItemData(normalizedData: unknown): Record<string, unknown> {
  if (normalizedData === null || typeof normalizedData !== "object") {
    throw new Open5eInvalidResponseError();
  }

  return normalizedData as Record<string, unknown>;
}

export class ImportOpen5eItemToInventoryHandler
  implements CommandHandler<ImportOpen5eItemToInventoryCommand, InventoryItemDTO>
{
  public constructor(
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
    private readonly open5eExternalReferenceResolver: Open5eExternalReferenceResolver,
  ) {}

  public async execute(command: ImportOpen5eItemToInventoryCommand): Promise<InventoryItemDTO> {
    const resourceKey = command.input.resourceKey?.trim();
    const externalReferenceId = command.input.externalReferenceId?.trim();

    if (
      (resourceKey === undefined || resourceKey.length === 0) &&
      (externalReferenceId === undefined || externalReferenceId.length === 0)
    ) {
      throw new ValidationError("resourceKey or externalReferenceId must be provided");
    }

    const access = await this.accessService.requireMembership(command.input.campaignId, command.input.actorUserId);
    const ownerType = InventoryOwnerType.create(command.input.ownerType);

    await this.ownerService.validateOwnerExists(command.input.campaignId, ownerType, command.input.ownerId);
    await this.ownerService.assertCanManageOwner({
      campaignId: command.input.campaignId,
      ownerType,
      ownerId: command.input.ownerId,
      actorUserId: command.input.actorUserId,
      actorRole: access.role,
    });

    const reference =
      externalReferenceId !== undefined && externalReferenceId.length > 0
        ? await this.open5eExternalReferenceResolver.getById(externalReferenceId)
        : await this.open5eExternalReferenceResolver.getOrRefresh(command.input.resourceType, resourceKey!);

    if (reference === null) {
      throw new NotFoundError("External reference not found");
    }

    if (
      reference.resourceType.value !== EXTERNAL_RESOURCE_TYPE.EQUIPMENT &&
      reference.resourceType.value !== EXTERNAL_RESOURCE_TYPE.MAGIC_ITEM
    ) {
      throw new ValidationError("Only Open5e item resources can be imported into inventory");
    }

    const normalizedData = getNormalizedItemData(reference.normalizedData);
    const type = toNullableString(normalizedData.type) ?? ItemType.other().value;
    const rarity = toNullableString(normalizedData.rarity);
    const createdAt = new Date();
    const item = InventoryItem.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      itemTemplateId: null,
      source: ItemSource.open5e().value,
      externalReferenceId: reference.id,
      name: command.input.nameOverride?.trim() || reference.name,
      type: ItemType.create(type).value,
      rarity: rarity === null ? null : ItemRarity.create(rarity).value,
      isMagical:
        typeof normalizedData.isMagical === "boolean"
          ? normalizedData.isMagical
          : reference.resourceType.value === EXTERNAL_RESOURCE_TYPE.MAGIC_ITEM,
      description: toNullableString(normalizedData.description),
      weight: toNullableNumber(normalizedData.weight),
      valueAmount: toNullableNumber(normalizedData.valueAmount),
      valueCurrency: toNullableString(normalizedData.valueCurrency),
      quantity: command.input.quantity ?? 1,
      charges: command.input.charges ?? null,
      maxCharges: command.input.maxCharges ?? null,
      isEquipped: false,
      isAttuned: command.input.isAttuned ?? false,
      isIdentified: command.input.isIdentified ?? true,
      ownerType,
      ownerId: command.input.ownerId,
      visibility:
        command.input.visibility === undefined
          ? ItemVisibility.public()
          : ItemVisibility.create(command.input.visibility),
      customProperties: command.input.customProperties ?? normalizedData,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.inventoryItemRepository.create(item);

    return mapInventoryItemDtoFromDomain(item);
  }
}
