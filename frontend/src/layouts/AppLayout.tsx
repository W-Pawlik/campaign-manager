import { Box } from "@mui/material";
import { Outlet, useLocation, useMatch } from "react-router-dom";
import { useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import {
  hydrateLastActiveCampaignId,
  setLastActiveCampaignId,
} from "@/app/store/slices/workspaceSlice";
import { CampaignSidebar } from "@/layouts/components/CampaignSidebar";
import { AppTopbar } from "@/layouts/components/AppTopbar";
import { readLocalStorage, writeLocalStorage } from "@/core/storage/localStorage";
import { fantasyTokens } from "@/shared/theme";

const lastActiveCampaignStorageKey = "workspace:last-active-campaign-id";

export function AppLayout() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const campaignOverviewMatch = useMatch("/campaigns/:campaignId");
  const campaignNestedMatch = useMatch("/campaigns/:campaignId/*");
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const lastActiveCampaignId = useAppSelector((state) => state.workspace.lastActiveCampaignId);
  const activeCampaignId =
    campaignNestedMatch?.params.campaignId ?? campaignOverviewMatch?.params.campaignId ?? null;
  const sidebarWidth = activeCampaignId
    ? sidebarOpen
      ? fantasyTokens.layout.sidebarWidth
      : fantasyTokens.layout.sidebarCollapsedWidth
    : 0;

  useEffect(() => {
    if (lastActiveCampaignId !== null) {
      return;
    }

    const storedCampaignId = readLocalStorage<string>(lastActiveCampaignStorageKey);

    dispatch(hydrateLastActiveCampaignId(storedCampaignId));
  }, [dispatch, lastActiveCampaignId]);

  useEffect(() => {
    if (!activeCampaignId) {
      return;
    }

    dispatch(setLastActiveCampaignId(activeCampaignId));
    writeLocalStorage(lastActiveCampaignStorageKey, activeCampaignId);
  }, [activeCampaignId, dispatch]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppTopbar />

      <CampaignSidebar campaignId={activeCampaignId} sidebarOpen={sidebarOpen} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          minHeight: "100vh",
          ml: { md: `${sidebarWidth}px` },
          px: activeCampaignId ? { xs: 2, md: 2 } : { xs: 2, md: 3 },
          pb: { xs: 2, md: 3 },
          pt: {
            xs: `calc(${fantasyTokens.layout.topbarHeight}px + 16px)`,
            md: `calc(${fantasyTokens.layout.topbarHeight}px + 20px)`,
          },
        }}
      >
        <Box key={location.pathname} sx={{ animation: "main-shell-enter 220ms ease" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
