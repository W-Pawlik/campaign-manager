import { randomUUID } from "node:crypto";
import type { ExternalReferenceRepository } from "@modules/external-references/application/ports/ExternalReferenceRepository";
import type {
  Open5eClient,
  Open5eResourceDetails,
} from "@modules/external-references/application/ports/Open5eClient";
import { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

const EXTERNAL_REFERENCE_TTL_DAYS = 30;

function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}

export class Open5eExternalReferenceResolver {
  public constructor(
    private readonly externalReferenceRepository: ExternalReferenceRepository,
    private readonly open5eClient: Open5eClient,
  ) {}

  public async getById(id: string): Promise<ExternalReference | null> {
    return this.externalReferenceRepository.findById(id);
  }

  public async getOrRefresh(
    resourceType: string,
    key: string,
  ): Promise<ExternalReference> {
    const existingReference =
      await this.externalReferenceRepository.findByProviderResourceTypeAndKey(
        ExternalProvider.open5e().value,
        ExternalResourceType.create(resourceType).value,
        key,
      );
    const now = new Date();

    if (existingReference !== null && !existingReference.isExpired(now)) {
      return existingReference;
    }

    const details = await this.open5eClient.getResource({
      resourceType,
      key,
    });

    return this.persistDetails(existingReference, details, now);
  }

  private async persistDetails(
    existingReference: ExternalReference | null,
    details: Open5eResourceDetails,
    cachedAt: Date,
  ): Promise<ExternalReference> {
    const expiresAt = addDays(cachedAt, EXTERNAL_REFERENCE_TTL_DAYS);

    if (existingReference === null) {
      const createdReference = ExternalReference.create({
        id: randomUUID(),
        provider: ExternalProvider.create(details.provider),
        resourceType: ExternalResourceType.create(details.resourceType),
        externalId: null,
        key: details.key,
        slug: details.slug ?? null,
        url: details.url ?? null,
        name: details.name,
        sourceDocumentKey: details.sourceDocumentKey ?? null,
        sourceDocumentName: details.sourceDocumentName ?? null,
        rawData: details.rawData,
        normalizedData: details.normalizedData ?? null,
        cachedAt,
        expiresAt,
        createdAt: cachedAt,
        updatedAt: cachedAt,
      });

      await this.externalReferenceRepository.create(createdReference);

      const persistedReference =
        await this.externalReferenceRepository.findByProviderResourceTypeAndKey(
          createdReference.provider.value,
          createdReference.resourceType.value,
          details.key,
        );

      return persistedReference ?? createdReference;
    }

    const refreshedReference = existingReference.refresh({
      externalId: null,
      key: details.key,
      slug: details.slug ?? null,
      url: details.url ?? null,
      name: details.name,
      sourceDocumentKey: details.sourceDocumentKey ?? null,
      sourceDocumentName: details.sourceDocumentName ?? null,
      rawData: details.rawData,
      normalizedData: details.normalizedData ?? null,
      cachedAt,
      expiresAt,
    });

    await this.externalReferenceRepository.save(refreshedReference);

    return refreshedReference;
  }
}
