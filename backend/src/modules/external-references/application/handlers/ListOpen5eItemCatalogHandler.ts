import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { Open5eItemCatalogPageDTO } from "@modules/external-references/application/dto/Open5eItemCatalogPageDTO";
import type { Open5eClient } from "@modules/external-references/application/ports/Open5eClient";
import type { ListOpen5eItemCatalogQuery } from "@modules/external-references/application/queries/ListOpen5eItemCatalogQuery";
import { mapOpen5eItemCatalogPageToDto } from "@modules/external-references/application/services/ExternalReferenceDtoMapper";

const ALLOWED_OPEN5E_ITEM_ORDERING = new Set(["name", "-name"]);

export class ListOpen5eItemCatalogHandler
  implements QueryHandler<ListOpen5eItemCatalogQuery, Open5eItemCatalogPageDTO>
{
  public constructor(private readonly open5eClient: Open5eClient) {}

  public async execute(query: ListOpen5eItemCatalogQuery): Promise<Open5eItemCatalogPageDTO> {
    const normalizedLimit = query.input.limit ?? 20;
    const normalizedPage = query.input.page ?? 1;
    const normalizedOrdering = query.input.ordering?.trim();
    const normalizedSearch = query.input.search?.trim();
    const normalizedDocumentKey = query.input.documentKey?.trim();

    if (!Number.isInteger(normalizedLimit) || normalizedLimit < 1 || normalizedLimit > 50) {
      throw new ValidationError("Catalog limit must be an integer between 1 and 50");
    }

    if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
      throw new ValidationError("Catalog page must be a positive integer");
    }

    if (
      normalizedOrdering !== undefined &&
      normalizedOrdering.length > 0 &&
      !ALLOWED_OPEN5E_ITEM_ORDERING.has(normalizedOrdering)
    ) {
      throw new ValidationError("Unsupported Open5e item ordering");
    }

    const result = await this.open5eClient.listItems({
      resourceType: query.input.resourceType,
      ...(normalizedSearch === undefined || normalizedSearch.length === 0
        ? {}
        : { search: normalizedSearch }),
      ...(normalizedDocumentKey === undefined || normalizedDocumentKey.length === 0
        ? {}
        : { documentKey: normalizedDocumentKey }),
      ...(normalizedOrdering === undefined || normalizedOrdering.length === 0
        ? {}
        : { ordering: normalizedOrdering }),
      limit: normalizedLimit,
      page: normalizedPage,
    });

    return mapOpen5eItemCatalogPageToDto(result);
  }
}
