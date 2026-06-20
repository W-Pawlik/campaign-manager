import type { GameSession } from "@modules/sessions/domain/entities/GameSession";

export interface GameSessionRepository {
  findById(campaignId: string, sessionId: string): Promise<GameSession | null>;
  create(session: GameSession): Promise<void>;
  save(session: GameSession): Promise<void>;
}
