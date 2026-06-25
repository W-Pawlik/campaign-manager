import type { Query } from "@core/application/cqrs/Query";
import type { UserLookupItemDTO } from "@modules/users/application/dto/UserLookupItemDTO";

export interface SearchUsersQueryInput {
  limit: number;
  query: string;
}

export class SearchUsersQuery implements Query<UserLookupItemDTO[]> {
  public constructor(public readonly input: SearchUsersQueryInput) {}
}
