import { useQuery } from "@tanstack/react-query";

import { usersApi } from "@/features/users/api/usersApi";

export const usersQueryKeys = {
  all: ["users"] as const,
  search: (query: string) => [...usersQueryKeys.all, "search", query] as const,
};

export function useUserSearchQuery(query: string) {
  const normalizedQuery = query.trim();

  return useQuery({
    enabled: normalizedQuery.length >= 2,
    queryFn: () => usersApi.searchUsers(normalizedQuery),
    queryKey: usersQueryKeys.search(normalizedQuery),
  });
}
