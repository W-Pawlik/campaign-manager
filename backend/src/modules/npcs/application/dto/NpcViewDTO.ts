import type { NpcGmViewDTO } from "@modules/npcs/application/dto/NpcGmViewDTO";
import type { NpcPlayerViewDTO } from "@modules/npcs/application/dto/NpcPlayerViewDTO";

export type NpcViewDTO = NpcPlayerViewDTO | NpcGmViewDTO;
