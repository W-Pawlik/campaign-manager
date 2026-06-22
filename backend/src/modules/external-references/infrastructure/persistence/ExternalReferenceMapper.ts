import { Prisma } from "@prisma/client";
import { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

export interface ExternalReferencePersistenceRecord {
  id: string;
  provider: string;
  resourceType: string;
  externalId: string | null;
  key: string | null;
  slug: string | null;
  url: string | null;
  name: string;
  sourceDocumentKey: string | null;
  sourceDocumentName: string | null;
  rawData: unknown;
  normalizedData: unknown | null;
  cachedAt: Date;
  expiresAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class ExternalReferenceMapper {
  public toDomain(
    record: ExternalReferencePersistenceRecord,
  ): ExternalReference {
    return ExternalReference.create({
      id: record.id,
      provider: ExternalProvider.create(record.provider),
      resourceType: ExternalResourceType.create(record.resourceType),
      externalId: record.externalId,
      key: record.key,
      slug: record.slug,
      url: record.url,
      name: record.name,
      sourceDocumentKey: record.sourceDocumentKey,
      sourceDocumentName: record.sourceDocumentName,
      rawData: record.rawData,
      normalizedData: record.normalizedData,
      cachedAt: record.cachedAt,
      expiresAt: record.expiresAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public toPersistenceCreate(
    reference: ExternalReference,
  ): Record<string, unknown> {
    return {
      id: reference.id,
      provider: reference.provider.value,
      resourceType: reference.resourceType.value,
      externalId: reference.externalId,
      key: reference.key,
      slug: reference.slug,
      url: reference.url,
      name: reference.name,
      sourceDocumentKey: reference.sourceDocumentKey,
      sourceDocumentName: reference.sourceDocumentName,
      rawData: this.toJsonValue(reference.rawData),
      normalizedData: this.toNullableJsonValue(reference.normalizedData),
      cachedAt: reference.cachedAt,
      expiresAt: reference.expiresAt,
      createdAt: reference.createdAt,
      updatedAt: reference.updatedAt,
    };
  }

  public toPersistenceUpdate(
    reference: ExternalReference,
  ): Record<string, unknown> {
    return this.toPersistenceCreate(reference);
  }

  private toJsonValue(value: unknown): Prisma.InputJsonValue {
    return value as Prisma.InputJsonValue;
  }

  private toNullableJsonValue(
    value: unknown | null,
  ): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
    return value === null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
  }
}
