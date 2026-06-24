import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi } from "@/features/campaigns/api/campaignsApi";
import type { CreateCampaignPayload } from "@/features/campaigns/model/campaign.types";

export const campaignsQueryKeys = {
  all: ["campaigns"] as const,
  details: (campaignId: string) => [...campaignsQueryKeys.all, "details", campaignId] as const,
  overview: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "overview"] as const,
  lists: () => [...campaignsQueryKeys.all, "list"] as const,
  members: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "members"] as const,
  invitations: (campaignId: string) =>
    [...campaignsQueryKeys.details(campaignId), "invitations"] as const,
  inventory: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "inventory"] as const,
  characters: (campaignId: string) =>
    [...campaignsQueryKeys.details(campaignId), "characters"] as const,
  sessions: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "sessions"] as const,
  quests: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "quests"] as const,
  npcs: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "npcs"] as const,
  locations: (campaignId: string) =>
    [...campaignsQueryKeys.details(campaignId), "locations"] as const,
  notes: (campaignId: string) => [...campaignsQueryKeys.details(campaignId), "notes"] as const,
  chronicle: (campaignId: string) =>
    [...campaignsQueryKeys.details(campaignId), "chronicle"] as const,
};

export function useCampaignDetailsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.getCampaignDetails(campaignId!),
    queryKey: campaignsQueryKeys.details(campaignId ?? "missing"),
  });
}

export function useCampaignSessionsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignSessions(campaignId!),
    queryKey: campaignsQueryKeys.sessions(campaignId ?? "missing"),
  });
}

export function useCampaignCharactersQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignCharacters(campaignId!),
    queryKey: campaignsQueryKeys.characters(campaignId ?? "missing"),
  });
}

export function useCampaignQuestsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignQuests(campaignId!),
    queryKey: campaignsQueryKeys.quests(campaignId ?? "missing"),
  });
}

export function useCampaignInventoryQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignInventory(campaignId!),
    queryKey: campaignsQueryKeys.inventory(campaignId ?? "missing"),
  });
}

export function useCampaignLocationsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignLocations(campaignId!),
    queryKey: campaignsQueryKeys.locations(campaignId ?? "missing"),
  });
}

export function useCampaignNpcsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignNpcs(campaignId!),
    queryKey: campaignsQueryKeys.npcs(campaignId ?? "missing"),
  });
}

export function useCampaignChronicleQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignChronicle(campaignId!),
    queryKey: campaignsQueryKeys.chronicle(campaignId ?? "missing"),
  });
}

export function useCampaignNotesQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignNotes(campaignId!),
    queryKey: campaignsQueryKeys.notes(campaignId ?? "missing"),
  });
}

export function useCreateCampaignMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateCampaignPayload) => campaignsApi.createCampaign(payload),
    onSuccess: (campaign) => {
      queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.all });
      queryClient.setQueryData(campaignsQueryKeys.details(campaign.id), campaign);
    },
  });
}

export function useUserCampaignsQuery() {
  return useQuery({
    queryFn: campaignsApi.listUserCampaigns,
    queryKey: campaignsQueryKeys.lists(),
  });
}

export function useCampaignOverviewQueries(campaignId: string | undefined) {
  const enabled = Boolean(campaignId);
  const resolvedCampaignId = campaignId ?? "missing";

  const results = useQueries({
    queries: [
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignMembers(campaignId!),
        queryKey: campaignsQueryKeys.members(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignCharacters(campaignId!),
        queryKey: campaignsQueryKeys.characters(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignSessions(campaignId!),
        queryKey: campaignsQueryKeys.sessions(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignQuests(campaignId!),
        queryKey: campaignsQueryKeys.quests(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignLocations(campaignId!),
        queryKey: campaignsQueryKeys.locations(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignNpcs(campaignId!),
        queryKey: campaignsQueryKeys.npcs(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignChronicle(campaignId!),
        queryKey: campaignsQueryKeys.chronicle(resolvedCampaignId),
      },
      {
        enabled,
        queryFn: () => campaignsApi.listCampaignNotes(campaignId!),
        queryKey: campaignsQueryKeys.notes(resolvedCampaignId),
      },
    ],
  });

  return {
    charactersQuery: results[1],
    chronicleQuery: results[6],
    isError: results.some((result) => result.isError),
    isLoading: results.some((result) => result.isLoading),
    locationsQuery: results[4],
    membersQuery: results[0],
    notesQuery: results[7],
    npcsQuery: results[5],
    questsQuery: results[3],
    sessionsQuery: results[2],
  };
}
