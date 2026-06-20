import type { GameSessionDetailsReadModel } from "@modules/sessions/application/dto/GameSessionDetailsReadModel";
import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";

export interface GameSessionReadRepository {
  listCampaignSessions(campaignId: string): Promise<GameSession[]>;
  getSessionDetails(campaignId: string, sessionId: string): Promise<GameSessionDetailsReadModel | null>;
  listSessionParticipants(campaignId: string, sessionId: string): Promise<SessionParticipant[]>;
}
