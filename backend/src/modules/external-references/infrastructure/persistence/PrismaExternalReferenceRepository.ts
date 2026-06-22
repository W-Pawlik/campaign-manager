import type { PrismaClient } from "@prisma/client";
import type { ExternalReferenceRepository } from "@modules/external-references/application/ports/ExternalReferenceRepository";
import type { ExternalReference } from "@modules/external-references/domain/entities/ExternalReference";
import type {
  ExternalReferenceMapper,
  ExternalReferencePersistenceRecord,
} from "@modules/external-references/infrastructure/persistence/ExternalReferenceMapper";

interface ExternalReferenceDelegate {
  findFirst(args: unknown): Promise<ExternalReferencePersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaExternalReferenceRepository
  implements ExternalReferenceRepository
{
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: ExternalReferenceMapper,
  ) {}

  public async findById(id: string): Promise<ExternalReference | null> {
    const referenceClient = this.prismaClient as PrismaClient & {
      externalReference: ExternalReferenceDelegate;
    };
    const reference = await referenceClient.externalReference.findFirst({
      where: { id },
    });

    return reference === null ? null : this.mapper.toDomain(reference);
  }

  public async findByProviderResourceTypeAndKey(
    provider: string,
    resourceType: string,
    key: string,
  ): Promise<ExternalReference | null> {
    const referenceClient = this.prismaClient as PrismaClient & {
      externalReference: ExternalReferenceDelegate;
    };
    const reference = await referenceClient.externalReference.findFirst({
      where: {
        provider,
        resourceType,
        key,
      },
    });

    return reference === null ? null : this.mapper.toDomain(reference);
  }

  public async create(reference: ExternalReference): Promise<void> {
    const referenceClient = this.prismaClient as PrismaClient & {
      externalReference: ExternalReferenceDelegate;
    };
    await referenceClient.externalReference.create({
      data: this.mapper.toPersistenceCreate(reference),
    });
  }

  public async save(reference: ExternalReference): Promise<void> {
    const referenceClient = this.prismaClient as PrismaClient & {
      externalReference: ExternalReferenceDelegate;
    };
    await referenceClient.externalReference.update({
      where: { id: reference.id },
      data: this.mapper.toPersistenceUpdate(reference),
    });
  }
}
