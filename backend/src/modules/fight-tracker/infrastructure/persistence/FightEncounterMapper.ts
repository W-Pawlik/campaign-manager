import { Prisma, type FightEncounter, type FightEncounterRun as PrismaFightEncounterRun } from "@prisma/client";
import { FightEncounter as FightEncounterEntity } from "@modules/fight-tracker/domain/entities/FightEncounter";
import { FightEncounterRun } from "@modules/fight-tracker/domain/entities/FightEncounterRun";

function mapPrismaJsonToUnknown(value: Prisma.JsonValue | null): unknown | null {
  if (value === null || value === undefined) {
    return null;
  }

  return value;
}

function mapUnknownToPrismaJson(value: unknown | null): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (value === null || value === undefined) {
    return Prisma.JsonNull;
  }

  return value as Prisma.InputJsonValue;
}

export class FightEncounterMapper {
  public toDomainEncounter(record: FightEncounter): FightEncounterEntity {
    return FightEncounterEntity.create({
      id: record.id,
      campaignId: record.campaignId,
      name: record.name,
      environmentName: record.environmentName,
      environmentDetails: record.environmentDetails,
      combatantCount: record.combatantCount,
      conditionCount: record.conditionCount,
      preparationData: mapPrismaJsonToUnknown(record.preparationData),
      createdById: record.createdById,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
      archivedAt: record.archivedAt,
    });
  }

  public toPersistenceEncounter(entity: FightEncounterEntity) {
    return {
      id: entity.id,
      campaignId: entity.campaignId,
      name: entity.name,
      environmentName: entity.environmentName,
      environmentDetails: entity.environmentDetails,
      combatantCount: entity.combatantCount,
      conditionCount: entity.conditionCount,
      preparationData: mapUnknownToPrismaJson(entity.preparationData),
      createdById: entity.createdById,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
      archivedAt: entity.archivedAt,
    };
  }

  public toDomainRun(record: PrismaFightEncounterRun): FightEncounterRun {
    return FightEncounterRun.create({
      id: record.id,
      campaignId: record.campaignId,
      encounterId: record.encounterId,
      status: record.status as "ACTIVE" | "FINISHED",
      startedById: record.startedById,
      finishedById: record.finishedById,
      roundsCompleted: record.roundsCompleted,
      durationSeconds: record.durationSeconds,
      outcomeLabel: record.outcomeLabel,
      summaryData: mapPrismaJsonToUnknown(record.summaryData),
      startedAt: record.startedAt,
      finishedAt: record.finishedAt,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    });
  }

  public toPersistenceRun(entity: FightEncounterRun) {
    return {
      id: entity.id,
      campaignId: entity.campaignId,
      encounterId: entity.encounterId,
      status: entity.status,
      startedById: entity.startedById,
      finishedById: entity.finishedById,
      roundsCompleted: entity.roundsCompleted,
      durationSeconds: entity.durationSeconds,
      outcomeLabel: entity.outcomeLabel,
      summaryData: mapUnknownToPrismaJson(entity.summaryData),
      startedAt: entity.startedAt,
      finishedAt: entity.finishedAt,
      createdAt: entity.createdAt,
      updatedAt: entity.updatedAt,
    };
  }
}
