import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { UpdateInventoryItemCommand } from "@modules/items/application/commands/UpdateInventoryItemCommand";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { ItemRarity } from "@modules/items/domain/value-objects/ItemRarity";
import { ItemType } from "@modules/items/domain/value-objects/ItemType";
import { ItemVisibility } from "@modules/items/domain/value-objects/ItemVisibility";

export class UpdateInventoryItemHandler implements CommandHandler<UpdateInventoryItemCommand, InventoryItemDTO> {
  public constructor(
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
  ) {}

  public async execute(command: UpdateInventoryItemCommand): Promise<InventoryItemDTO> {
    if (
      command.input.name === undefined &&
      command.input.type === undefined &&
      command.input.rarity === undefined &&
      command.input.isMagical === undefined &&
      command.input.description === undefined &&
      command.input.weight === undefined &&
      command.input.valueAmount === undefined &&
      command.input.valueCurrency === undefined &&
      command.input.quantity === undefined &&
      command.input.charges === undefined &&
      command.input.maxCharges === undefined &&
      command.input.isAttuned === undefined &&
      command.input.isIdentified === undefined &&
      command.input.visibility === undefined &&
      command.input.customProperties === undefined
    ) {
      throw new ValidationError("At least one field must be provided for update");
    }

    const access = await this.accessService.requireMembership(command.input.campaignId, command.input.actorUserId);
    const item = await this.inventoryItemRepository.findById(command.input.campaignId, command.input.itemId);

    if (item === null) {
      throw new NotFoundError("Inventory item not found");
    }

    await this.ownerService.assertCanManageOwner({
      campaignId: item.campaignId,
      ownerType: item.ownerType,
      ownerId: item.ownerId,
      actorUserId: command.input.actorUserId,
      actorRole: access.role,
    });

    const updatedItem = item.withUpdates({
      ...(command.input.name === undefined ? {} : { name: command.input.name.trim() }),
      ...(command.input.type === undefined ? {} : { type: ItemType.create(command.input.type).value }),
      ...(command.input.rarity === undefined
        ? {}
        : { rarity: command.input.rarity === null ? null : ItemRarity.create(command.input.rarity).value }),
      ...(command.input.isMagical === undefined ? {} : { isMagical: command.input.isMagical }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(command.input.weight === undefined ? {} : { weight: command.input.weight }),
      ...(command.input.valueAmount === undefined ? {} : { valueAmount: command.input.valueAmount }),
      ...(command.input.valueCurrency === undefined ? {} : { valueCurrency: command.input.valueCurrency }),
      ...(command.input.quantity === undefined ? {} : { quantity: command.input.quantity }),
      ...(command.input.charges === undefined ? {} : { charges: command.input.charges }),
      ...(command.input.maxCharges === undefined ? {} : { maxCharges: command.input.maxCharges }),
      ...(command.input.isAttuned === undefined ? {} : { isAttuned: command.input.isAttuned }),
      ...(command.input.isIdentified === undefined ? {} : { isIdentified: command.input.isIdentified }),
      ...(command.input.visibility === undefined ? {} : { visibility: ItemVisibility.create(command.input.visibility) }),
      ...(command.input.customProperties === undefined ? {} : { customProperties: command.input.customProperties }),
    });

    await this.inventoryItemRepository.save(updatedItem);

    return mapInventoryItemDtoFromDomain(updatedItem);
  }
}
