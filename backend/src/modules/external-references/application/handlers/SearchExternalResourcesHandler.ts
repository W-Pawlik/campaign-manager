import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { ExternalSearchResultDTO } from "@modules/external-references/application/dto/ExternalSearchResultDTO";
import type { Open5eClient } from "@modules/external-references/application/ports/Open5eClient";
import type { SearchExternalResourcesQuery } from "@modules/external-references/application/queries/SearchExternalResourcesQuery";
import { mapOpen5eSearchResultToDto } from "@modules/external-references/application/services/ExternalReferenceDtoMapper";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

export class SearchExternalResourcesHandler
  implements QueryHandler<SearchExternalResourcesQuery, ExternalSearchResultDTO[]>
{
  public constructor(private readonly open5eClient: Open5eClient) {}

  public async execute(
    query: SearchExternalResourcesQuery,
  ): Promise<ExternalSearchResultDTO[]> {
    const normalizedProvider = ExternalProvider.create(query.input.provider);

    if (!normalizedProvider.isOpen5e()) {
      throw new ValidationError("Only OPEN5E provider is supported");
    }

    const normalizedQuery = query.input.query.trim();

    if (normalizedQuery.length < 2) {
      throw new ValidationError("Search query must be at least 2 characters long");
    }

    const normalizedLimit = query.input.limit ?? 20;
    const normalizedPage = query.input.page ?? 1;

    if (!Number.isInteger(normalizedLimit) || normalizedLimit < 1 || normalizedLimit > 50) {
      throw new ValidationError("Search limit must be an integer between 1 and 50");
    }

    if (!Number.isInteger(normalizedPage) || normalizedPage < 1) {
      throw new ValidationError("Search page must be a positive integer");
    }

    const normalizedResourceTypes =
      query.input.resourceTypes?.map((resourceType) =>
        ExternalResourceType.create(resourceType).value,
      );
    const results = await this.open5eClient.search({
      query: normalizedQuery,
      ...(normalizedResourceTypes === undefined
        ? {}
        : { resourceTypes: normalizedResourceTypes }),
      limit: normalizedLimit,
      page: normalizedPage,
    });

    return results.map(mapOpen5eSearchResultToDto);
  }
}
