import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { MonsterCatalogPageDTO } from "@modules/monsters/application/dto/MonsterCatalogPageDTO";
import type { MonsterReadRepository } from "@modules/monsters/application/ports/MonsterReadRepository";
import type { ListPublishedMonstersQuery } from "@modules/monsters/application/queries/ListPublishedMonstersQuery";
import { mapMonsterCatalogPageFromDomain } from "@modules/monsters/application/services/MonsterDtoMapper";

export class ListPublishedMonstersHandler
  implements QueryHandler<ListPublishedMonstersQuery, MonsterCatalogPageDTO>
{
  public constructor(
    private readonly monsterReadRepository: MonsterReadRepository,
  ) {}

  public async execute(
    query: ListPublishedMonstersQuery,
  ): Promise<MonsterCatalogPageDTO> {
    const limit = query.input.limit ?? 20;
    const page = query.input.page ?? 1;

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new ValidationError("Catalog limit must be an integer between 1 and 50");
    }

    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("Catalog page must be a positive integer");
    }

    if (
      query.input.minCr !== undefined &&
      query.input.maxCr !== undefined &&
      query.input.minCr > query.input.maxCr
    ) {
      throw new ValidationError("minCr cannot be greater than maxCr");
    }

    const result = await this.monsterReadRepository.listPublishedMonsters({
      ...(query.input.search === undefined ? {} : { search: query.input.search }),
      ...(query.input.type === undefined ? {} : { type: query.input.type }),
      ...(query.input.minCr === undefined ? {} : { minCr: query.input.minCr }),
      ...(query.input.maxCr === undefined ? {} : { maxCr: query.input.maxCr }),
      limit,
      page,
    });

    return mapMonsterCatalogPageFromDomain(result);
  }
}
