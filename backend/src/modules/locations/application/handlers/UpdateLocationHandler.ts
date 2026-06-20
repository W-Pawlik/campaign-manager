import { NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { omitUndefinedProperties } from "@api/mappers/request-mapper.utils";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { LocationHierarchyApplicationService } from "@modules/locations/application/services/LocationHierarchyApplicationService";
import { mapLocationViewFromDomain } from "@modules/locations/application/services/LocationViewDtoMapper";
import type { UpdateLocationCommand } from "@modules/locations/application/commands/UpdateLocationCommand";
import type { UpdateLocationParams } from "@modules/locations/domain/entities/Location";
import { LocationStatus } from "@modules/locations/domain/value-objects/LocationStatus";
import { LocationType } from "@modules/locations/domain/value-objects/LocationType";
import { LocationVisibility } from "@modules/locations/domain/value-objects/LocationVisibility";

export class UpdateLocationHandler implements CommandHandler<UpdateLocationCommand, LocationViewDTO> {
  public constructor(
    private readonly locationRepository: LocationRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly hierarchyService: LocationHierarchyApplicationService,
  ) {}

  public async execute(command: UpdateLocationCommand): Promise<LocationViewDTO> {
    const access = await this.accessService.requirePermission(
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

    const nextParentLocationId =
      command.input.parentLocationId === undefined
        ? location.parentLocationId
        : command.input.parentLocationId;

    await this.hierarchyService.ensureParentIsValid(
      command.input.campaignId,
      nextParentLocationId,
      command.input.locationId,
    );

    const updates = omitUndefinedProperties({
      parentLocationId: command.input.parentLocationId,
      name: command.input.name?.trim(),
      type:
        command.input.type === undefined ? undefined : LocationType.create(command.input.type),
      shortDescription: command.input.shortDescription,
      description: command.input.description,
      gmNotes: command.input.gmNotes,
      mapImageUrl: command.input.mapImageUrl,
      coordinates: command.input.coordinates,
      status:
        command.input.status === undefined
          ? undefined
          : LocationStatus.create(command.input.status),
      visibility:
        command.input.visibility === undefined
          ? undefined
          : LocationVisibility.create(command.input.visibility),
    }) as UpdateLocationParams;
    const updatedLocation = location.withUpdates(updates);

    await this.locationRepository.save(updatedLocation);

    return mapLocationViewFromDomain(updatedLocation, access.role, this.visibilityService);
  }
}
