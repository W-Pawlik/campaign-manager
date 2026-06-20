import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { DeclineSessionAttendanceCommand } from "@modules/sessions/application/commands/DeclineSessionAttendanceCommand";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import { mapSessionParticipantDtoFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";
import { AttendanceStatus } from "@modules/sessions/domain/value-objects/AttendanceStatus";
import { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export class DeclineSessionAttendanceHandler
  implements CommandHandler<DeclineSessionAttendanceCommand, SessionParticipantDTO>
{
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly participantRepository: SessionParticipantRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: DeclineSessionAttendanceCommand): Promise<SessionParticipantDTO> {
    await this.accessService.requireMembership(command.input.campaignId, command.input.actorUserId);
    const session = await this.sessionRepository.findById(command.input.campaignId, command.input.sessionId);

    if (session === null) {
      throw new NotFoundError("Session not found");
    }

    session.ensureIsEditable();

    const existingParticipant = await this.participantRepository.findByUserId(
      command.input.sessionId,
      command.input.actorUserId,
    );
    const now = new Date();
    const participant =
      existingParticipant ??
      SessionParticipant.create({
        id: randomUUID(),
        sessionId: command.input.sessionId,
        userId: command.input.actorUserId,
        characterId: null,
        attendanceStatus: AttendanceStatus.invited(),
        note: null,
        createdAt: now,
        updatedAt: now,
      });

    participant.ensureOwnedBy(command.input.actorUserId);

    const declinedParticipant = participant.decline(now);

    if (existingParticipant === null) {
      await this.participantRepository.createMany([declinedParticipant]);
    } else {
      await this.participantRepository.save(declinedParticipant);
    }

    return mapSessionParticipantDtoFromDomain(declinedParticipant);
  }
}
