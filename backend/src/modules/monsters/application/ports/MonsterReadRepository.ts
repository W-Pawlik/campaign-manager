import type { Monster } from "@modules/monsters/domain/entities/Monster";

export interface ListCampaignMonstersFilters {
  campaignId: string;
  includeGlobal?: boolean;
  search?: string;
  type?: string;
  minCr?: number;
  maxCr?: number;
  status?: string;
}

export interface MonsterReadRepository {
  listCampaignMonsters(filters: ListCampaignMonstersFilters): Promise<Monster[]>;
  getDetails(monsterId: string): Promise<Monster | null>;
}
