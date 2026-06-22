import type { Query } from "@core/application/cqrs/Query";
import type { ExternalResourceDetailsDTO } from "@modules/external-references/application/dto/ExternalResourceDetailsDTO";

export interface GetExternalResourceDetailsInput {
  provider: string;
  resourceType: string;
  key: string;
}

export class GetExternalResourceDetailsQuery
  implements Query<ExternalResourceDetailsDTO>
{
  public constructor(public readonly input: GetExternalResourceDetailsInput) {}
}
