import type { Query } from "@core/application/cqrs/Query";
import type { CurrentUserProfileDTO } from "@modules/users/application/dto/CurrentUserProfileDTO";

export interface GetCurrentUserProfileInput {
  userId: string;
}

export class GetCurrentUserProfileQuery implements Query<CurrentUserProfileDTO> {
  public constructor(public readonly input: GetCurrentUserProfileInput) {}
}
