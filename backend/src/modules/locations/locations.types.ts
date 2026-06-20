export const LOCATIONS_TYPES = {
  LocationRepository: Symbol.for("locations.LocationRepository"),
  LocationReadRepository: Symbol.for("locations.LocationReadRepository"),
  LocationMapper: Symbol.for("locations.LocationMapper"),
  LocationHierarchyApplicationService: Symbol.for("locations.LocationHierarchyApplicationService"),
  CreateLocationHandler: Symbol.for("locations.CreateLocationHandler"),
  UpdateLocationHandler: Symbol.for("locations.UpdateLocationHandler"),
  DeleteLocationHandler: Symbol.for("locations.DeleteLocationHandler"),
  ListCampaignLocationsHandler: Symbol.for("locations.ListCampaignLocationsHandler"),
  GetLocationDetailsHandler: Symbol.for("locations.GetLocationDetailsHandler"),
  GetLocationTreeHandler: Symbol.for("locations.GetLocationTreeHandler"),
} as const;
