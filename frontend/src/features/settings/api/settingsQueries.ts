import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { settingsApi } from "@/features/settings/api/settingsApi";
import type {
  ChangeCurrentUserPasswordPayload,
  UpdateCurrentUserProfilePayload,
} from "@/features/settings/model/settings.types";

export const settingsQueryKeys = {
  all: ["settings"] as const,
  currentUserProfile: () => [...settingsQueryKeys.all, "current-user-profile"] as const,
};

export function useCurrentUserProfileQuery() {
  return useQuery({
    queryFn: settingsApi.getCurrentUserProfile,
    queryKey: settingsQueryKeys.currentUserProfile(),
  });
}

export function useUpdateCurrentUserProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateCurrentUserProfilePayload) =>
      settingsApi.updateCurrentUserProfile(payload),
    onSuccess: (profile) => {
      queryClient.setQueryData(settingsQueryKeys.currentUserProfile(), profile);
    },
  });
}

export function useChangeCurrentUserPasswordMutation() {
  return useMutation({
    mutationFn: (payload: ChangeCurrentUserPasswordPayload) =>
      settingsApi.changeCurrentUserPassword(payload),
  });
}
