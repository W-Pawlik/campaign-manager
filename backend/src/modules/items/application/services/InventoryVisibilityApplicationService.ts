import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { InventoryItem } from "@modules/items/domain/entities/InventoryItem";
import type { InventoryOwnerApplicationService } from "@modules/items/application/services/InventoryOwnerApplicationService";

export class InventoryVisibilityApplicationService {
  public constructor(
    private readonly campaignVisibilityService: CampaignVisibilityApplicationService,
    private readonly ownerService: InventoryOwnerApplicationService,
  ) {}

  public async canViewItem(
    item: InventoryItem,
    role: CampaignRole,
    actorUserId: string,
  ): Promise<boolean> {
    if (item.visibility.isPublic()) {
      return true;
    }

    if (item.visibility.isGmOnly()) {
      return this.campaignVisibilityService.canSeeSecretContent(role);
    }

    return this.ownerService.canViewOwner({
      campaignId: item.campaignId,
      ownerType: item.ownerType,
      ownerId: item.ownerId,
      actorUserId,
      actorRole: role,
    });
  }
}
