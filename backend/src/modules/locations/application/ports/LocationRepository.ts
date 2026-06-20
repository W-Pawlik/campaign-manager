import type { Location } from "@modules/locations/domain/entities/Location";

export interface LocationRepository {
  findById(campaignId: string, locationId: string): Promise<Location | null>;
  create(location: Location): Promise<void>;
  save(location: Location): Promise<void>;
}
