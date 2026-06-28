import type { PrismaClient } from "@prisma/client";
import type { FightEncounterRepository } from "@modules/fight-tracker/application/ports/FightEncounterRepository";
import type { FightEncounter } from "@modules/fight-tracker/domain/entities/FightEncounter";
import type { FightEncounterRun } from "@modules/fight-tracker/domain/entities/FightEncounterRun";
import type { FightEncounterMapper } from "@modules/fight-tracker/infrastructure/persistence/FightEncounterMapper";

export class PrismaFightEncounterRepository implements FightEncounterRepository {
  public constructor(
    private readonly prismaClient: PrismaClient,
    private readonly mapper: FightEncounterMapper,
  ) {}

  public async createEncounter(encounter: FightEncounter): Promise<void> {
    await this.prismaClient.fightEncounter.create({
      data: this.mapper.toPersistenceEncounter(encounter),
    });
  }

  public async findEncounterById(
    campaignId: string,
    encounterId: string,
  ): Promise<FightEncounter | null> {
    const record = await this.prismaClient.fightEncounter.findFirst({
      where: {
        id: encounterId,
        campaignId,
        archivedAt: null,
      },
    });

    return record ? this.mapper.toDomainEncounter(record) : null;
  }

  public async saveEncounter(encounter: FightEncounter): Promise<void> {
    await this.prismaClient.fightEncounter.update({
      where: {
        id: encounter.id,
      },
      data: this.mapper.toPersistenceEncounter(encounter),
    });
  }

  public async archiveEncounter(encounter: FightEncounter): Promise<void> {
    await this.prismaClient.fightEncounter.update({
      where: {
        id: encounter.id,
      },
      data: {
        archivedAt: encounter.archivedAt,
        updatedAt: encounter.updatedAt,
      },
    });
  }

  public async createRun(run: FightEncounterRun): Promise<void> {
    await this.prismaClient.fightEncounterRun.create({
      data: this.mapper.toPersistenceRun(run),
    });
  }

  public async findActiveRunByEncounterId(
    campaignId: string,
    encounterId: string,
  ): Promise<FightEncounterRun | null> {
    const record = await this.prismaClient.fightEncounterRun.findFirst({
      where: {
        campaignId,
        encounterId,
        status: "ACTIVE",
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return record ? this.mapper.toDomainRun(record) : null;
  }

  public async findRunById(campaignId: string, runId: string): Promise<FightEncounterRun | null> {
    const record = await this.prismaClient.fightEncounterRun.findFirst({
      where: {
        id: runId,
        campaignId,
      },
    });

    return record ? this.mapper.toDomainRun(record) : null;
  }

  public async saveRun(run: FightEncounterRun): Promise<void> {
    const data = this.mapper.toPersistenceRun(run);

    await this.prismaClient.fightEncounterRun.update({
      where: {
        id: run.id,
      },
      data: {
        status: data.status,
        finishedById: data.finishedById,
        roundsCompleted: data.roundsCompleted,
        durationSeconds: data.durationSeconds,
        outcomeLabel: data.outcomeLabel,
        summaryData: data.summaryData,
        finishedAt: data.finishedAt,
        updatedAt: data.updatedAt,
      },
    });
  }
}
