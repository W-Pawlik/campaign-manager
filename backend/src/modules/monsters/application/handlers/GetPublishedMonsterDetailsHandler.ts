import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { MonsterDetailsDTO } from "@modules/monsters/application/dto/MonsterDetailsDTO";
import type { MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { GetPublishedMonsterDetailsQuery } from "@modules/monsters/application/queries/GetPublishedMonsterDetailsQuery";
import { mapMonsterDetailsFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";

export class GetPublishedMonsterDetailsHandler
  implements QueryHandler<GetPublishedMonsterDetailsQuery, MonsterDetailsDTO>
{
  public constructor(
    private readonly monsterReadRepository: MonsterReadRepository,
  ) {}

  public async execute(
    query: GetPublishedMonsterDetailsQuery,
  ): Promise<MonsterDetailsDTO> {
    const monster = await this.monsterReadRepository.getDetails(query.input.monsterId);

    if (
      monster === null ||
      !monster.isGlobal() ||
      !monster.visibility.isPublic() ||
      monster.deletedAt !== null
    ) {
      throw new NotFoundError("Published monster not found");
    }

    return mapMonsterDetailsFromDomain(monster);
  }
}
