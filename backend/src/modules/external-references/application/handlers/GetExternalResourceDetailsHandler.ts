import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { ValidationError } from "@core/application/errors/AppError";
import type { ExternalResourceDetailsDTO } from "@modules/external-references/application/dto/ExternalResourceDetailsDTO";
import type { GetExternalResourceDetailsQuery } from "@modules/external-references/application/queries/GetExternalResourceDetailsQuery";
import { mapExternalReferenceToDetailsDto } from "@modules/external-references/application/services/ExternalReferenceDtoMapper";
import type { Open5eExternalReferenceResolver } from "@modules/external-references/application/services/Open5eExternalReferenceResolver";
import { ExternalProvider } from "@modules/external-references/domain/value-objects/ExternalProvider";
import { ExternalResourceType } from "@modules/external-references/domain/value-objects/ExternalResourceType";

export class GetExternalResourceDetailsHandler
  implements QueryHandler<GetExternalResourceDetailsQuery, ExternalResourceDetailsDTO>
{
  public constructor(
    private readonly open5eExternalReferenceResolver: Open5eExternalReferenceResolver,
  ) {}

  public async execute(
    query: GetExternalResourceDetailsQuery,
  ): Promise<ExternalResourceDetailsDTO> {
    const normalizedProvider = ExternalProvider.create(query.input.provider);

    if (!normalizedProvider.isOpen5e()) {
      throw new ValidationError("Only OPEN5E provider is supported");
    }

    const normalizedKey = query.input.key.trim();

    if (normalizedKey.length === 0) {
      throw new ValidationError("External resource key is required");
    }

    const normalizedResourceType = ExternalResourceType.create(
      query.input.resourceType,
    );
    const reference = await this.open5eExternalReferenceResolver.getOrRefresh(
      normalizedResourceType.value,
      normalizedKey,
    );

    return mapExternalReferenceToDetailsDto(reference);
  }
}
