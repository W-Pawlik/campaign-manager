import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsQueryKeys } from "@/features/campaigns";
import { inventoryApi } from "@/features/inventory/api/inventoryApi";
import type {
  CreateInventoryItemPayload,
  TransferInventoryItemPayload,
  UpdateInventoryItemPayload,
} from "@/features/inventory/model/inventory.types";

export const inventoryQueryKeys = {
  all: ["inventory"] as const,
  details: (campaignId: string, itemId: string) => [...inventoryQueryKeys.all, campaignId, itemId] as const,
  list: (campaignId: string) => [...inventoryQueryKeys.all, campaignId, "list"] as const,
};

function invalidateInventoryQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  itemId?: string,
) {
  queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.inventory(campaignId) });

  if (itemId) {
    queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.details(campaignId, itemId) });
  }
}

export function useCampaignInventoryItemsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => inventoryApi.listCampaignInventory(campaignId!),
    queryKey: inventoryQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useInventoryItemDetailsQuery(campaignId: string | undefined, itemId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && itemId),
    queryFn: () => inventoryApi.getInventoryItemDetails(campaignId!, itemId!),
    queryKey: inventoryQueryKeys.details(campaignId ?? "missing", itemId ?? "missing"),
  });
}

export function useCreateInventoryItemMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInventoryItemPayload) => inventoryApi.createInventoryItem(campaignId!, payload),
    onSuccess: (item) => {
      if (campaignId) {
        invalidateInventoryQueries(queryClient, campaignId, item.id);
        queryClient.setQueryData(inventoryQueryKeys.details(campaignId, item.id), item);
      }
    },
  });
}

export function useUpdateInventoryItemMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemId: string; payload: UpdateInventoryItemPayload }) =>
      inventoryApi.updateInventoryItem(campaignId!, input.itemId, input.payload),
    onSuccess: (item) => {
      if (campaignId) {
        invalidateInventoryQueries(queryClient, campaignId, item.id);
        queryClient.setQueryData(inventoryQueryKeys.details(campaignId, item.id), item);
      }
    },
  });
}

export function useDeleteInventoryItemMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (itemId: string) => inventoryApi.deleteInventoryItem(campaignId!, itemId),
    onSuccess: (_data, itemId) => {
      if (campaignId) {
        invalidateInventoryQueries(queryClient, campaignId, itemId);
      }
    },
  });
}

export function useTransferInventoryItemMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemId: string; payload: TransferInventoryItemPayload }) =>
      inventoryApi.transferInventoryItem(campaignId!, input.itemId, input.payload),
    onSuccess: (item) => {
      if (campaignId) {
        invalidateInventoryQueries(queryClient, campaignId, item.id);
        queryClient.setQueryData(inventoryQueryKeys.details(campaignId, item.id), item);
      }
    },
  });
}
