import type { Npc } from "@modules/npcs/domain/entities/Npc";

export interface NpcReadRepository {
  listCampaignNpcs(campaignId: string): Promise<Npc[]>;
  getNpcDetails(campaignId: string, npcId: string): Promise<Npc | null>;
}
