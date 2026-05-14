import type { PrismaClient } from "@prisma/client";
import type { UserSessionRepository } from "@modules/auth/application/ports/UserSessionRepository";
import { RefreshToken } from "@modules/auth/domain/entities/RefreshToken";

export class PrismaUserSessionRepository implements UserSessionRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async create(session: RefreshToken): Promise<void> {
    await this.prismaClient.userSession.create({
      data: {
        id: session.id,
        userId: session.userId,
        refreshTokenHash: session.tokenHash,
        expiresAt: session.expiresAt,
        createdAt: session.createdAt,
        revokedAt: session.revokedAt,
      },
    });
  }

  public async findById(sessionId: string): Promise<RefreshToken | null> {
    const session = await this.prismaClient.userSession.findUnique({
      where: { id: sessionId },
    });

    if (session === null) {
      return null;
    }

    return RefreshToken.create({
      id: session.id,
      userId: session.userId,
      tokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      createdAt: session.createdAt,
      revokedAt: session.revokedAt,
    });
  }

  public async revokeById(sessionId: string, revokedAt: Date): Promise<void> {
    await this.prismaClient.userSession.updateMany({
      where: { id: sessionId, revokedAt: null },
      data: { revokedAt },
    });
  }
}
