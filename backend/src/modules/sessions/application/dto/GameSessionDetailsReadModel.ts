import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export interface SessionParticipantReadModel {
  id: string;
  sessionId: string;
  userId: string;
  username: string | null;
  avatarUrl: string | null;
  characterId: string | null;
  attendanceStatus: string;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSessionDetailsReadModel {
  session: GameSession;
  participants: Array<SessionParticipant | SessionParticipantReadModel>;
}
