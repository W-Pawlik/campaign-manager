import { ForbiddenError, NotFoundError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { AuthTokensDTO } from "@modules/auth/application/dto/AuthTokensDTO";
import type { RefreshTokenCommand } from "@modules/auth/application/commands/RefreshTokenCommand";
import type { AuthRepository } from "@modules/auth/application/ports/AuthRepository";
import type { PasswordHasher } from "@modules/auth/application/ports/PasswordHasher";
import type { TokenService } from "@modules/auth/application/ports/TokenService";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import type { AuthTokensIssuer } from "@modules/auth/application/services/AuthTokensIssuer";

export class RefreshTokenHandler
  implements CommandHandler<RefreshTokenCommand, AuthTokensDTO>
{
  public constructor(
    private readonly authRepository: AuthRepository,
    private readonly userSessionRepository: UserSessionRepository,
    private readonly tokenService: TokenService,
    private readonly passwordHasher: PasswordHasher,
    private readonly authTokensIssuer: AuthTokensIssuer,
  ) {}

  public async execute(command: RefreshTokenCommand): Promise<AuthTokensDTO> {
    const payload = this.tokenService.verifyRefreshToken(command.refreshToken);
    const currentSession = await this.userSessionRepository.findById(payload.sessionId);

    if (currentSession === null) {
      throw new ForbiddenError("Refresh token is invalid");
    }

    if (currentSession.userId !== payload.userId) {
      throw new ForbiddenError("Refresh token is invalid");
    }

    if (!currentSession.canBeUsed(new Date())) {
      throw new ForbiddenError("Refresh token is expired or revoked");
    }

    const doesTokenMatch = await this.passwordHasher.verify(
      command.refreshToken,
      currentSession.tokenHash,
    );

    if (!doesTokenMatch) {
      throw new ForbiddenError("Refresh token is invalid");
    }

    await this.userSessionRepository.revokeById(currentSession.id, new Date());

    const userCredentials = await this.authRepository.findById(payload.userId);

    if (userCredentials === null) {
      throw new NotFoundError("User not found");
    }

    return await this.authTokensIssuer.issueForUser(userCredentials);
  }
}
