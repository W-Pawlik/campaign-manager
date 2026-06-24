import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { monstersApi } from "@/features/monsters/api/monstersApi";
import type {
  CreateMonsterPayload,
  ImportOpen5eMonsterPayload,
  UpdateMonsterPayload,
} from "@/features/monsters/model/monster.types";

export const monstersQueryKeys = {
  all: ["monsters"] as const,
  campaignList: (campaignId: string, filtersKey: string) =>
    [...monstersQueryKeys.all, "campaign", campaignId, filtersKey] as const,
  details: (campaignId: string, monsterId: string) =>
    [...monstersQueryKeys.all, campaignId, monsterId] as const,
  open5eDetails: (resourceType: string, key: string) =>
    [...monstersQueryKeys.all, "open5e", "details", resourceType, key] as const,
  open5eSearch: (query: string, page: number) =>
    [...monstersQueryKeys.all, "open5e", "search", query, page] as const,
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

export function useImportOpen5eMonsterMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ImportOpen5eMonsterPayload) => monstersApi.importOpen5eMonster(campaignId!, payload),
    onSuccess: (monster) => {
      if (campaignId) {
        invalidateCampaignMonsterQueries(queryClient, campaignId, monster.id);
        queryClient.setQueryData(monstersQueryKeys.details(campaignId, monster.id), monster);
      }
    },
  });
}

export function useImportOpen5eMonsterToAnyCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { campaignId: string; payload: ImportOpen5eMonsterPayload }) =>
      monstersApi.importOpen5eMonster(input.campaignId, input.payload),
    onSuccess: (monster, input) => {
      invalidateCampaignMonsterQueries(queryClient, input.campaignId, monster.id);
      queryClient.setQueryData(monstersQueryKeys.details(input.campaignId, monster.id), monster);
    },
  });
}

export function useOpen5eSearchQuery(query: string, page = 1) {
  return useQuery({
    enabled: query.trim().length >= 2,
    queryFn: () =>
      monstersApi.searchOpen5eResources({
        limit: 20,
        page,
        query,
        resourceType: "CREATURE",
      }),
    queryKey: monstersQueryKeys.open5eSearch(query, page),
  });
}

export function useOpen5eResourceDetailsQuery(resourceType: string, key: string | null) {
  return useQuery({
    enabled: key !== null,
    queryFn: () => monstersApi.getOpen5eResourceDetails(resourceType, key!),
    queryKey: monstersQueryKeys.open5eDetails(resourceType, key ?? "missing"),
  });
}
