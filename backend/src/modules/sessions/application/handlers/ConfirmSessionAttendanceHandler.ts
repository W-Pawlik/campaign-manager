import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { NotFoundError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import type { ConfirmSessionAttendanceCommand } from "@modules/sessions/application/commands/ConfirmSessionAttendanceCommand";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import { mapSessionParticipantDtoFromDomain } from "@modules/sessions/application/services/SessionDtoMapper";
import { AttendanceStatus } from "@modules/sessions/domain/value-objects/AttendanceStatus";
import { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export class ConfirmSessionAttendanceHandler
  implements CommandHandler<ConfirmSessionAttendanceCommand, SessionParticipantDTO>
{
  public constructor(
    private readonly sessionRepository: GameSessionRepository,
    private readonly participantRepository: SessionParticipantRepository,
    private readonly accessService: CampaignAccessApplicationService,
  ) {}

  public async execute(command: ConfirmSessionAttendanceCommand): Promise<SessionParticipantDTO> {
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

    const confirmedParticipant = participant.confirm(now);

    if (existingParticipant === null) {
      await this.participantRepository.createMany([confirmedParticipant]);
    } else {
      await this.participantRepository.save(confirmedParticipant);
    }

    return mapSessionParticipantDtoFromDomain(confirmedParticipant);
  }
}
