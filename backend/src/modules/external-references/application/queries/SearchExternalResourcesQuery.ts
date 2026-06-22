import type { Query } from "@core/application/cqrs/Query";
import type { ExternalSearchResultDTO } from "@modules/external-references/application/dto/ExternalSearchResultDTO";

export interface SearchExternalResourcesInput {
  provider: string;
  query: string;
  resourceTypes?: string[];
  limit?: number;
  page?: number;
}

export class SearchExternalResourcesQuery
  implements Query<ExternalSearchResultDTO[]>
{
  public constructor(public readonly input: SearchExternalResourcesInput) {}
}
