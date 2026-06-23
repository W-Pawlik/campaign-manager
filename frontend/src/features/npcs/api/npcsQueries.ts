import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi, campaignsQueryKeys } from "@/features/campaigns";
import { npcsApi } from "@/features/npcs/api/npcsApi";
import type { CreateNpcPayload, UpdateNpcPayload } from "@/features/npcs/model/npc.types";

export const npcsQueryKeys = {
  all: ["npcs"] as const,
  details: (campaignId: string, npcId: string) => [...npcsQueryKeys.all, campaignId, npcId] as const,
  list: (campaignId: string) => campaignsQueryKeys.npcs(campaignId),
};

function invalidateNpcQueries(queryClient: ReturnType<typeof useQueryClient>, campaignId: string, npcId?: string) {
  queryClient.invalidateQueries({ queryKey: npcsQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (npcId) {
    queryClient.invalidateQueries({ queryKey: npcsQueryKeys.details(campaignId, npcId) });
  }
}

export function useCampaignNpcsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignNpcs(campaignId!),
    queryKey: npcsQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useNpcDetailsQuery(campaignId: string | undefined, npcId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && npcId),
    queryFn: () => npcsApi.getNpcDetails(campaignId!, npcId!),
    queryKey: npcsQueryKeys.details(campaignId ?? "missing", npcId ?? "missing"),
  });
}

export function useCreateNpcMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNpcPayload) => npcsApi.createNpc(campaignId!, payload),
    onSuccess: (npc) => {
      if (campaignId) {
        invalidateNpcQueries(queryClient, campaignId, npc.id);
      }
    },
  });
}

export function useUpdateNpcMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { npcId: string; payload: UpdateNpcPayload }) =>
      npcsApi.updateNpc(campaignId!, input.npcId, input.payload),
    onSuccess: (npc) => {
      if (campaignId) {
        invalidateNpcQueries(queryClient, campaignId, npc.id);
      }
    },
  });
}

export function useDeleteNpcMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (npcId: string) => npcsApi.deleteNpc(campaignId!, npcId),
    onSuccess: (_data, npcId) => {
      if (campaignId) {
        invalidateNpcQueries(queryClient, campaignId, npcId);
      }
    },
  });
}
