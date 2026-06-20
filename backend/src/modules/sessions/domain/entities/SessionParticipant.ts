import { ForbiddenError } from "@core/application/errors/AppError";
import { AttendanceStatus } from "@modules/sessions/domain/value-objects/AttendanceStatus";

export interface SessionParticipantProps {
  id: string;
  sessionId: string;
  userId: string;
  characterId: string | null;
  attendanceStatus: AttendanceStatus;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export type UpdateSessionParticipantParams = Omit<
  Partial<SessionParticipantProps>,
  "id" | "sessionId" | "userId" | "createdAt" | "updatedAt"
>;

export class SessionParticipant {
  public readonly id: string;
  public readonly sessionId: string;
  public readonly userId: string;
  public readonly characterId: string | null;
  public readonly attendanceStatus: AttendanceStatus;
  public readonly note: string | null;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  private constructor(props: SessionParticipantProps) {
    this.id = props.id;
    this.sessionId = props.sessionId;
    this.userId = props.userId;
    this.characterId = props.characterId;
    this.attendanceStatus = props.attendanceStatus;
    this.note = props.note;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  public static create(props: SessionParticipantProps): SessionParticipant {
    return new SessionParticipant(props);
  }

  public withUpdates(params: UpdateSessionParticipantParams): SessionParticipant {
    return SessionParticipant.create({
      ...this.toProps(),
      ...params,
      updatedAt: new Date(),
    });
  }

  public confirm(confirmedAt: Date): SessionParticipant {
    return SessionParticipant.create({
      ...this.toProps(),
      attendanceStatus: AttendanceStatus.confirmed(),
      updatedAt: confirmedAt,
    });
  }

  public decline(declinedAt: Date): SessionParticipant {
    return SessionParticipant.create({
      ...this.toProps(),
      attendanceStatus: AttendanceStatus.declined(),
      updatedAt: declinedAt,
    });
  }

  public ensureOwnedBy(userId: string): void {
    if (this.userId !== userId) {
      throw new ForbiddenError("Session participant can manage only own attendance");
    }
  }

  private toProps(): SessionParticipantProps {
    return {
      id: this.id,
      sessionId: this.sessionId,
      userId: this.userId,
      characterId: this.characterId,
      attendanceStatus: this.attendanceStatus,
      note: this.note,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
