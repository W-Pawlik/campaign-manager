import type { ExternalResourceDetailsDTO } from "@modules/external-references/application/dto/ExternalResourceDetailsDTO";
import type { ExternalSearchResultDTO } from "@modules/external-references/application/dto/ExternalSearchResultDTO";
import type { Open5eCreatureCatalogPageDTO } from "@modules/external-references/application/dto/Open5eCreatureCatalogPageDTO";
import type { Open5eItemCatalogPageDTO } from "@modules/external-references/application/dto/Open5eItemCatalogPageDTO";
import type {
  Open5eCreatureListItem,
  Open5eItemListItem,
  Open5eListPage,
  Open5eSearchResult,
} from "@modules/external-references/application/ports/Open5eClient";
import type { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";

function isRecord(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object";
}

function getIllustrationUrlFromUnknown(value: unknown): string | null {
  if (typeof value === "string" && value.trim().length > 0) {
    return value;
  }

  return null;
}

function getIllustrationUrlFromReference(reference: ExternalReference): string | null {
  if (isRecord(reference.normalizedData)) {
    const normalizedIllustrationUrl = getIllustrationUrlFromUnknown(
      reference.normalizedData.illustrationUrl,
    );

    if (normalizedIllustrationUrl !== null) {
      return normalizedIllustrationUrl;
    }
  }

  if (isRecord(reference.rawData) && isRecord(reference.rawData.illustration)) {
    const fileUrl = getIllustrationUrlFromUnknown(reference.rawData.illustration.file_url);

    if (fileUrl !== null) {
      return fileUrl.startsWith("http") ? fileUrl : `https://open5e.com${fileUrl}`;
    }
  }

  return null;
}

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
  const illustrationUrl = getIllustrationUrlFromReference(reference);
  const normalizedData =
    reference.normalizedData !== null && isRecord(reference.normalizedData)
      ? {
          ...reference.normalizedData,
          illustrationUrl,
        }
      : reference.normalizedData;

  return {
    id: reference.id,
    provider: reference.provider.value,
    resourceType: reference.resourceType.value,
    key: reference.key,
    slug: reference.slug,
    url: reference.url,
    name: reference.name,
    illustrationUrl,
    sourceDocumentKey: reference.sourceDocumentKey,
    sourceDocumentName: reference.sourceDocumentName,
    ...(normalizedData === null ? {} : { normalizedData }),
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
      illustrationUrl: item.illustrationUrl ?? null,
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

export function mapOpen5eItemCatalogPageToDto(
  page: Open5eListPage<Open5eItemListItem>,
): Open5eItemCatalogPageDTO {
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
