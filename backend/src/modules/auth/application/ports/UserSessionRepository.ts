import type { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";

export interface UserSessionRepository {
  create(session: RefreshToken): Promise<void>;
  findById(sessionId: string): Promise<RefreshToken | null>;
  revokeById(sessionId: string, revokedAt: Date): Promise<void>;
}
