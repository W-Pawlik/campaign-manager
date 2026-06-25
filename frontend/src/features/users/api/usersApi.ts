import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { UserLookupItem } from "@/features/users/model/user.types";

export const usersApi = {
  async searchUsers(query: string): Promise<UserLookupItem[]> {
    const response = await httpClient.get<UserLookupItem[]>(apiEndpoints.users.search, {
      params: {
        limit: 8,
        query,
      },
    });

    return response.data;
  },
} as const;
