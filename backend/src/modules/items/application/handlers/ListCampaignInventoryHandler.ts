import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ListCampaignInventoryQuery } from "@modules/items/application/queries/ListCampaignInventoryQuery";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryVisibilityApplicationService } from "@modules/items/application/services/InventoryVisibilityApplicationService";

export class ListCampaignInventoryHandler implements QueryHandler<ListCampaignInventoryQuery, InventoryItemDTO[]> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly inventoryItemReadRepository: InventoryItemReadRepository,
    private readonly visibilityService: InventoryVisibilityApplicationService,
  ) {}

  public async execute(query: ListCampaignInventoryQuery): Promise<InventoryItemDTO[]> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const items = await this.inventoryItemReadRepository.listCampaignInventory(query.input.campaignId);
    const visibleItems: InventoryItemDTO[] = [];

    for (const item of items) {
      if (await this.visibilityService.canViewItem(item, access.role, query.input.actorUserId)) {
        visibleItems.push(mapInventoryItemDtoFromDomain(item));
      }
    }

    return visibleItems;
  }
}
