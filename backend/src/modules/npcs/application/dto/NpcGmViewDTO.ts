import type { NpcPlayerViewDTO } from "@modules/npcs/application/dto/NpcPlayerViewDTO";

export interface NpcGmViewDTO extends NpcPlayerViewDTO {
  gmNotes: string | null;
  motivations: string | null;
  secrets: string | null;
  createdById: string;
}
