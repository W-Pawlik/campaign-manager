import type { LocationGmViewDTO } from "@modules/locations/application/dto/LocationGmViewDTO";
import type { LocationPlayerViewDTO } from "@modules/locations/application/dto/LocationPlayerViewDTO";

export type LocationViewDTO = LocationPlayerViewDTO | LocationGmViewDTO;
