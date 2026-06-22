import { ValidationError } from "@core/application/errors/AppError";
import type { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import type { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

export interface ExternalReferenceProps {
  id: string;
  provider: ExternalProvider;
  resourceType: ExternalResourceType;
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

export class ExternalReference {
  public readonly id: string;
  public readonly provider: ExternalProvider;
  public readonly resourceType: ExternalResourceType;
  public readonly externalId: string | null;
  public readonly key: string | null;
  public readonly slug: string | null;
  public readonly url: string | null;
  public readonly name: string;
  public readonly sourceDocumentKey: string | null;
  public readonly sourceDocumentName: string | null;
  public readonly rawData: unknown;
  public readonly normalizedData: unknown | null;
  public readonly cachedAt: Date;
  public readonly expiresAt: Date | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: ExternalReferenceProps) {
    this.id = props.id;
    this.provider = props.provider;
    this.resourceType = props.resourceType;
    this.externalId = props.externalId;
    this.key = props.key;
    this.slug = props.slug;
    this.url = props.url;
    this.name = props.name;
    this.sourceDocumentKey = props.sourceDocumentKey;
    this.sourceDocumentName = props.sourceDocumentName;
    this.rawData = props.rawData;
    this.normalizedData = props.normalizedData;
    this.cachedAt = props.cachedAt;
    this.expiresAt = props.expiresAt;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: ExternalReferenceProps): ExternalReference {
    ExternalReference.validate(props);

    return new ExternalReference(props);
  }

  public isExpired(referenceDate: Date): boolean {
    return this.expiresAt !== null && this.expiresAt.getTime() <= referenceDate.getTime();
  }

  public refresh(params: {
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
  }): ExternalReference {
    return ExternalReference.create({
      ...this.toProps(),
      externalId: params.externalId,
      key: params.key,
      slug: params.slug,
      url: params.url,
      name: params.name,
      sourceDocumentKey: params.sourceDocumentKey,
      sourceDocumentName: params.sourceDocumentName,
      rawData: params.rawData,
      normalizedData: params.normalizedData,
      cachedAt: params.cachedAt,
      expiresAt: params.expiresAt,
      updatedAt: params.cachedAt,
    });
  }

  private toProps(): ExternalReferenceProps {
    return {
      id: this.id,
      provider: this.provider,
      resourceType: this.resourceType,
      externalId: this.externalId,
      key: this.key,
      slug: this.slug,
      url: this.url,
      name: this.name,
      sourceDocumentKey: this.sourceDocumentKey,
      sourceDocumentName: this.sourceDocumentName,
      rawData: this.rawData,
      normalizedData: this.normalizedData,
      cachedAt: this.cachedAt,
      expiresAt: this.expiresAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  private static validate(props: ExternalReferenceProps): void {
    const trimmedName = props.name.trim();

    if (trimmedName.length < 1 || trimmedName.length > 255) {
      throw new ValidationError(
        "External reference name must be between 1 and 255 characters",
      );
    }
  }
}
