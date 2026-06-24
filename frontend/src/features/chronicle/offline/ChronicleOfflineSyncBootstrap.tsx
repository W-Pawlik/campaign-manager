import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import { campaignsQueryKeys } from "@/features/campaigns";
import { chronicleQueryKeys } from "@/features/chronicle/api/chronicleQueries";
import { chronicleOfflineService } from "@/features/chronicle/offline/chronicleOfflineService";
import { getAccessToken } from "@/core/auth/authSession";

export function ChronicleOfflineSyncBootstrap() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const handleOnline = async () => {
      if (!getAccessToken()) {
        return;
      }

      await chronicleOfflineService.syncAllPending();
      await queryClient.invalidateQueries({ queryKey: chronicleQueryKeys.all });
      await queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.all });
    };

    void handleOnline();
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [queryClient]);

  return null;
}
