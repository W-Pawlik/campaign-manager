import type { QueryHandler } from "@core/application/cqrs/QueryHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CurrentUserProfileDTO } from "@modules/users/application/dto/CurrentUserProfileDTO";
import type { UserProfileRepository } from "@modules/users/application/ports/UserProfileRepository";
import type { UserRepository } from "@modules/users/application/ports/UserRepository";
import type { GetCurrentUserProfileQuery } from "@modules/users/application/queries/GetCurrentUserProfileQuery";
import { mapCurrentUserProfileDTO } from "@modules/users/application/services/CurrentUserProfileDtoMapper";

export class GetCurrentUserProfileHandler
  implements QueryHandler<GetCurrentUserProfileQuery, CurrentUserProfileDTO>
{
  public constructor(
    private readonly userRepository: UserRepository,
    private readonly userProfileRepository: UserProfileRepository,
  ) {}

  public async execute(query: GetCurrentUserProfileQuery): Promise<CurrentUserProfileDTO> {
    const user = await this.userRepository.findById(query.input.userId);

    if (user === null) {
      throw new NotFoundError("User not found");
    }

    user.ensureIsActive();

    const profile = await this.userProfileRepository.findByUserId(user.id);

    return mapCurrentUserProfileDTO(user, profile);
  }
}
