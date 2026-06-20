import { NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { UpdateSessionCommand } from "@modules/sessions/application/commands/UpdateSessionCommand";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import { mapSessionDetailsFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";
import { SessionLocationType } from "@modules/sessions/domain/value-objects/SessionLocationType";
import { SESSION_STATUS, SessionStatus } from "@modules/sessions/domain/value-objects/SessionStatus";

export class UpdateSessionHandler implements CommandHandler<UpdateSessionCommand, SessionDetailsDTO> {
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly sessionReadRepository: GameSessionReadRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: UpdateSessionCommand): Promise<SessionDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.SESSION_UPDATE,
    );
    const current = await this.sessionRepository.findById(command.input.campaignId, command.input.sessionId);

    if (current === null) {
      throw new NotFoundError("Session not found");
    }

    const nextStatus =
      command.input.status === undefined ? undefined : SessionStatus.create(command.input.status);

    if (
      nextStatus !== undefined &&
      (nextStatus.value === SESSION_STATUS.CANCELLED || nextStatus.value === SESSION_STATUS.COMPLETED)
    ) {
      throw new ValidationError("Use dedicated commands to cancel or complete a session");
    }

    const updated = current.withUpdates({
      ...(command.input.title === undefined ? {} : { title: command.input.title.trim() }),
      ...(command.input.description === undefined ? {} : { description: command.input.description }),
      ...(nextStatus === undefined ? {} : { status: nextStatus }),
      ...(command.input.scheduledStartAt === undefined
        ? {}
        : { scheduledStartAt: command.input.scheduledStartAt }),
      ...(command.input.scheduledEndAt === undefined ? {} : { scheduledEndAt: command.input.scheduledEndAt }),
      ...(command.input.actualStartAt === undefined ? {} : { actualStartAt: command.input.actualStartAt }),
      ...(command.input.actualEndAt === undefined ? {} : { actualEndAt: command.input.actualEndAt }),
      ...(command.input.locationType === undefined
        ? {}
        : {
            locationType:
              command.input.locationType === null
                ? null
                : SessionLocationType.create(command.input.locationType),
          }),
      ...(command.input.locationDetails === undefined ? {} : { locationDetails: command.input.locationDetails }),
      ...(command.input.meetingUrl === undefined ? {} : { meetingUrl: command.input.meetingUrl }),
      ...(command.input.summaryPublic === undefined ? {} : { summaryPublic: command.input.summaryPublic }),
      ...(command.input.summaryPrivate === undefined ? {} : { summaryPrivate: command.input.summaryPrivate }),
    });

    await this.sessionRepository.save(updated);

    const details = await this.sessionReadRepository.getSessionDetails(command.input.campaignId, command.input.sessionId);

    return mapSessionDetailsFromDomain(details?.session ?? updated, details?.participants ?? [], access.role, this.visibilityService);
  }
}
