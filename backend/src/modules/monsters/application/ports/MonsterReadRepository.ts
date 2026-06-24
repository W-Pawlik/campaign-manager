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

export interface ListPublishedMonstersFilters {
  search?: string;
  type?: string;
  minCr?: number;
  maxCr?: number;
  limit: number;
  page: number;
}

export interface MonsterPageResult {
  items: Monster[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}

export interface MonsterReadRepository {
  listCampaignMonsters(filters: ListCampaignMonstersFilters): Promise<Monster[]>;
  listPublishedMonsters(filters: ListPublishedMonstersFilters): Promise<MonsterPageResult>;
  getDetails(monsterId: string): Promise<Monster | null>;
}
