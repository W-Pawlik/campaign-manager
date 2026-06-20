import type { Location } from "@modules/locations/domain/entities/Location";

export interface LocationReadRepository {
  listCampaignLocations(campaignId: string): Promise<Location[]>;
  getLocationDetails(campaignId: string, locationId: string): Promise<Location | null>;
}
