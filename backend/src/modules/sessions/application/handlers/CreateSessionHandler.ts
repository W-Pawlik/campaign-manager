import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignMembershipRepository } from "@modules/campaigns/application/ports/CampaignMembershipRepository";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateSessionCommand } from "@modules/sessions/application/commands/CreateSessionCommand";
import type { SessionDetailsDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import { mapSessionDetailsFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";
import { GameSession } from "@modules/sessions/domain/entities/GameSession";
import { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";
import { AttendanceStatus } from "@modules/sessions/domain/value-objects/AttendanceStatus";
import { SessionLocationType } from "@modules/sessions/domain/value-objects/SessionLocationType";
import { SessionStatus } from "@modules/sessions/domain/value-objects/SessionStatus";

export class CreateSessionHandler implements CommandHandler<CreateSessionCommand, SessionDetailsDTO> {
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly participantRepository: SessionParticipantRepository,
    private readonly membershipRepository: CampaignMembershipRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly visibilityService: CampaignVisibilityApplicationService,
  ) {}

  public async execute(command: CreateSessionCommand): Promise<SessionDetailsDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.SESSION_CREATE,
    );

    const createdAt = new Date();
    const session = GameSession.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      title: command.input.title.trim(),
      description: command.input.description ?? null,
      status:
        command.input.status === undefined
          ? SessionStatus.planned()
          : SessionStatus.create(command.input.status),
      scheduledStartAt: command.input.scheduledStartAt ?? null,
      scheduledEndAt: command.input.scheduledEndAt ?? null,
      actualStartAt: command.input.actualStartAt ?? null,
      actualEndAt: command.input.actualEndAt ?? null,
      locationType:
        command.input.locationType === undefined || command.input.locationType === null
          ? null
          : SessionLocationType.create(command.input.locationType),
      locationDetails: command.input.locationDetails ?? null,
      meetingUrl: command.input.meetingUrl ?? null,
      summaryPublic: command.input.summaryPublic ?? null,
      summaryPrivate: command.input.summaryPrivate ?? null,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
      cancelledAt: null,
    });

    const members = await this.membershipRepository.listActiveMembers(command.input.campaignId);
    const participants = members.map((member) =>
      SessionParticipant.create({
        id: randomUUID(),
        sessionId: session.id,
        userId: member.userId,
        characterId: null,
        attendanceStatus: AttendanceStatus.invited(),
        note: null,
        createdAt,
        updatedAt: createdAt,
      }),
    );

    await this.sessionRepository.create(session);
    await this.participantRepository.createMany(participants);

    return mapSessionDetailsFromDomain(session, participants, access.role, this.visibilityService);
  }
}
