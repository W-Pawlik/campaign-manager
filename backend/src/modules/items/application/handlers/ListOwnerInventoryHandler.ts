import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import type { ListOwnerInventoryQuery } from "@modules/items/application/queries/ListOwnerInventoryQuery";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";
import type { InventoryVisibilityApplicationService } from "@modules/items/application/services/InventoryVisibilityApplicationService";
import { InventoryOwnerType } from "@modules/items/domain/value-objects/InventoryOwnerType";

export class ListOwnerInventoryHandler implements QueryHandler<ListOwnerInventoryQuery, InventoryItemDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly inventoryItemReadRepository: InventoryItemReadRepository,
    private readonly ownerService: InventoryOwnerApplicationService,
    private readonly visibilityService: InventoryVisibilityApplicationService,
  ) {}

  public async execute(query: ListOwnerInventoryQuery): Promise<InventoryItemDTO[]> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const ownerType = InventoryOwnerType.create(query.input.ownerType);
    await this.ownerService.validateOwnerExists(query.input.campaignId, ownerType, query.input.ownerId);
    const items = await this.inventoryItemReadRepository.listOwnerInventory(
      query.input.campaignId,
      ownerType,
      query.input.ownerId,
    );
    const visibleItems: InventoryItemDTO[] = [];

    for (const item of items) {
      if (await this.visibilityService.canViewItem(item, access.role, query.input.actorUserId)) {
        visibleItems.push(mapInventoryItemDtoFromDomain(item));
      }
    }

    return visibleItems;
  }
}
