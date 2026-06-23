import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi, campaignsQueryKeys } from "@/features/campaigns";
import { chronicleApi } from "@/features/chronicle/api/chronicleApi";
import type {
  CreateChronicleEntryPayload,
  UpdateChronicleEntryPayload,
} from "@/features/chronicle/model/chronicle.types";

export const chronicleQueryKeys = {
  all: ["chronicle"] as const,
  details: (campaignId: string, entryId: string) => [...chronicleQueryKeys.all, campaignId, entryId] as const,
  list: (campaignId: string) => campaignsQueryKeys.chronicle(campaignId),
};

function invalidateChronicleQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  entryId?: string,
) {
  queryClient.invalidateQueries({ queryKey: chronicleQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (entryId) {
    queryClient.invalidateQueries({ queryKey: chronicleQueryKeys.details(campaignId, entryId) });
  }
}

export function useCampaignChronicleQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignChronicle(campaignId!),
    queryKey: chronicleQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useChronicleEntryDetailsQuery(campaignId: string | undefined, entryId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && entryId),
    queryFn: () => chronicleApi.getChronicleEntryDetails(campaignId!, entryId!),
    queryKey: chronicleQueryKeys.details(campaignId ?? "missing", entryId ?? "missing"),
  });
}

export function useCreateChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChronicleEntryPayload) => chronicleApi.createChronicleEntry(campaignId!, payload),
    onSuccess: (entry) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entry.id);
      }
    },
  });
}

export function useUpdateChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { entryId: string; payload: UpdateChronicleEntryPayload }) =>
      chronicleApi.updateChronicleEntry(campaignId!, input.entryId, input.payload),
    onSuccess: (entry) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entry.id);
      }
    },
  });
}

export function useDeleteChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => chronicleApi.deleteChronicleEntry(campaignId!, entryId),
    onSuccess: (_data, entryId) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entryId);
      }
    },
  });
}
