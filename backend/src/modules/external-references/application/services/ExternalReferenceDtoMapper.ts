import type { ExternalResourceDetailsDTO } from "@modules/external-references/application/dto/ExternalResourceDetailsDTO";
import type { ExternalSearchResultDTO } from "@modules/external-references/application/dto/ExternalSearchResultDTO";
import type { Open5eCreatureCatalogPageDTO } from "@modules/external-references/application/dto/Open5eCreatureCatalogPageDTO";
import type {
  Open5eCreatureListItem,
  Open5eListPage,
  Open5eSearchResult,
} from "@modules/external-references/application/ports/Open5eClient";
import type { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";

export function mapOpen5eSearchResultToDto(
  result: Open5eSearchResult,
): ExternalSearchResultDTO {
  return {
    provider: result.provider,
    resourceType: result.resourceType,
    key: result.key,
    name: result.name,
    summary: result.summary ?? null,
    highlighted: result.highlighted ?? null,
    sourceDocumentKey: result.sourceDocumentKey ?? null,
    sourceDocumentName: result.sourceDocumentName ?? null,
    ...(result.metadata === undefined ? {} : { metadata: result.metadata }),
  };
}

export function mapExternalReferenceToDetailsDto(
  reference: ExternalReference,
): ExternalResourceDetailsDTO {
  return {
    id: reference.id,
    provider: reference.provider.value,
    resourceType: reference.resourceType.value,
    key: reference.key,
    slug: reference.slug,
    url: reference.url,
    name: reference.name,
    sourceDocumentKey: reference.sourceDocumentKey,
    sourceDocumentName: reference.sourceDocumentName,
    ...(reference.normalizedData === null
      ? {}
      : { normalizedData: reference.normalizedData }),
    cachedAt: reference.cachedAt.toISOString(),
    expiresAt: reference.expiresAt?.toISOString() ?? null,
  };
}

export function mapOpen5eCreatureCatalogPageToDto(
  page: Open5eListPage<Open5eCreatureListItem>,
): Open5eCreatureCatalogPageDTO {
  return {
    items: page.items.map((item) => ({
      provider: item.provider,
      resourceType: item.resourceType,
      key: item.key,
      name: item.name,
      sourceDocumentKey: item.sourceDocumentKey ?? null,
      sourceDocumentName: item.sourceDocumentName ?? null,
      ...(item.metadata === undefined ? {} : { metadata: item.metadata }),
    })),
    limit: page.limit,
    page: page.page,
    total: page.total,
    hasNext: page.hasNext,
  };
}
