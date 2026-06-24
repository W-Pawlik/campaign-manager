import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { Open5eCreatureCatalogPageDTO } from "@modules/external-references/application/dto/Open5eCreatureCatalogPageDTO";
import type { Open5eClient } from "@modules/external-references/application/ports/Open5eClient";
import type { ListOpen5eCreatureCatalogQuery } from "@modules/external-references/application/queries/ListOpen5eCreatureCatalogQuery";
import { mapOpen5eCreatureCatalogPageToDto } from "@modules/external-references/application/services/ExternalReferenceDtoMapper";

const ALLOWED_OPEN5E_CREATURE_ORDERING = new Set([
  "name",
  "-name",
  "challenge_rating",
  "-challenge_rating",
]);

export class ListOpen5eCreatureCatalogHandler
  implements
    QueryHandler<ListOpen5eCreatureCatalogQuery, Open5eCreatureCatalogPageDTO>
{
  public constructor(private readonly open5eClient: Open5eClient) {}

  public async execute(
    query: ListOpen5eCreatureCatalogQuery,
  ): Promise<Open5eCreatureCatalogPageDTO> {
    const normalizedLimit = query.input.limit ?? 20;
    const normalizedPage = query.input.page ?? 1;
    const normalizedOrdering = query.input.ordering?.trim();
    const normalizedSearch = query.input.search?.trim();
    const normalizedType = query.input.type?.trim();
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
      !ALLOWED_OPEN5E_CREATURE_ORDERING.has(normalizedOrdering)
    ) {
      throw new ValidationError("Unsupported Open5e creature ordering");
    }

    if (
      query.input.minCr !== undefined &&
      query.input.maxCr !== undefined &&
      query.input.minCr > query.input.maxCr
    ) {
      throw new ValidationError("minCr cannot be greater than maxCr");
    }

    const result = await this.open5eClient.listCreatures({
      ...(normalizedSearch === undefined || normalizedSearch.length === 0
        ? {}
        : { search: normalizedSearch }),
      ...(normalizedType === undefined || normalizedType.length === 0
        ? {}
        : { type: normalizedType }),
      ...(normalizedDocumentKey === undefined || normalizedDocumentKey.length === 0
        ? {}
        : { documentKey: normalizedDocumentKey }),
      ...(query.input.minCr === undefined ? {} : { minChallengeRating: query.input.minCr }),
      ...(query.input.maxCr === undefined ? {} : { maxChallengeRating: query.input.maxCr }),
      ...(normalizedOrdering === undefined || normalizedOrdering.length === 0
        ? {}
        : { ordering: normalizedOrdering }),
      limit: normalizedLimit,
      page: normalizedPage,
    });

    return mapOpen5eCreatureCatalogPageToDto(result);
  }
}
