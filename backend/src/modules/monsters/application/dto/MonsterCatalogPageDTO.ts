import type { MonsterListItemDTO } from "@modules/monsters/application/dto/MonsterListItemDTO";

export interface MonsterCatalogPageDTO {
  items: MonsterListItemDTO[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
}
