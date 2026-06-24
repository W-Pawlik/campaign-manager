import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { ItemTemplateCatalogPageDTO } from "@modules/items/application/dto/ItemTemplateCatalogPageDTO";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import type { ListPublishedItemTemplatesQuery } from "@modules/items/application/queries/ListPublishedItemTemplatesQuery";
import { mapItemTemplateDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";

export class ListPublishedItemTemplatesHandler
  implements QueryHandler<ListPublishedItemTemplatesQuery, ItemTemplateCatalogPageDTO>
{
  public constructor(private readonly itemTemplateRepository: ItemTemplateRepository) {}

  public async execute(query: ListPublishedItemTemplatesQuery): Promise<ItemTemplateCatalogPageDTO> {
    const limit = query.input.limit ?? 20;
    const page = query.input.page ?? 1;

    if (!Number.isInteger(limit) || limit < 1 || limit > 50) {
      throw new ValidationError("Catalog limit must be an integer between 1 and 50");
    }

    if (!Number.isInteger(page) || page < 1) {
      throw new ValidationError("Catalog page must be a positive integer");
    }

    const result = await this.itemTemplateRepository.listPublished({
      ...(query.input.search === undefined ? {} : { search: query.input.search }),
      ...(query.input.type === undefined ? {} : { type: query.input.type }),
      ...(query.input.rarity === undefined ? {} : { rarity: query.input.rarity }),
      ...(query.input.isMagical === undefined ? {} : { isMagical: query.input.isMagical }),
      limit,
      page,
    });

    return {
      items: result.items.map((item) => mapItemTemplateDtoFromDomain(item)),
      limit: result.limit,
      page: result.page,
      total: result.total,
      hasNext: result.hasNext,
    };
  }
}
