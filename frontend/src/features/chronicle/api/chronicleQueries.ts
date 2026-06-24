import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsQueryKeys } from "@/features/campaigns";
import { chronicleOfflineService } from "@/features/chronicle/offline/chronicleOfflineService";
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
    queryFn: () => chronicleOfflineService.listEntries(campaignId!),
    queryKey: chronicleQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useChronicleEntryDetailsQuery(campaignId: string | undefined, entryId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && entryId),
    queryFn: () => chronicleOfflineService.getEntryDetails(campaignId!, entryId!),
    queryKey: chronicleQueryKeys.details(campaignId ?? "missing", entryId ?? "missing"),
  });
}

export function useCreateChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateChronicleEntryPayload) => chronicleOfflineService.createEntry(campaignId!, payload),
    onSuccess: (entry) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entry.id);
        queryClient.setQueryData(chronicleQueryKeys.details(campaignId, entry.id), entry);
      }
    },
  });
}

export function useUpdateChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { entryId: string; payload: UpdateChronicleEntryPayload }) =>
      chronicleOfflineService.updateEntry(campaignId!, input.entryId, input.payload),
    onSuccess: (entry) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entry.id);
        queryClient.setQueryData(chronicleQueryKeys.details(campaignId, entry.id), entry);
      }
    },
  });
}

export function useDeleteChronicleEntryMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => chronicleOfflineService.deleteEntry(campaignId!, entryId),
    onSuccess: (_data, entryId) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entryId);
      }
    },
  });
}

export function useResolveChronicleConflictWithLocalMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => chronicleOfflineService.resolveConflictWithLocal(campaignId!, entryId),
    onSuccess: (entry, entryId) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entryId);

        if (entry) {
          queryClient.setQueryData(chronicleQueryKeys.details(campaignId, entry.id), entry);
        }
      }
    },
  });
}

export function useResolveChronicleConflictWithServerMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (entryId: string) => chronicleOfflineService.resolveConflictWithServer(campaignId!, entryId),
    onSuccess: (entry, entryId) => {
      if (campaignId) {
        invalidateChronicleQueries(queryClient, campaignId, entryId);

        if (entry) {
          queryClient.setQueryData(chronicleQueryKeys.details(campaignId, entry.id), entry);
        }
      }
    },
  });
}
