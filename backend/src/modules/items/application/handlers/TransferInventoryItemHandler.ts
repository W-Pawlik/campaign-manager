import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { TransferInventoryItemCommand } from "@modules/items/application/commands/TransferInventoryItemCommand";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";

export class TransferInventoryItemHandler implements CommandHandler<TransferInventoryItemCommand, InventoryItemDTO> {
  public constructor(
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
  ) {}

  public async execute(command: TransferInventoryItemCommand): Promise<InventoryItemDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.INVENTORY_TRANSFER,
    );
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

    const targetOwnerType = InventoryOwnerType.create(command.input.targetOwnerType);
    await this.ownerService.validateOwnerExists(command.input.campaignId, targetOwnerType, command.input.targetOwnerId);
    await this.ownerService.assertCanManageOwner({
      campaignId: command.input.campaignId,
      ownerType: targetOwnerType,
      ownerId: command.input.targetOwnerId,
      actorUserId: command.input.actorUserId,
      actorRole: access.role,
    });

    const quantity = command.input.quantity ?? item.quantity;

    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new ValidationError("Transfer quantity must be a positive integer");
    }

    if (quantity > item.quantity) {
      throw new ValidationError("Transfer quantity cannot exceed current item quantity");
    }

    if (quantity === item.quantity) {
      const transferredItem = item.transferOwnership(targetOwnerType, command.input.targetOwnerId);
      await this.inventoryItemRepository.save(transferredItem);

      return mapInventoryItemDtoFromDomain(transferredItem);
    }

    const reducedSourceItem = item.reduceQuantity(quantity);
    const transferredItem = item.cloneForTransfer({
      id: randomUUID(),
      ownerType: targetOwnerType,
      ownerId: command.input.targetOwnerId,
      quantity,
      createdAt: new Date(),
    });

    await this.inventoryItemRepository.save(reducedSourceItem);
    await this.inventoryItemRepository.create(transferredItem);

    return mapInventoryItemDtoFromDomain(transferredItem);
  }
}
