import { AppBar, Box, Drawer, Toolbar, Typography } from "@mui/material";
import { Outlet } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { appConstants } from "@/app/config/constants";
import { fantasyTokens } from "@/shared/theme";

export function AppLayout() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const sidebarWidth = sidebarOpen ? fantasyTokens.layout.sidebarWidth : 0;

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <AppBar
        elevation={0}
        position="fixed"
        sx={{ ml: `${sidebarWidth}px`, width: `calc(100% - ${sidebarWidth}px)` }}
      >
        <Toolbar>
          <Typography component="span" variant="h6">
            {appConstants.appName}
          </Typography>
        </Toolbar>
      </AppBar>

      <Drawer
        open={sidebarOpen}
        variant="persistent"
        sx={{
          flexShrink: 0,
          width: sidebarWidth,
          "& .MuiDrawer-paper": {
            width: fantasyTokens.layout.sidebarWidth,
          },
        }}
      >
        <Toolbar />
        <Box sx={{ p: 2 }}>
          <Typography color="text.secondary" variant="body2">
            Navigation
          </Typography>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          p: { xs: 2, md: 3 },
          pt: {
            xs: `calc(${fantasyTokens.layout.topbarHeight}px + 16px)`,
            md: `calc(${fantasyTokens.layout.topbarHeight}px + 24px)`,
          },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}
