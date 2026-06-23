import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi, campaignsQueryKeys } from "@/features/campaigns";
import { questsApi } from "@/features/quests/api/questsApi";
import type {
  CreateQuestObjectivePayload,
  CreateQuestPayload,
  UpdateQuestObjectivePayload,
  UpdateQuestPayload,
} from "@/features/quests/model/quest.types";

export const questsQueryKeys = {
  all: ["quests"] as const,
  details: (campaignId: string, questId: string) => [...questsQueryKeys.all, campaignId, questId] as const,
  list: (campaignId: string) => campaignsQueryKeys.quests(campaignId),
};

function invalidateQuestQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  questId?: string,
) {
  queryClient.invalidateQueries({ queryKey: questsQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (questId) {
    queryClient.invalidateQueries({ queryKey: questsQueryKeys.details(campaignId, questId) });
  }
}

export function useCampaignQuestsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignQuests(campaignId!),
    queryKey: questsQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useQuestDetailsQuery(campaignId: string | undefined, questId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && questId),
    queryFn: () => questsApi.getQuestDetails(campaignId!, questId!),
    queryKey: questsQueryKeys.details(campaignId ?? "missing", questId ?? "missing"),
  });
}

export function useCreateQuestMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateQuestPayload) => questsApi.createQuest(campaignId!, payload),
    onSuccess: (quest) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, quest.id);
      }
    },
  });
}

export function useUpdateQuestMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { payload: UpdateQuestPayload; questId: string }) =>
      questsApi.updateQuest(campaignId!, input.questId, input.payload),
    onSuccess: (quest) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, quest.id);
      }
    },
  });
}

export function useDeleteQuestMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questId: string) => questsApi.deleteQuest(campaignId!, questId),
    onSuccess: (_data, questId) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, questId);
      }
    },
  });
}

export function useAddQuestObjectiveMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { payload: CreateQuestObjectivePayload; questId: string }) =>
      questsApi.addQuestObjective(campaignId!, input.questId, input.payload),
    onSuccess: (_objective, input) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, input.questId);
      }
    },
  });
}

export function useUpdateQuestObjectiveMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: {
      objectiveId: string;
      payload: UpdateQuestObjectivePayload;
      questId: string;
    }) => questsApi.updateQuestObjective(campaignId!, input.questId, input.objectiveId, input.payload),
    onSuccess: (_objective, input) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, input.questId);
      }
    },
  });
}

export function useDeleteQuestObjectiveMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { objectiveId: string; questId: string }) =>
      questsApi.deleteQuestObjective(campaignId!, input.questId, input.objectiveId),
    onSuccess: (_data, input) => {
      if (campaignId) {
        invalidateQuestQueries(queryClient, campaignId, input.questId);
      }
    },
  });
}
