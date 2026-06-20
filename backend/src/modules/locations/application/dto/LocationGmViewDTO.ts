import type { LocationPlayerViewDTO } from "@modules/locations/application/dto/LocationPlayerViewDTO";

export interface LocationGmViewDTO extends LocationPlayerViewDTO {
  gmNotes: string | null;
  createdById: string;
}
