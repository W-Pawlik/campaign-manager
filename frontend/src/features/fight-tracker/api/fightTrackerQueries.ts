import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { fightTrackerApi } from "@/features/fight-tracker/api/fightTrackerApi";
import type { FightTrackerState } from "@/features/fight-tracker/model/fightTracker.types";

export const fightTrackerQueryKeys = {
  all: ["fight-tracker"] as const,
  campaign: (campaignId: string) => [...fightTrackerQueryKeys.all, campaignId] as const,
  overview: (campaignId: string) => [...fightTrackerQueryKeys.campaign(campaignId), "overview"] as const,
  encounter: (campaignId: string, encounterId: string) =>
    [...fightTrackerQueryKeys.campaign(campaignId), "encounter", encounterId] as const,
};

type EncounterPayload = {
  name: string;
  environmentName: string;
  environmentDetails: string;
  combatantCount: number;
  conditionCount: number;
  preparationData: FightTrackerState | null;
};

type RunStatePayload = {
  runId: string;
  roundsCompleted: number;
  durationSeconds: number | null;
  stateData: FightTrackerState | null;
};

type FinishRunPayload = {
  runId: string;
  roundsCompleted: number;
  durationSeconds: number;
  outcomeLabel: string;
  summaryData: unknown | null;
};

export function useFightTrackerOverviewQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => fightTrackerApi.getOverview(campaignId!),
    queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing"),
  });
}

export function useFightEncounterDetailsQuery(campaignId: string | undefined, encounterId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && encounterId),
    queryFn: () => fightTrackerApi.getEncounterDetails(campaignId!, encounterId!),
    queryKey: fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounterId ?? "missing"),
  });
}

export function useCreateFightEncounterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EncounterPayload) => fightTrackerApi.createEncounter(campaignId!, payload),
    onSuccess: (encounter) => {
      void queryClient.invalidateQueries({ queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing") });
      queryClient.setQueryData(
        fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounter.id),
        encounter,
      );
    },
  });
}

export function useUpdateFightEncounterMutation(campaignId: string | undefined, encounterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: EncounterPayload) => fightTrackerApi.updateEncounter(campaignId!, encounterId!, payload),
    onSuccess: (encounter) => {
      void queryClient.invalidateQueries({ queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing") });
      queryClient.setQueryData(
        fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounter.id),
        encounter,
      );
    },
  });
}

export function useDeleteFightEncounterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (encounterId: string) => fightTrackerApi.deleteEncounter(campaignId!, encounterId),
    onSuccess: async (_value, encounterId) => {
      await queryClient.invalidateQueries({ queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing") });
      queryClient.removeQueries({
        queryKey: fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounterId),
      });
    },
  });
}

export function useStartFightEncounterMutation(campaignId: string | undefined, encounterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => fightTrackerApi.startEncounter(campaignId!, encounterId!),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounterId ?? "missing"),
      });
      await queryClient.invalidateQueries({ queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing") });
    },
  });
}

export function useUpdateFightRunStateMutation(campaignId: string | undefined, encounterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RunStatePayload) =>
      fightTrackerApi.updateRunState(campaignId!, payload.runId, {
        roundsCompleted: payload.roundsCompleted,
        durationSeconds: payload.durationSeconds,
        stateData: payload.stateData,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounterId ?? "missing"),
      });
    },
  });
}

export function useFinishFightEncounterMutation(campaignId: string | undefined, encounterId: string | null) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: FinishRunPayload) =>
      fightTrackerApi.finishRun(campaignId!, payload.runId, {
        roundsCompleted: payload.roundsCompleted,
        durationSeconds: payload.durationSeconds,
        outcomeLabel: payload.outcomeLabel,
        summaryData: payload.summaryData,
      }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: fightTrackerQueryKeys.encounter(campaignId ?? "missing", encounterId ?? "missing"),
      });
      await queryClient.invalidateQueries({ queryKey: fightTrackerQueryKeys.overview(campaignId ?? "missing") });
    },
  });
}
