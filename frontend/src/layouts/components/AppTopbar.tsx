import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { appConstants } from "@/app/config/constants";
import { appPaths } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/features/auth";

export function AppTopbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const isCampaignsSelected = location.pathname === appPaths.home;
  const isMonstersSelected = location.pathname === appPaths.monsters;
  const avatarLabel = useMemo(() => {
    const source = currentUser?.email?.trim();

    if (!source) {
      return "U";
    }

    return source.charAt(0).toUpperCase();
  }, [currentUser?.email]);

  const isUserMenuOpen = menuAnchorEl !== null;

  const handleOpenUserMenu = (event: MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setMenuAnchorEl(null);
  };

  return (
    <>
      <AppBar elevation={0} position="fixed" sx={{ left: 0, width: "100%" }}>
        <Toolbar>
          <Box sx={{ width: "100%" }}>
            <Box
              sx={{
                alignItems: "center",
                display: "flex",
                gap: 2,
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Box
                component={RouterLink}
                sx={{
                  color: "inherit",
                  flexShrink: 0,
                  textDecoration: "none",
                }}
                to={appPaths.home}
              >
                <Typography component="span" variant="h6">
                  {appConstants.appName}
                </Typography>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  left: "50%",
                  position: "absolute",
                  transform: "translateX(-50%)",
                }}
              >
                <Box sx={{ alignItems: "center", display: "flex", gap: 1.5 }}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    sx={{ opacity: isCampaignsSelected ? 1 : 0.82 }}
                    to={appPaths.home}
                  >
                    Campaigns
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    sx={{ opacity: isMonstersSelected ? 1 : 0.82 }}
                    to={appPaths.monsters}
                  >
                    Monsters
                  </Button>
                </Box>
              </Box>

              <Box sx={{ alignItems: "center", display: "flex", gap: 1.5, justifyContent: "flex-end", ml: "auto" }}>
                <IconButton color="inherit" onClick={handleOpenUserMenu}>
                  <Avatar
                    sx={{
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      height: 36,
                      width: 36,
                    }}
                  >
                    {avatarLabel}
                  </Avatar>
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Menu
        anchorEl={menuAnchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={handleCloseUserMenu}
        open={isUserMenuOpen}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            navigate(appPaths.settings);
          }}
        >
          Settings
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleCloseUserMenu();
            void dispatch(logout());
          }}
        >
          Log out
        </MenuItem>
      </Menu>
    </>
  );
}
