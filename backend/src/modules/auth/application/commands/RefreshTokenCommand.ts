import type { Command } from "@core/application/cqrs/Command";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";

export class RefreshTokenCommand implements Command<AuthTokensDTO> {
  public constructor(public readonly refreshToken: string) {}
}
