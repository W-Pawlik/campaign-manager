import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { DeleteLocationCommand } from "@modules/locations/application/commands/DeleteLocationCommand";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { LocationHierarchyApplicationService } from "@modules/locations/application/services/LocationHierarchyApplicationService";

export class DeleteLocationHandler implements CommandHandler<DeleteLocationCommand, void> {
  public constructor(
    private readonly locationRepository: LocationRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly hierarchyService: LocationHierarchyApplicationService,
  ) {}

  public async execute(command: DeleteLocationCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.LOCATION_UPDATE,
    );
    const location = await this.locationRepository.findById(
      command.input.campaignId,
      command.input.locationId,
    );

    if (location === null) {
      throw new NotFoundError("Location not found");
    }

    await this.hierarchyService.ensureHasNoChildren(
      command.input.campaignId,
      command.input.locationId,
    );
    await this.locationRepository.save(location.softDelete(new Date()));
  }
}
