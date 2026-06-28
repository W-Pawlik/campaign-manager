import type { PrismaClient } from "@prisma/client";
import type { FightEncounterDetailsDTO } from "@modules/fight-tracker/application/dto/FightEncounterDetailsDTO";
import type { FightEncounterHistoryItemDTO } from "@modules/fight-tracker/application/dto/FightEncounterHistoryItemDTO";
import type { FightEncounterListItemDTO } from "@modules/fight-tracker/application/dto/FightEncounterListItemDTO";
import type { FightEncounterRunDTO } from "@modules/fight-tracker/application/dto/FightEncounterRunDTO";
import type { FightTrackerOverviewDTO } from "@modules/fight-tracker/application/dto/FightTrackerOverviewDTO";
import type { FightTrackerReadRepository } from "@modules/fight-tracker/application/ports/FightTrackerReadRepository";

function mapEncounterListItem(record: {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  createdAt: Date;
  updatedAt: Date;
}): FightEncounterListItemDTO {
  return {
    id: record.id,
    campaignId: record.campaignId,
    name: record.name,
    environmentName: record.environmentName,
    environmentDetails: record.environmentDetails,
    combatantCount: record.combatantCount,
    conditionCount: record.conditionCount,
    createdAt: record.createdAt.toISOString(),
    updatedAt: record.updatedAt.toISOString(),
  };
}

function mapHistoryItem(record: {
  id: string;
  encounterId: string;
  status: string;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  startedAt: Date;
  finishedAt: Date | null;
  encounter: {
    id: string;
    name: string;
    environmentName: string;
  };
}): FightEncounterHistoryItemDTO {
  return {
    runId: record.id,
    encounterId: record.encounter.id,
    encounterName: record.encounter.name,
    environmentName: record.encounter.environmentName,
    status: record.status,
    roundsCompleted: record.roundsCompleted,
    durationSeconds: record.durationSeconds,
    outcomeLabel: record.outcomeLabel,
    startedAt: record.startedAt.toISOString(),
    finishedAt: record.finishedAt?.toISOString() ?? null,
  };
}

function mapRunItem(record: {
  id: string;
  encounterId: string;
  campaignId: string;
  status: string;
  startedAt: Date;
  finishedAt: Date | null;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  summaryData: unknown | null;
}): FightEncounterRunDTO {
  return {
    id: record.id,
    encounterId: record.encounterId,
    campaignId: record.campaignId,
    status: record.status,
    startedAt: record.startedAt.toISOString(),
    finishedAt: record.finishedAt?.toISOString() ?? null,
    roundsCompleted: record.roundsCompleted,
    durationSeconds: record.durationSeconds,
    outcomeLabel: record.outcomeLabel,
    stateData: record.summaryData,
  };
}

export class PrismaFightTrackerReadRepository implements FightTrackerReadRepository {
  public constructor(private readonly prismaClient: PrismaClient) {}

  public async getOverview(campaignId: string): Promise<FightTrackerOverviewDTO> {
    const [encounters, history] = await Promise.all([
      this.prismaClient.fightEncounter.findMany({
        where: {
          campaignId,
          archivedAt: null,
        },
        orderBy: {
          updatedAt: "desc",
        },
      }),
      this.prismaClient.fightEncounterRun.findMany({
        where: {
          campaignId,
        },
        include: {
          encounter: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
      }),
    ]);

    return {
      encounters: encounters.map(mapEncounterListItem),
      history: history.map(mapHistoryItem),
    };
  }

  public async getEncounterDetails(
    campaignId: string,
    encounterId: string,
  ): Promise<FightEncounterDetailsDTO | null> {
    const [encounter, activeRun] = await Promise.all([
      this.prismaClient.fightEncounter.findFirst({
        where: {
          id: encounterId,
          campaignId,
          archivedAt: null,
        },
        include: {
          runs: {
            orderBy: {
              createdAt: "desc",
            },
            include: {
              encounter: true,
            },
            take: 10,
          },
        },
      }),
      this.prismaClient.fightEncounterRun.findFirst({
        where: {
          campaignId,
          encounterId,
          status: "ACTIVE",
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    if (!encounter) {
      return null;
    }

    return {
      id: encounter.id,
      campaignId: encounter.campaignId,
      name: encounter.name,
      environmentName: encounter.environmentName,
      environmentDetails: encounter.environmentDetails,
      combatantCount: encounter.combatantCount,
      conditionCount: encounter.conditionCount,
      preparationData: encounter.preparationData,
      createdAt: encounter.createdAt.toISOString(),
      updatedAt: encounter.updatedAt.toISOString(),
      activeRun: activeRun ? mapRunItem(activeRun) : null,
      history: encounter.runs.map(mapHistoryItem),
    };
  }
}
