import type { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";

export interface ExternalReferenceRepository {
  findById(id: string): Promise<ExternalReference | null>;
  findByProviderResourceTypeAndKey(
    provider: string,
    resourceType: string,
    key: string,
  ): Promise<ExternalReference | null>;
  create(reference: ExternalReference): Promise<void>;
  save(reference: ExternalReference): Promise<void>;
}
