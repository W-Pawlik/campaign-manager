import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export interface SessionParticipantRepository {
  createMany(participants: SessionParticipant[]): Promise<void>;
  findByUserId(sessionId: string, userId: string): Promise<SessionParticipant | null>;
  save(participant: SessionParticipant): Promise<void>;
}
