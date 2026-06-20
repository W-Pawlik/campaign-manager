import type { PrismaClient } from "@prisma/client";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";
import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type {
  GameSessionPersistenceRecord,
  SessionMapper,
} from "@modules/sessions/infrastructure/persistence/SessionMapper";

interface GameSessionDelegate {
  findFirst(args: unknown): Promise<GameSessionPersistenceRecord | null>;
  create(args: unknown): Promise<unknown>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaGameSessionRepository implements GameSessionRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: SessionMapper,
  ) {}

  public async findById(campaignId: string, sessionId: string): Promise<GameSession | null> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionDelegate };
    const session = await sessionClient.gameSession.findFirst({
      where: {
        id: sessionId,
        campaignId,
      },
    });

    return session === null ? null : this.mapper.toDomain(session);
  }

  public async create(session: GameSession): Promise<void> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionDelegate };
    await sessionClient.gameSession.create({
      data: this.mapper.toPersistenceCreate(session),
    });
  }

  public async save(session: GameSession): Promise<void> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionDelegate };
    await sessionClient.gameSession.update({
      where: { id: session.id },
      data: this.mapper.toPersistenceUpdate(session),
    });
  }
}
