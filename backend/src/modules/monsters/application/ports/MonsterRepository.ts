import type { Monster } from "@modules/monsters/domain/entities/Monster";

export interface MonsterRepository {
  findById(monsterId: string): Promise<Monster | null>;
  findByCampaignIdAndSlug(campaignId: string | null, slug: string): Promise<Monster | null>;
  create(monster: Monster): Promise<void>;
  save(monster: Monster): Promise<void>;
}
