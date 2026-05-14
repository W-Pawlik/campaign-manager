import type { Query } from "@core/application/cqrs/Query";
import type { CurrentUserDTO } from "@modules/auth/application/dto/CurrentUserDTO";

export class GetCurrentUserQuery implements Query<CurrentUserDTO> {
  public constructor(public readonly userId: string) {}
}
