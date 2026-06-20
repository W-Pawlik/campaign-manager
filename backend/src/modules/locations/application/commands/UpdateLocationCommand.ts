import type { Command } from "@core/application/cqrs/Command";
import type { LocationViewDTO } from "@modules/locations/application/dto/LocationViewDTO";

export interface UpdateLocationInput {
  campaignId: string;
  locationId: string;
  actorUserId: string;
  parentLocationId?: string | null;
  name?: string;
  type?: string;
  shortDescription?: string | null;
  description?: string | null;
  gmNotes?: string | null;
  mapImageUrl?: string | null;
  coordinates?: unknown | null;
  status?: string;
  visibility?: string;
}

export class UpdateLocationCommand implements Command<LocationViewDTO> {
  public constructor(public readonly input: UpdateLocationInput) {}
}
