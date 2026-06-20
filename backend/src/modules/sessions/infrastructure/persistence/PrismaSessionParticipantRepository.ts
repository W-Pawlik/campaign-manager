import type { PrismaClient } from "@prisma/client";
import type { SessionParticipantRepository } from "@modules/sessions/application/ports/SessionParticipantRepository";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";
import type {
  SessionMapper,
  SessionParticipantPersistenceRecord,
} from "@modules/sessions/infrastructure/persistence/SessionMapper";

interface SessionParticipantDelegate {
  createMany(args: unknown): Promise<unknown>;
  findFirst(args: unknown): Promise<SessionParticipantPersistenceRecord | null>;
  update(args: unknown): Promise<unknown>;
}

export class PrismaSessionParticipantRepository implements SessionParticipantRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: SessionMapper,
  ) {}

  public async createMany(participants: SessionParticipant[]): Promise<void> {
    if (participants.length === 0) {
      return;
    }

    const participantClient = this.prismaClient as PrismaClient & {
      sessionParticipant: SessionParticipantDelegate;
    };
    await participantClient.sessionParticipant.createMany({
      data: participants.map((participant) => this.mapper.participantToPersistenceCreate(participant)),
    });
  }

  public async findByUserId(sessionId: string, userId: string): Promise<SessionParticipant | null> {
    const participantClient = this.prismaClient as PrismaClient & {
      sessionParticipant: SessionParticipantDelegate;
    };
    const participant = await participantClient.sessionParticipant.findFirst({
      where: {
        sessionId,
        userId,
      },
    });

    return participant === null ? null : this.mapper.participantToDomain(participant);
  }

  public async save(participant: SessionParticipant): Promise<void> {
    const participantClient = this.prismaClient as PrismaClient & {
      sessionParticipant: SessionParticipantDelegate;
    };
    await participantClient.sessionParticipant.update({
      where: { id: participant.id },
      data: this.mapper.participantToPersistenceUpdate(participant),
    });
  }
}
