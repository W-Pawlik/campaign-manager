import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { GetInventoryItemDetailsQuery } from "@modules/items/application/queries/GetInventoryItemDetailsQuery";
import type { InventoryItemDTO } from "@modules/items/application/dto/InventoryItemDTO";
import type { InventoryItemReadRepository } from "@modules/items/application/ports/InventoryItemReadRepository";
import { mapInventoryItemDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";
import type { InventoryVisibilityApplicationService } from "@modules/items/application/services/InventoryVisibilityApplicationService";

export class GetInventoryItemDetailsHandler implements QueryHandler<GetInventoryItemDetailsQuery, InventoryItemDTO> {
  public constructor(
    private readonly accessService: CampaignAccessApplicationService,
    private readonly inventoryItemReadRepository: InventoryItemReadRepository,
    private readonly visibilityService: InventoryVisibilityApplicationService,
  ) {}

  public async execute(query: GetInventoryItemDetailsQuery): Promise<InventoryItemDTO> {
    const access = await this.accessService.requireMembership(query.input.campaignId, query.input.actorUserId);
    const item = await this.inventoryItemReadRepository.getInventoryItemDetails(query.input.campaignId, query.input.itemId);

    if (item === null || !(await this.visibilityService.canViewItem(item, access.role, query.input.actorUserId))) {
      throw new NotFoundError("Inventory item not found");
    }

    return mapInventoryItemDtoFromDomain(item);
  }
}
