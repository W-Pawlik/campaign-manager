import { useQueries } from "@tanstack/react-query";
import { useMemo } from "react";

import { campaignsApi } from "@/features/campaigns/api/campaignsApi";
import { campaignsQueryKeys } from "@/features/campaigns/api/campaignsQueries";

export type CampaignReferenceEntityType =
  | "CAMPAIGN"
  | "SESSION"
  | "CHARACTER"
  | "NPC"
  | "QUEST"
  | "LOCATION"
  | "ITEM"
  | "CHRONICLE_ENTRY";

type ReferenceOption = {
  id: string;
  label: string;
};

type ReferenceQueries = {
  characters: ReferenceOption[];
  chronicle: ReferenceOption[];
  inventory: ReferenceOption[];
  locations: ReferenceOption[];
  npcs: ReferenceOption[];
  quests: ReferenceOption[];
  sessions: ReferenceOption[];
};

function uniqueEntityTypes(entityTypes: CampaignReferenceEntityType[]): CampaignReferenceEntityType[] {
  return [...new Set(entityTypes)];
}

export function useCampaignReferenceIndex(
  campaignId: string | undefined,
  entityTypes: CampaignReferenceEntityType[],
  campaignName?: string,
) {
  const enabled = Boolean(campaignId);
  const requiredTypes = useMemo(() => uniqueEntityTypes(entityTypes), [entityTypes]);

  const queries = useQueries({
    queries: [
      {
        enabled: enabled && requiredTypes.includes("ITEM"),
        queryFn: () => campaignsApi.listCampaignInventory(campaignId!),
        queryKey: campaignsQueryKeys.inventory(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("SESSION"),
        queryFn: () => campaignsApi.listCampaignSessions(campaignId!),
        queryKey: campaignsQueryKeys.sessions(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("CHARACTER"),
        queryFn: () => campaignsApi.listCampaignCharacters(campaignId!),
        queryKey: campaignsQueryKeys.characters(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("NPC"),
        queryFn: () => campaignsApi.listCampaignNpcs(campaignId!),
        queryKey: campaignsQueryKeys.npcs(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("QUEST"),
        queryFn: () => campaignsApi.listCampaignQuests(campaignId!),
        queryKey: campaignsQueryKeys.quests(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("LOCATION"),
        queryFn: () => campaignsApi.listCampaignLocations(campaignId!),
        queryKey: campaignsQueryKeys.locations(campaignId ?? "missing"),
      },
      {
        enabled: enabled && requiredTypes.includes("CHRONICLE_ENTRY"),
        queryFn: () => campaignsApi.listCampaignChronicle(campaignId!),
        queryKey: campaignsQueryKeys.chronicle(campaignId ?? "missing"),
      },
    ],
  });

  const queryData = useMemo<ReferenceQueries>(() => {
    const inventory = (queries[0].data ?? []).map((item) => ({ id: item.id, label: item.name }));
    const sessions = (queries[1].data ?? []).map((item) => ({ id: item.id, label: item.title }));
    const characters = (queries[2].data ?? []).map((item) => ({ id: item.id, label: item.name }));
    const npcs = (queries[3].data ?? []).map((item) => ({ id: item.id, label: item.name }));
    const quests = (queries[4].data ?? []).map((item) => ({ id: item.id, label: item.title }));
    const locations = (queries[5].data ?? []).map((item) => ({ id: item.id, label: item.name }));
    const chronicle = (queries[6].data ?? []).map((item) => ({ id: item.id, label: item.title }));

    return {
      characters,
      chronicle,
      inventory,
      locations,
      npcs,
      quests,
      sessions,
    };
  }, [queries]);

  const referenceMaps = useMemo(
    () => ({
      CHARACTER: new Map(queryData.characters.map((item) => [item.id, item.label])),
      CHRONICLE_ENTRY: new Map(queryData.chronicle.map((item) => [item.id, item.label])),
      ITEM: new Map(queryData.inventory.map((item) => [item.id, item.label])),
      LOCATION: new Map(queryData.locations.map((item) => [item.id, item.label])),
      NPC: new Map(queryData.npcs.map((item) => [item.id, item.label])),
      QUEST: new Map(queryData.quests.map((item) => [item.id, item.label])),
      SESSION: new Map(queryData.sessions.map((item) => [item.id, item.label])),
    }),
    [queryData],
  );

  return {
    getReferenceLabel(entityType: CampaignReferenceEntityType | null | undefined, entityId: string | null | undefined) {
      if (!entityType || !entityId) {
        return null;
      }

      if (entityType === "CAMPAIGN") {
        return campaignName ?? "Campaign";
      }

      return referenceMaps[entityType]?.get(entityId) ?? entityId;
    },
    getReferenceOptions(entityType: CampaignReferenceEntityType | "" | null | undefined): ReferenceOption[] {
      switch (entityType) {
        case "SESSION":
          return queryData.sessions;
        case "CHARACTER":
          return queryData.characters;
        case "NPC":
          return queryData.npcs;
        case "QUEST":
          return queryData.quests;
        case "LOCATION":
          return queryData.locations;
        case "CHRONICLE_ENTRY":
          return queryData.chronicle;
        case "ITEM":
          return queryData.inventory;
        case "CAMPAIGN":
          return campaignId && campaignName ? [{ id: campaignId, label: campaignName }] : [];
        default:
          return [];
      }
    },
    isError: queries.some((query) => query.isError),
    isLoading: queries.some((query) => query.isLoading),
  };
}
