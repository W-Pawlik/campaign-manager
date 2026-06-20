import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CancelSessionCommand } from "@modules/sessions/application/commands/CancelSessionCommand";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";

export class CancelSessionHandler implements CommandHandler<CancelSessionCommand, void> {
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: CancelSessionCommand): Promise<void> {
    await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.SESSION_UPDATE,
    );
    const session = await this.sessionRepository.findById(command.input.campaignId, command.input.sessionId);

    if (session === null) {
      throw new NotFoundError("Session not found");
    }

    await this.sessionRepository.save(session.cancel(new Date()));
  }
}
