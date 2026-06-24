import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { ItemTemplateDTO } from "@modules/items/application/dto/ItemTemplateDTO";
import type { ItemTemplateRepository } from "@modules/items/application/ports/ItemTemplateRepository";
import type { GetPublishedItemTemplateDetailsQuery } from "@modules/items/application/queries/GetPublishedItemTemplateDetailsQuery";
import { mapItemTemplateDtoFromDomain } from "@modules/items/application/services/ItemDtoMapper";

export class GetPublishedItemTemplateDetailsHandler
  implements QueryHandler<GetPublishedItemTemplateDetailsQuery, ItemTemplateDTO>
{
  public constructor(private readonly itemTemplateRepository: ItemTemplateRepository) {}

  public async execute(query: GetPublishedItemTemplateDetailsQuery): Promise<ItemTemplateDTO> {
    const template = await this.itemTemplateRepository.findById(query.input.itemTemplateId);

    if (template === null) {
      throw new NotFoundError("Published item not found");
    }

    return mapItemTemplateDtoFromDomain(template);
  }
}
