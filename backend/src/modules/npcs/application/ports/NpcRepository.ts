import type { Npc } from "@modules/npcs/domain/entities/Npc";

export interface NpcRepository {
  findById(campaignId: string, npcId: string): Promise<Npc | null>;
  create(npc: Npc): Promise<void>;
  save(npc: Npc): Promise<void>;
}
