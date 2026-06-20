import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export interface GameSessionDetailsReadModel {
  session: GameSession;
  participants: SessionParticipant[];
}
