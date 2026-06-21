import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { DeleteInventoryItemCommand } from "@modules/items/application/commands/DeleteInventoryItemCommand";
import type { InventoryItemRepository } from "@modules/items/application/ports/InventoryItemRepository";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";

export class DeleteInventoryItemHandler implements CommandHandler<DeleteInventoryItemCommand, void> {
  public constructor(
    private readonly inventoryItemRepository: InventoryItemRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
  ) {}

  public async execute(command: DeleteInventoryItemCommand): Promise<void> {
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

    await this.inventoryItemRepository.save(item.softDelete(new Date()));
  }
}
