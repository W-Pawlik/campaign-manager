import type { LocationGmViewDTO } from "@modules/locations/application/dto/LocationGmViewDTO";
import type { LocationPlayerViewDTO } from "@modules/locations/application/dto/LocationPlayerViewDTO";

export interface LocationPlayerTreeNodeDTO extends LocationPlayerViewDTO {
  children: LocationPlayerTreeNodeDTO[];
}

export interface LocationGmTreeNodeDTO extends LocationGmViewDTO {
  children: LocationGmTreeNodeDTO[];
}

export type LocationTreeNodeDTO = LocationPlayerTreeNodeDTO | LocationGmTreeNodeDTO;
