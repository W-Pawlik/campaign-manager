import type { Query } from "@core/application/cqrs/Query";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";

export interface GetPublishedMonsterDetailsInput {
  actorUserId: string;
  monsterId: string;
}

export class GetPublishedMonsterDetailsQuery
  implements Query<MonsterDetailsDTO>
{
  public constructor(public readonly input: GetPublishedMonsterDetailsInput) {}
}
