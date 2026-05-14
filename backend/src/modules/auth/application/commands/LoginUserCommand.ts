import type { Command } from "@core/application/cqrs/Command";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";

export class LoginUserCommand implements Command<AuthTokensDTO> {
  public constructor(
    public readonly email: string,
    public readonly password: string,
  ) {}
}
