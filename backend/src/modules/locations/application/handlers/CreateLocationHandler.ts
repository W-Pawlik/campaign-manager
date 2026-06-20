import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateLocationCommand } from "@modules/locations/application/commands/CreateLocationCommand";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import type { LocationHierarchyApplicationService } from "@modules/locations/application/services/LocationHierarchyApplicationService";
import { mapLocationViewFromDomain } from "@modules/locations/application/services/LocationViewDtoMapper";
import { Location } from "@modules/locations/domain/entities/Location";
import { LocationStatus } from "@modules/locations/domain/value-objects/LocationStatus";
import { LocationType } from "@modules/locations/domain/value-objects/LocationType";
import { LocationVisibility } from "@modules/locations/domain/value-objects/LocationVisibility";

export class CreateLocationHandler implements CommandHandler<CreateLocationCommand, LocationViewDTO> {
  public constructor(
    private readonly locationRepository: LocationRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
    private readonly hierarchyService: LocationHierarchyApplicationService,
  ) {}

  public async execute(command: CreateLocationCommand): Promise<LocationViewDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.LOCATION_UPDATE,
    );
    const parentLocationId = command.input.parentLocationId ?? null;

    await this.hierarchyService.ensureParentIsValid(command.input.campaignId, parentLocationId);

    const createdAt = new Date();
    const location = Location.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      parentLocationId,
      name: command.input.name.trim(),
      type:
        command.input.type === undefined
          ? LocationType.other()
          : LocationType.create(command.input.type),
      shortDescription: command.input.shortDescription ?? null,
      description: command.input.description ?? null,
      gmNotes: command.input.gmNotes ?? null,
      mapImageUrl: command.input.mapImageUrl ?? null,
      coordinates: command.input.coordinates ?? null,
      status:
        command.input.status === undefined
          ? LocationStatus.active()
          : LocationStatus.create(command.input.status),
      visibility:
        command.input.visibility === undefined
          ? LocationVisibility.discovered()
          : LocationVisibility.create(command.input.visibility),
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      deletedAt: null,
    });

    await this.locationRepository.create(location);

    return mapLocationViewFromDomain(location, access.role, this.visibilityService);
  }
}
