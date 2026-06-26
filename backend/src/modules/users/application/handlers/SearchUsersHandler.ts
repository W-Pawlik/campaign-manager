import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import type { UserLookupItemDTO } from "@modules/users/application/dto/UserLookupItemDTO";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import type { SearchUsersQuery } from "@modules/users/application/queries/SearchUsersQuery";

export class SearchUsersHandler implements QueryHandler<SearchUsersQuery, UserLookupItemDTO[]> {
  public constructor(private readonly userRepository: UserRepository) {}

  public async execute(query: SearchUsersQuery): Promise<UserLookupItemDTO[]> {
    const users = this.userRepository.search
      ? await this.userRepository.search(query.input.query, query.input.limit)
      : [];

    return users.map((user) => ({
      id: user.id,
      username: user.username.value,
      avatarUrl: user.avatarUrl,
    }));
  }
}
