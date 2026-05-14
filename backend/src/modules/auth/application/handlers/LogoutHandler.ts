import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { LogoutCommand } from "@modules/auth/application/commands/LogoutCommand";
import type { TokenService } from "@modules/auth/application/ports/TokenService";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";

export class LogoutHandler implements CommandHandler<LogoutCommand, void> {
  public constructor(
    private readonly userSessionRepository: UserSessionRepository,
    private readonly tokenService: TokenService,
  ) {}

  public async execute(command: LogoutCommand): Promise<void> {
    const payload = this.tokenService.verifyRefreshToken(command.refreshToken);

    await this.userSessionRepository.revokeById(payload.sessionId, new Date());
  }
}
