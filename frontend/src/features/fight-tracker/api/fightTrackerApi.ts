import { httpClient } from "@/core/api/httpClient";
import type {
  FightEncounterDetails,
  FightEncounterHistoryEntry,
  FightEncounterRun,
  FightPreparedEncounter,
  FightTrackerOverview,
  FightTrackerState,
} from "@/features/fight-tracker/model/fightTracker.types";
import { formatDateTimeLabel, formatDurationFromSeconds } from "@/features/fight-tracker/model/useFightTrackerState";

const campaignsBasePath = "/campaigns";

type CreateOrUpdateEncounterPayload = {
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: FightTrackerState | null;
};

type UpdateRunStatePayload = {
  roundsCompleted: number;
  durationSeconds: number | null;
  stateData: FightTrackerState | null;
};

type FinishRunPayload = {
  roundsCompleted: number;
  durationSeconds: number;
  outcomeLabel: string;
  summaryData: unknown | null;
};

type FightEncounterListItemResponse = {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  createdAt: string;
  updatedAt: string;
};

type FightEncounterHistoryItemResponse = {
  runId: string;
  encounterId: string;
  encounterName: string;
  environmentName: string;
  status: string;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  startedAt: string;
  finishedAt: string | null;
};

type FightEncounterRunResponse = {
  id: string;
  encounterId: string;
  campaignId: string;
  status: string;
  startedAt: string;
  finishedAt: string | null;
  roundsCompleted: number;
  durationSeconds: number | null;
  outcomeLabel: string | null;
  stateData: FightTrackerState | null;
};

type FightEncounterDetailsResponse = {
  id: string;
  campaignId: string;
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: FightTrackerState | null;
  createdAt: string;
  updatedAt: string;
  activeRun: FightEncounterRunResponse | null;
  history: FightEncounterHistoryItemResponse[];
};

type FightTrackerOverviewResponse = {
  encounters: FightEncounterListItemResponse[];
  history: FightEncounterHistoryItemResponse[];
};

function mapPreparedEncounter(item: FightEncounterListItemResponse): FightPreparedEncounter {
  return {
    id: item.id,
    encounterName: item.name,
    environmentName: item.environmentName,
    environmentDetails: item.environmentDetails,
    combatantCount: item.combatantCount,
    conditionCount: item.conditionCount,
    description: item.environmentDetails,
    updatedAtLabel: formatDateTimeLabel(new Date(item.updatedAt)),
  };
}

function mapHistoryItem(item: FightEncounterHistoryItemResponse): FightEncounterHistoryEntry {
  return {
    id: item.runId,
    encounterName: item.encounterName,
    environmentName: item.environmentName,
    durationLabel: formatDurationFromSeconds(item.durationSeconds ?? 0),
    roundsCompleted: item.roundsCompleted,
    combatantCount: 0,
    finishedAtLabel: formatDateTimeLabel(new Date(item.finishedAt ?? item.startedAt)),
    outcomeLabel: item.outcomeLabel ?? (item.status === "ACTIVE" ? "In progress" : "Encounter complete"),
    highlights: [],
  };
}

function mapRun(item: FightEncounterRunResponse): FightEncounterRun {
  return {
    ...item,
    stateData: item.stateData,
  };
}

function mapDetails(item: FightEncounterDetailsResponse): FightEncounterDetails {
  return {
    id: item.id,
    campaignId: item.campaignId,
    name: item.name,
    environmentName: item.environmentName,
    environmentDetails: item.environmentDetails,
    combatantCount: item.combatantCount,
    conditionCount: item.conditionCount,
    preparationData: item.preparationData,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    activeRun: item.activeRun ? mapRun(item.activeRun) : null,
    history: item.history.map(mapHistoryItem),
  };
}

export const fightTrackerApi = {
  async getOverview(campaignId: string): Promise<FightTrackerOverview> {
    const response = await httpClient.get<FightTrackerOverviewResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker`,
    );

    return {
      encounters: response.data.encounters.map(mapPreparedEncounter),
      history: response.data.history.map(mapHistoryItem),
    };
  },

  async getEncounterDetails(campaignId: string, encounterId: string): Promise<FightEncounterDetails> {
    const response = await httpClient.get<FightEncounterDetailsResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/encounters/${encounterId}`,
    );

    return mapDetails(response.data);
  },

  async createEncounter(
    campaignId: string,
    payload: CreateOrUpdateEncounterPayload,
  ): Promise<FightEncounterDetails> {
    const response = await httpClient.post<FightEncounterDetailsResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/encounters`,
      payload,
    );

    return mapDetails(response.data);
  },

  async updateEncounter(
    campaignId: string,
    encounterId: string,
    payload: CreateOrUpdateEncounterPayload,
  ): Promise<FightEncounterDetails> {
    const response = await httpClient.patch<FightEncounterDetailsResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/encounters/${encounterId}`,
      payload,
    );

    return mapDetails(response.data);
  },

  async deleteEncounter(campaignId: string, encounterId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/fight-tracker/encounters/${encounterId}`);
  },

  async startEncounter(campaignId: string, encounterId: string): Promise<FightEncounterRun> {
    const response = await httpClient.post<FightEncounterRunResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/encounters/${encounterId}/start`,
    );

    return mapRun(response.data);
  },

  async updateRunState(campaignId: string, runId: string, payload: UpdateRunStatePayload): Promise<FightEncounterRun> {
    const response = await httpClient.patch<FightEncounterRunResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/runs/${runId}/state`,
      payload,
    );

    return mapRun(response.data);
  },

  async finishRun(campaignId: string, runId: string, payload: FinishRunPayload): Promise<FightEncounterRun> {
    const response = await httpClient.post<FightEncounterRunResponse>(
      `${campaignsBasePath}/${campaignId}/fight-tracker/runs/${runId}/finish`,
      payload,
    );

    return mapRun(response.data);
  },
} as const;
