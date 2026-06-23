import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi, campaignsQueryKeys } from "@/features/campaigns";
import { locationsApi } from "@/features/locations/api/locationsApi";
import type { CreateLocationPayload, UpdateLocationPayload } from "@/features/locations/model/location.types";

export const locationsQueryKeys = {
  all: ["locations"] as const,
  details: (campaignId: string, locationId: string) => [...locationsQueryKeys.all, campaignId, locationId] as const,
  list: (campaignId: string) => campaignsQueryKeys.locations(campaignId),
};

function invalidateLocationQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  locationId?: string,
) {
  queryClient.invalidateQueries({ queryKey: locationsQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (locationId) {
    queryClient.invalidateQueries({ queryKey: locationsQueryKeys.details(campaignId, locationId) });
  }
}

export function useCampaignLocationsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignLocations(campaignId!),
    queryKey: locationsQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useLocationDetailsQuery(campaignId: string | undefined, locationId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && locationId),
    queryFn: () => locationsApi.getLocationDetails(campaignId!, locationId!),
    queryKey: locationsQueryKeys.details(campaignId ?? "missing", locationId ?? "missing"),
  });
}

export function useCreateLocationMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateLocationPayload) => locationsApi.createLocation(campaignId!, payload),
    onSuccess: (location) => {
      if (campaignId) {
        invalidateLocationQueries(queryClient, campaignId, location.id);
      }
    },
  });
}

export function useUpdateLocationMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { locationId: string; payload: UpdateLocationPayload }) =>
      locationsApi.updateLocation(campaignId!, input.locationId, input.payload),
    onSuccess: (location) => {
      if (campaignId) {
        invalidateLocationQueries(queryClient, campaignId, location.id);
      }
    },
  });
}

export function useDeleteLocationMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (locationId: string) => locationsApi.deleteLocation(campaignId!, locationId),
    onSuccess: (_data, locationId) => {
      if (campaignId) {
        invalidateLocationQueries(queryClient, campaignId, locationId);
      }
    },
  });
}
