import { useInfiniteQuery, useMutation, useQuery, useQueryClient, type InfiniteData } from "@tanstack/react-query";

import { monstersApi } from "@/features/monsters/api/monstersApi";
import type {
  AddCatalogMonsterToCampaignPayload,
  CreateMonsterPayload,
  CreatePublishedMonsterPayload,
  MonsterCatalogPage,
  Open5eCatalogCreatureListItem,
  Open5eCatalogFilters,
  PublishedMonsterCatalogListItem,
  PublishedMonsterCatalogFilters,
  UpdateMonsterPayload,
} from "@/features/monsters/model/monster.types";

export const monstersQueryKeys = {
  all: ["monsters"] as const,
  campaignList: (campaignId: string, filtersKey: string) =>
    [...monstersQueryKeys.all, "campaign", campaignId, filtersKey] as const,
  details: (campaignId: string, monsterId: string) =>
    [...monstersQueryKeys.all, campaignId, monsterId] as const,
  open5eCatalog: (filtersKey: string) =>
    [...monstersQueryKeys.all, "catalog", "open5e", filtersKey] as const,
  open5eDetails: (key: string) =>
    [...monstersQueryKeys.all, "catalog", "open5e", "details", key] as const,
  publishedCatalog: (filtersKey: string) =>
    [...monstersQueryKeys.all, "catalog", "published", filtersKey] as const,
  publishedDetails: (monsterId: string) =>
    [...monstersQueryKeys.all, "catalog", "published", "details", monsterId] as const,
};

function invalidateCampaignMonsterQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  monsterId?: string,
) {
  queryClient.invalidateQueries({ queryKey: [...monstersQueryKeys.all, "campaign", campaignId] });

  if (monsterId) {
    queryClient.invalidateQueries({ queryKey: monstersQueryKeys.details(campaignId, monsterId) });
  }
}

export function useCampaignMonstersQuery(
  campaignId: string | undefined,
  filters: {
    includeGlobal?: boolean;
    maxCr?: number;
    minCr?: number;
    search?: string;
    status?: string;
    type?: string;
  },
) {
  const filtersKey = JSON.stringify(filters);

  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => monstersApi.listCampaignMonsters(campaignId!, filters),
    queryKey: monstersQueryKeys.campaignList(campaignId ?? "missing", filtersKey),
  });
}

export function useMonsterDetailsQuery(campaignId: string | undefined, monsterId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && monsterId),
    queryFn: () => monstersApi.getMonsterDetails(campaignId!, monsterId!),
    queryKey: monstersQueryKeys.details(campaignId ?? "missing", monsterId ?? "missing"),
  });
}

export function useCreateMonsterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateMonsterPayload) => monstersApi.createMonster(campaignId!, payload),
    onSuccess: (monster) => {
      if (campaignId) {
        invalidateCampaignMonsterQueries(queryClient, campaignId, monster.id);
        queryClient.setQueryData(monstersQueryKeys.details(campaignId, monster.id), monster);
      }
    },
  });
}

export function useUpdateMonsterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { monsterId: string; payload: UpdateMonsterPayload }) =>
      monstersApi.updateMonster(campaignId!, input.monsterId, input.payload),
    onSuccess: (monster) => {
      if (campaignId) {
        invalidateCampaignMonsterQueries(queryClient, campaignId, monster.id);
        queryClient.setQueryData(monstersQueryKeys.details(campaignId, monster.id), monster);
      }
    },
  });
}

export function useArchiveMonsterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (monsterId: string) => monstersApi.archiveMonster(campaignId!, monsterId),
    onSuccess: (_data, monsterId) => {
      if (campaignId) {
        invalidateCampaignMonsterQueries(queryClient, campaignId, monsterId);
      }
    },
  });
}

export function useCreatePublishedMonsterMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePublishedMonsterPayload) =>
      monstersApi.createPublishedMonster(payload),
    onSuccess: (monster) => {
      queryClient.invalidateQueries({
        queryKey: [...monstersQueryKeys.all, "catalog", "published"],
      });
      queryClient.setQueryData(monstersQueryKeys.publishedDetails(monster.id), monster);
    },
  });
}

export function useCopyOpen5eCreatureToCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { key: string; payload: AddCatalogMonsterToCampaignPayload }) =>
      monstersApi.copyOpen5eCreatureToCampaign(input.key, input.payload),
    onSuccess: (monster, input) => {
      invalidateCampaignMonsterQueries(queryClient, input.payload.campaignId, monster.id);
      queryClient.setQueryData(
        monstersQueryKeys.details(input.payload.campaignId, monster.id),
        monster,
      );
    },
  });
}

export function useCopyPublishedMonsterToCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { monsterId: string; payload: AddCatalogMonsterToCampaignPayload }) =>
      monstersApi.copyPublishedMonsterToCampaign(input.monsterId, input.payload),
    onSuccess: (monster, input) => {
      invalidateCampaignMonsterQueries(queryClient, input.payload.campaignId, monster.id);
      queryClient.setQueryData(
        monstersQueryKeys.details(input.payload.campaignId, monster.id),
        monster,
      );
    },
  });
}

export function useOpen5eCatalogQuery(filters: Open5eCatalogFilters, enabled = true) {
  const filtersKey = JSON.stringify(filters);

  return useInfiniteQuery<
    MonsterCatalogPage<Open5eCatalogCreatureListItem>,
    Error,
    InfiniteData<MonsterCatalogPage<Open5eCatalogCreatureListItem>>,
    readonly unknown[],
    number
  >({
    enabled,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: filters.page ?? 1,
    queryFn: ({ pageParam }) =>
      monstersApi.listOpen5eCatalogCreatures({
        ...filters,
        page: pageParam,
      }),
    queryKey: monstersQueryKeys.open5eCatalog(filtersKey),
  });
}

export function useOpen5eCreatureDetailsQuery(key: string | null) {
  return useQuery({
    enabled: key !== null,
    queryFn: () => monstersApi.getOpen5eCreatureDetails(key!),
    queryKey: monstersQueryKeys.open5eDetails(key ?? "missing"),
  });
}

export function usePublishedMonstersCatalogQuery(
  filters: PublishedMonsterCatalogFilters,
  enabled = true,
) {
  const filtersKey = JSON.stringify(filters);

  return useInfiniteQuery<
    MonsterCatalogPage<PublishedMonsterCatalogListItem>,
    Error,
    InfiniteData<MonsterCatalogPage<PublishedMonsterCatalogListItem>>,
    readonly unknown[],
    number
  >({
    enabled,
    getNextPageParam: (lastPage) => (lastPage.hasNext ? lastPage.page + 1 : undefined),
    initialPageParam: filters.page ?? 1,
    queryFn: ({ pageParam }) =>
      monstersApi.listPublishedMonsters({
        ...filters,
        page: pageParam,
      }),
    queryKey: monstersQueryKeys.publishedCatalog(filtersKey),
  });
}

export function usePublishedMonsterDetailsQuery(monsterId: string | null) {
  return useQuery({
    enabled: monsterId !== null,
    queryFn: () => monstersApi.getPublishedMonsterDetails(monsterId!),
    queryKey: monstersQueryKeys.publishedDetails(monsterId ?? "missing"),
  });
}
