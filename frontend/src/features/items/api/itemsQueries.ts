import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { inventoryQueryKeys } from "@/features/inventory/api/inventoryQueries";
import { itemsApi } from "@/features/items/api/itemsApi";
import type {
  AddCatalogItemToCampaignPayload,
  CreatePublishedItemPayload,
  ItemCatalogPage,
  Open5eCatalogItemListItem,
  Open5eItemCatalogFilters,
  PublishedItemCatalogListItem,
  PublishedItemsCatalogFilters,
  UpdatePublishedItemPayload,
} from "@/features/items/model/item.types";

export const itemsQueryKeys = {
  all: ["items"] as const,
  open5eGeneralCatalog: (filtersKey: string) =>
    [...itemsQueryKeys.all, "catalog", "open5e-general", filtersKey] as const,
  open5eGeneralDetails: (key: string) =>
    [...itemsQueryKeys.all, "catalog", "open5e-general", "details", key] as const,
  open5eMagicCatalog: (filtersKey: string) =>
    [...itemsQueryKeys.all, "catalog", "open5e-magic", filtersKey] as const,
  open5eMagicDetails: (key: string) =>
    [...itemsQueryKeys.all, "catalog", "open5e-magic", "details", key] as const,
  publishedCatalog: (filtersKey: string) =>
    [...itemsQueryKeys.all, "catalog", "published", filtersKey] as const,
  publishedDetails: (itemTemplateId: string) =>
    [...itemsQueryKeys.all, "catalog", "published", "details", itemTemplateId] as const,
};

function invalidateCampaignInventoryQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  itemId?: string,
) {
  queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.myList(campaignId) });

  if (itemId) {
    queryClient.invalidateQueries({ queryKey: inventoryQueryKeys.details(campaignId, itemId) });
  }
}

export function useOpen5eGeneralItemsCatalogQuery(filters: Open5eItemCatalogFilters, enabled = true) {
  const filtersKey = JSON.stringify(filters);

  return useInfiniteQuery<
    ItemCatalogPage<Open5eCatalogItemListItem>,
    Error,
    InfiniteData<ItemCatalogPage<Open5eCatalogItemListItem>>,
    readonly unknown[],
    number
  >({
    enabled,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: filters.page ?? 1,
    queryFn: ({ pageParam }) => itemsApi.listOpen5eGeneralItems({ ...filters, page: pageParam }),
    queryKey: itemsQueryKeys.open5eGeneralCatalog(filtersKey),
  });
}

export function useOpen5eMagicItemsCatalogQuery(filters: Open5eItemCatalogFilters, enabled = true) {
  const filtersKey = JSON.stringify(filters);

  return useInfiniteQuery<
    ItemCatalogPage<Open5eCatalogItemListItem>,
    Error,
    InfiniteData<ItemCatalogPage<Open5eCatalogItemListItem>>,
    readonly unknown[],
    number
  >({
    enabled,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: filters.page ?? 1,
    queryFn: ({ pageParam }) => itemsApi.listOpen5eMagicItems({ ...filters, page: pageParam }),
    queryKey: itemsQueryKeys.open5eMagicCatalog(filtersKey),
  });
}

export function usePublishedItemsCatalogQuery(filters: PublishedItemsCatalogFilters, enabled = true) {
  const filtersKey = JSON.stringify(filters);

  return useInfiniteQuery<
    ItemCatalogPage<PublishedItemCatalogListItem>,
    Error,
    InfiniteData<ItemCatalogPage<PublishedItemCatalogListItem>>,
    readonly unknown[],
    number
  >({
    enabled,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: filters.page ?? 1,
    queryFn: ({ pageParam }) => itemsApi.listPublishedItems({ ...filters, page: pageParam }),
    queryKey: itemsQueryKeys.publishedCatalog(filtersKey),
  });
}

export function useOpen5eGeneralItemDetailsQuery(key: string | null) {
  return useQuery({
    enabled: key !== null,
    queryFn: () => itemsApi.getOpen5eGeneralItemDetails(key!),
    queryKey: itemsQueryKeys.open5eGeneralDetails(key ?? "missing"),
  });
}

export function useOpen5eMagicItemDetailsQuery(key: string | null) {
  return useQuery({
    enabled: key !== null,
    queryFn: () => itemsApi.getOpen5eMagicItemDetails(key!),
    queryKey: itemsQueryKeys.open5eMagicDetails(key ?? "missing"),
  });
}

export function usePublishedItemDetailsQuery(itemTemplateId: string | null) {
  return useQuery({
    enabled: itemTemplateId !== null,
    queryFn: () => itemsApi.getPublishedItemDetails(itemTemplateId!),
    queryKey: itemsQueryKeys.publishedDetails(itemTemplateId ?? "missing"),
  });
}

export function useCreatePublishedItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePublishedItemPayload) => itemsApi.createPublishedItem(payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: [...itemsQueryKeys.all, "catalog", "published"] });
      queryClient.setQueryData(itemsQueryKeys.publishedDetails(item.id), item);
    },
  });
}

export function useUpdatePublishedItemMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemTemplateId: string; payload: UpdatePublishedItemPayload }) =>
      itemsApi.updatePublishedItem(input.itemTemplateId, input.payload),
    onSuccess: (item) => {
      queryClient.invalidateQueries({ queryKey: [...itemsQueryKeys.all, "catalog", "published"] });
      queryClient.setQueryData(itemsQueryKeys.publishedDetails(item.id), item);
    },
  });
}

export function useCopyOpen5eGeneralItemToCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { key: string; payload: AddCatalogItemToCampaignPayload }) =>
      itemsApi.copyOpen5eGeneralItemToCampaign(input.key, input.payload),
    onSuccess: (item, input) => {
      invalidateCampaignInventoryQueries(queryClient, input.payload.campaignId, item.id);
      queryClient.setQueryData(inventoryQueryKeys.details(input.payload.campaignId, item.id), item);
    },
  });
}

export function useCopyOpen5eMagicItemToCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { key: string; payload: AddCatalogItemToCampaignPayload }) =>
      itemsApi.copyOpen5eMagicItemToCampaign(input.key, input.payload),
    onSuccess: (item, input) => {
      invalidateCampaignInventoryQueries(queryClient, input.payload.campaignId, item.id);
      queryClient.setQueryData(inventoryQueryKeys.details(input.payload.campaignId, item.id), item);
    },
  });
}

export function useCopyPublishedItemToCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { itemTemplateId: string; payload: AddCatalogItemToCampaignPayload }) =>
      itemsApi.copyPublishedItemToCampaign(input.itemTemplateId, input.payload),
    onSuccess: (item, input) => {
      invalidateCampaignInventoryQueries(queryClient, input.payload.campaignId, item.id);
      queryClient.setQueryData(inventoryQueryKeys.details(input.payload.campaignId, item.id), item);
    },
  });
}
