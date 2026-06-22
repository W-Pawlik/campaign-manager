import type { Query } from "@core/application/cqrs/Query";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface GetMonsterDetailsInput {
  campaignId: string;
  monsterId: string;
  actorUserId: string;
}

export class GetMonsterDetailsQuery implements Query<MonsterDetailsDTO> {
  public constructor(public readonly input: GetMonsterDetailsInput) {}
}
