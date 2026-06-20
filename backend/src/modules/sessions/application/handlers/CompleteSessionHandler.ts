import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CompleteSessionCommand } from "@modules/sessions/application/commands/CompleteSessionCommand";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import { mapSessionDetailsFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";

export class CompleteSessionHandler implements CommandHandler<CompleteSessionCommand, SessionDetailsDTO> {
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly sessionReadRepository: GameSessionReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: CompleteSessionCommand): Promise<SessionDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.SESSION_COMPLETE,
    );
    const session = await this.sessionRepository.findById(command.input.campaignId, command.input.sessionId);

    if (session === null) {
      throw new NotFoundError("Session not found");
    }

    const completedSession = session.complete(new Date());
    await this.sessionRepository.save(completedSession);

    const details = await this.sessionReadRepository.getSessionDetails(command.input.campaignId, command.input.sessionId);

    return mapSessionDetailsFromDomain(
      details?.session ?? completedSession,
      details?.participants ?? [],
      access.role,
      this.visibilityService,
    );
  }
}
