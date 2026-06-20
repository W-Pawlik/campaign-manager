import type { Prisma } from "@prisma/client";
import { GameSession } from "@modules/sessions/domain/entities/GameSession";
import { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";
import { AttendanceStatus } from "@modules/sessions/domain/value-objects/AttendanceStatus";
import { SessionLocationType } from "@modules/sessions/domain/value-objects/SessionLocationType";
import { SessionStatus } from "@modules/sessions/domain/value-objects/SessionStatus";

export interface GameSessionPersistenceRecord {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  scheduledStartAt: Date | null;
  scheduledEndAt: Date | null;
  actualStartAt: Date | null;
  actualEndAt: Date | null;
  locationType: string | null;
  locationDetails: string | null;
  meetingUrl: string | null;
  summaryPublic: string | null;
  summaryPrivate: string | null;
  createdById: string;
  createdAt: Date;
  updatedAt: Date;
  cancelledAt: Date | null;
}

export interface SessionParticipantPersistenceRecord {
  id: string;
  sessionId: string;
  userId: string;
  characterId: string | null;
  attendanceStatus: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class SessionMapper {
  public toDomain(session: GameSessionPersistenceRecord): GameSession {
    return GameSession.create({
      id: session.id,
      campaignId: session.campaignId,
      title: session.title,
      description: session.description,
      status: SessionStatus.create(session.status),
      scheduledStartAt: session.scheduledStartAt,
      scheduledEndAt: session.scheduledEndAt,
      actualStartAt: session.actualStartAt,
      actualEndAt: session.actualEndAt,
      locationType: session.locationType === null ? null : SessionLocationType.create(session.locationType),
      locationDetails: session.locationDetails,
      meetingUrl: session.meetingUrl,
      summaryPublic: session.summaryPublic,
      summaryPrivate: session.summaryPrivate,
      createdById: session.createdById,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      cancelledAt: session.cancelledAt,
    });
  }

  public participantToDomain(participant: SessionParticipantPersistenceRecord): SessionParticipant {
    return SessionParticipant.create({
      id: participant.id,
      sessionId: participant.sessionId,
      userId: participant.userId,
      characterId: participant.characterId,
      attendanceStatus: AttendanceStatus.create(participant.attendanceStatus),
      note: participant.note,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    });
  }

  public toPersistenceCreate(session: GameSession): Prisma.GameSessionUncheckedCreateInput {
    return {
      id: session.id,
      campaignId: session.campaignId,
      title: session.title,
      description: session.description,
      status: session.status.value,
      scheduledStartAt: session.scheduledStartAt,
      scheduledEndAt: session.scheduledEndAt,
      actualStartAt: session.actualStartAt,
      actualEndAt: session.actualEndAt,
      locationType: session.locationType?.value ?? null,
      locationDetails: session.locationDetails,
      meetingUrl: session.meetingUrl,
      summaryPublic: session.summaryPublic,
      summaryPrivate: session.summaryPrivate,
      createdById: session.createdById,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
      cancelledAt: session.cancelledAt,
    };
  }

  public toPersistenceUpdate(session: GameSession): Prisma.GameSessionUncheckedUpdateInput {
    return this.toPersistenceCreate(session);
  }

  public participantToPersistenceCreate(
    participant: SessionParticipant,
  ): Prisma.SessionParticipantUncheckedCreateInput {
    return {
      id: participant.id,
      sessionId: participant.sessionId,
      userId: participant.userId,
      characterId: participant.characterId,
      attendanceStatus: participant.attendanceStatus.value,
      note: participant.note,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    };
  }

  public participantToPersistenceUpdate(
    participant: SessionParticipant,
  ): Prisma.SessionParticipantUncheckedUpdateInput {
    return this.participantToPersistenceCreate(participant);
  }
}
