import type { PrismaClient } from "@prisma/client";
import type {
  GameSessionDetailsReadModel,
  SessionParticipantReadModel,
} from "@modules/sessions/application/dto/GameSessionDetailsReadModel";
import type { GameSessionReadRepository } from "@modules/sessions/application/ports/GameSessionReadRepository";
import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";
import type {
  GameSessionPersistenceRecord,
  SessionMapper,
  SessionParticipantPersistenceRecord,
} from "@modules/sessions/infrastructure/persistence/SessionMapper";

interface GameSessionDetailsPersistenceRecord extends GameSessionPersistenceRecord {
  participants: Array<
    SessionParticipantPersistenceRecord & {
      user: {
        avatarUrl: string | null;
        username: string;
      };
    }
  >;
}

interface GameSessionReadDelegate {
  findMany(args: unknown): Promise<GameSessionPersistenceRecord[]>;
  findFirst(args: unknown): Promise<GameSessionDetailsPersistenceRecord | null>;
}

interface SessionParticipantReadDelegate {
  findMany(args: unknown): Promise<SessionParticipantPersistenceRecord[]>;
}

export class PrismaGameSessionReadRepository implements GameSessionReadRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: SessionMapper,
  ) {}

  public async listCampaignSessions(campaignId: string): Promise<GameSession[]> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionReadDelegate };
    const sessions = await sessionClient.gameSession.findMany({
      where: {
        campaignId,
      },
      orderBy: [
        { scheduledStartAt: "asc" },
        { createdAt: "desc" },
      ],
    });

    return sessions.map((session) => this.mapper.toDomain(session));
  }

  public async getSessionDetails(
    campaignId: string,
    sessionId: string,
  ): Promise<GameSessionDetailsReadModel | null> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionReadDelegate };
    const session = await sessionClient.gameSession.findFirst({
      where: {
        id: sessionId,
        campaignId,
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                avatarUrl: true,
                username: true,
              },
            },
          },
          orderBy: [
            { createdAt: "asc" },
            { userId: "asc" },
          ],
        },
      },
    });

    if (session === null) {
      return null;
    }

    const participants: SessionParticipantReadModel[] = session.participants.map((participant) => ({
      id: participant.id,
      sessionId: participant.sessionId,
      userId: participant.userId,
      username: participant.user.username,
      avatarUrl: participant.user.avatarUrl,
      characterId: participant.characterId,
      attendanceStatus: participant.attendanceStatus,
      note: participant.note,
      createdAt: participant.createdAt,
      updatedAt: participant.updatedAt,
    }));

    return {
      session: this.mapper.toDomain(session),
      participants,
    };
  }

  public async listSessionParticipants(
    campaignId: string,
    sessionId: string,
  ): Promise<SessionParticipant[]> {
    const sessionClient = this.prismaClient as PrismaClient & { gameSession: GameSessionReadDelegate };
    const existingSession = await sessionClient.gameSession.findFirst({
      where: {
        id: sessionId,
        campaignId,
      },
    });

    if (existingSession === null) {
      return [];
    }

    const participantClient = this.prismaClient as PrismaClient & {
      sessionParticipant: SessionParticipantReadDelegate;
    };
    const participants = await participantClient.sessionParticipant.findMany({
      where: {
        sessionId,
      },
      orderBy: [
        { createdAt: "asc" },
        { userId: "asc" },
      ],
    });

    return participants.map((participant) => this.mapper.participantToDomain(participant));
  }
}
