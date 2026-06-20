import type { PrismaClient } from "@prisma/client";
import type { Container } from "inversify";
import { CORE_TYPES } from "@core/di/core.types";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGNS_TYPES } from "@modules/campaigns/campaigns.types";
import { CreateLocationHandler } from "@modules/locations/application/handlers/CreateLocationHandler";
import { DeleteLocationHandler } from "@modules/locations/application/handlers/DeleteLocationHandler";
import { GetLocationDetailsHandler } from "@modules/locations/application/handlers/GetLocationDetailsHandler";
import { GetLocationTreeHandler } from "@modules/locations/application/handlers/GetLocationTreeHandler";
import { ListCampaignLocationsHandler } from "@modules/locations/application/handlers/ListCampaignLocationsHandler";
import { UpdateLocationHandler } from "@modules/locations/application/handlers/UpdateLocationHandler";
import type { LocationReadRepository } from "@modules/locations/application/ports/LocationReadRepository";
import type { LocationRepository } from "@modules/locations/application/ports/LocationRepository";
import { LocationHierarchyApplicationService } from "@modules/locations/application/services/LocationHierarchyApplicationService";
import { PrismaLocationReadRepository } from "@modules/locations/infrastructure/persistence/PrismaLocationReadRepository";
import { PrismaLocationRepository } from "@modules/locations/infrastructure/persistence/PrismaLocationRepository";
import { LocationMapper } from "@modules/locations/infrastructure/persistence/LocationMapper";
import { LOCATIONS_TYPES } from "@modules/locations/locations.types";

export function loadLocationsContainerModule(container: Container): void {
  container
    .bind<LocationMapper>(LOCATIONS_TYPES.LocationMapper)
    .toDynamicValue(() => new LocationMapper())
    .inSingletonScope();

  container
    .bind<LocationRepository>(LOCATIONS_TYPES.LocationRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<LocationMapper>(LOCATIONS_TYPES.LocationMapper);

      return new PrismaLocationRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<LocationReadRepository>(LOCATIONS_TYPES.LocationReadRepository)
    .toDynamicValue((context) => {
      const prismaClient = context.get<PrismaClient>(CORE_TYPES.PrismaClient);
      const mapper = context.get<LocationMapper>(LOCATIONS_TYPES.LocationMapper);

      return new PrismaLocationReadRepository(prismaClient, mapper);
    })
    .inSingletonScope();

  container
    .bind<LocationHierarchyApplicationService>(LOCATIONS_TYPES.LocationHierarchyApplicationService)
    .toDynamicValue((context) => {
      const locationReadRepository = context.get<LocationReadRepository>(
        LOCATIONS_TYPES.LocationReadRepository,
      );

      return new LocationHierarchyApplicationService(locationReadRepository);
    })
    .inSingletonScope();

  container
    .bind<CreateLocationHandler>(LOCATIONS_TYPES.CreateLocationHandler)
    .toDynamicValue((context) => {
      const locationRepository = context.get<LocationRepository>(LOCATIONS_TYPES.LocationRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const hierarchyService = context.get<LocationHierarchyApplicationService>(
        LOCATIONS_TYPES.LocationHierarchyApplicationService,
      );

      return new CreateLocationHandler(
        locationRepository,
        accessService,
        visibilityService,
        hierarchyService,
      );
    })
    .inTransientScope();

  container
    .bind<UpdateLocationHandler>(LOCATIONS_TYPES.UpdateLocationHandler)
    .toDynamicValue((context) => {
      const locationRepository = context.get<LocationRepository>(LOCATIONS_TYPES.LocationRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const hierarchyService = context.get<LocationHierarchyApplicationService>(
        LOCATIONS_TYPES.LocationHierarchyApplicationService,
      );

      return new UpdateLocationHandler(
        locationRepository,
        accessService,
        visibilityService,
        hierarchyService,
      );
    })
    .inTransientScope();

  container
    .bind<DeleteLocationHandler>(LOCATIONS_TYPES.DeleteLocationHandler)
    .toDynamicValue((context) => {
      const locationRepository = context.get<LocationRepository>(LOCATIONS_TYPES.LocationRepository);
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const hierarchyService = context.get<LocationHierarchyApplicationService>(
        LOCATIONS_TYPES.LocationHierarchyApplicationService,
      );

      return new DeleteLocationHandler(locationRepository, accessService, hierarchyService);
    })
    .inTransientScope();

  container
    .bind<ListCampaignLocationsHandler>(LOCATIONS_TYPES.ListCampaignLocationsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const locationReadRepository = context.get<LocationReadRepository>(
        LOCATIONS_TYPES.LocationReadRepository,
      );

      return new ListCampaignLocationsHandler(accessService, visibilityService, locationReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetLocationDetailsHandler>(LOCATIONS_TYPES.GetLocationDetailsHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const locationReadRepository = context.get<LocationReadRepository>(
        LOCATIONS_TYPES.LocationReadRepository,
      );

      return new GetLocationDetailsHandler(accessService, visibilityService, locationReadRepository);
    })
    .inTransientScope();

  container
    .bind<GetLocationTreeHandler>(LOCATIONS_TYPES.GetLocationTreeHandler)
    .toDynamicValue((context) => {
      const accessService = context.get<CampaignAccessApplicationService>(
        CAMPAIGNS_TYPES.CampaignAccessApplicationService,
      );
      const visibilityService = context.get<CampaignVisibilityApplicationService>(
        CAMPAIGNS_TYPES.CampaignVisibilityApplicationService,
      );
      const locationReadRepository = context.get<LocationReadRepository>(
        LOCATIONS_TYPES.LocationReadRepository,
      );

      return new GetLocationTreeHandler(accessService, visibilityService, locationReadRepository);
    })
    .inTransientScope();
}
