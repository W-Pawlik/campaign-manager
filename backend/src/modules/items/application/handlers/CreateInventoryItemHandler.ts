import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CreateInventoryItemCommand } from "@modules/items/application/commands/CreateInventoryItemCommand";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemSource } from "@modules/items/domain/value-objects/ItemSource";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

export class CreateInventoryItemHandler implements CommandHandler<CreateInventoryItemCommand, InventoryItemDTO> {
  public constructor(
    private readonly itemTemplateRepository: ItemTemplateRepository,
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
  ) {}

  public async execute(command: CreateInventoryItemCommand): Promise<InventoryItemDTO> {
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

    const template =
      command.input.itemTemplateId === undefined || command.input.itemTemplateId === null
        ? null
        : await this.itemTemplateRepository.findById(command.input.itemTemplateId);

    if (command.input.itemTemplateId !== undefined && command.input.itemTemplateId !== null && template === null) {
      throw new ValidationError("Item template not found");
    }

    const name = command.input.name?.trim() ?? template?.name;
    const source =
      command.input.source?.trim() ??
      template?.source.value ??
      ItemSource.custom().value;
    const type =
      command.input.type?.trim() ??
      template?.type.value ??
      ItemType.other().value;
    const rarity =
      command.input.rarity === undefined
        ? template?.rarity?.value ?? null
        : command.input.rarity;

    if (name === undefined) {
      throw new ValidationError("Inventory item name is required when item template is not provided");
    }

    const createdAt = new Date();
    const item = InventoryItem.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      itemTemplateId: command.input.itemTemplateId ?? null,
      source: ItemSource.create(source).value,
      externalReferenceId: command.input.externalReferenceId ?? template?.externalReferenceId ?? null,
      name,
      type: ItemType.create(type).value,
      rarity:
        rarity === null
          ? null
          : ItemRarity.create(rarity).value,
      isMagical: command.input.isMagical ?? template?.isMagical ?? false,
      description: command.input.description ?? template?.description ?? null,
      weight: command.input.weight ?? template?.weight ?? null,
      valueAmount: command.input.valueAmount ?? template?.valueAmount ?? null,
      valueCurrency: command.input.valueCurrency ?? template?.valueCurrency ?? null,
      quantity: command.input.quantity ?? 1,
      charges: command.input.charges ?? null,
      maxCharges: command.input.maxCharges ?? null,
      isEquipped: command.input.isEquipped ?? false,
      isAttuned: command.input.isAttuned ?? false,
      isIdentified: command.input.isIdentified ?? true,
      ownerType,
      ownerId: command.input.ownerId,
      visibility:
        command.input.visibility === undefined
          ? ItemVisibility.public()
          : ItemVisibility.create(command.input.visibility),
      customProperties: command.input.customProperties ?? template?.properties ?? null,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.inventoryItemRepository.create(item);

    return mapInventoryItemDtoFromDomain(item);
  }
}
