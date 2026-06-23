import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type {
  ChangeCurrentUserPasswordPayload,
  CurrentUserProfile,
  UpdateCurrentUserProfilePayload,
} from "@/features/settings/model/settings.types";

export const settingsApi = {
  async changeCurrentUserPassword(payload: ChangeCurrentUserPasswordPayload): Promise<void> {
    await httpClient.patch(apiEndpoints.users.password, payload);
  },

  async getCurrentUserProfile(): Promise<CurrentUserProfile> {
    const response = await httpClient.get<CurrentUserProfile>(apiEndpoints.users.current);

    return response.data;
  },

  async updateCurrentUserProfile(
    payload: UpdateCurrentUserProfilePayload,
  ): Promise<CurrentUserProfile> {
    const response = await httpClient.patch<CurrentUserProfile>(apiEndpoints.users.current, payload);

    return response.data;
  },
} as const;
