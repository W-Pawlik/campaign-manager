import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CurrentUserDTO } from "@modules/auth/application/dto/CurrentUserDTO";
import type { GetCurrentUserQuery } from "@modules/auth/application/queries/GetCurrentUserQuery";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";

export class GetCurrentUserHandler
  implements QueryHandler<GetCurrentUserQuery, CurrentUserDTO>
{
  public constructor(private readonly authRepository: AuthRepository) {}

  public async execute(query: GetCurrentUserQuery): Promise<CurrentUserDTO> {
    const userCredentials = await this.authRepository.findById(query.userId);

    if (userCredentials === null) {
      throw new NotFoundError("User not found");
    }

    return {
      id: userCredentials.id,
      email: userCredentials.email.value,
      username: userCredentials.username ?? `user_${userCredentials.id.slice(0, 8)}`,
      avatarUrl: userCredentials.avatarUrl ?? null,
      createdAt: userCredentials.createdAt.toISOString(),
    };
  }
}
