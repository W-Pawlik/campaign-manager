import { Box, Divider, IconButton, Stack, Tooltip, Typography } from "@mui/material";

import { fantasyTokens } from "@/shared/theme";
import { CampaignSidebarNav } from "@/features/campaigns";
import { useAppDispatch } from "@/app/store/hooks";
import { toggleSidebar } from "@/app/store/slices/uiSlice";

type CampaignSidebarProps = {
  campaignId: string | null;
  sidebarOpen: boolean;
};

export function CampaignSidebar({ campaignId, sidebarOpen }: CampaignSidebarProps) {
  const dispatch = useAppDispatch();

  if (!campaignId) {
    return null;
  }

  const sidebarWidth = sidebarOpen
    ? fantasyTokens.layout.sidebarWidth
    : fantasyTokens.layout.sidebarCollapsedWidth;

  return (
    <Box
      component="aside"
      sx={{
        bgcolor: "background.paper",
        borderRight: 1,
        borderColor: "divider",
        height: `calc(100vh - ${fantasyTokens.layout.topbarHeight}px)`,
        left: 0,
        overflow: "hidden",
        position: "fixed",
        top: fantasyTokens.layout.topbarHeight,
        width: sidebarWidth,
        zIndex: 1100,
      }}
    >
      <Stack spacing={2} sx={{ height: "100%", p: sidebarOpen ? 2 : 1.5 }}>
        <Stack
          direction={sidebarOpen ? "row" : "column"}
          spacing={1}
          sx={{
            alignItems: "center",
            justifyContent: sidebarOpen ? "space-between" : "center",
          }}
        >
          {sidebarOpen ? (
            <Typography color="text.secondary" variant="body2">
              Campaign workspace
            </Typography>
          ) : null}
          <Tooltip title={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
            <IconButton
              color="inherit"
              onClick={() => dispatch(toggleSidebar())}
              size="small"
              sx={{
                border: 1,
                borderColor: "divider",
                borderRadius: 2,
                height: 32,
                width: 32,
              }}
            >
              {sidebarOpen ? "<" : ">"}
            </IconButton>
          </Tooltip>
        </Stack>

        <Divider />

        <Box sx={{ flexGrow: 1, minHeight: 0, overflowY: "auto" }}>
          <CampaignSidebarNav campaignId={campaignId} collapsed={!sidebarOpen} />
        </Box>
      </Stack>
    </Box>
  );
}
