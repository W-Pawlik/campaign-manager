import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useMemo, useState, type MouseEvent } from "react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";

import { appConstants } from "@/app/config/constants";
import { appPaths } from "@/app/router/paths";
import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { logout } from "@/features/auth";

function topbarNavButtonSx(active: boolean) {
  return {
    borderRadius: 0,
    color: active ? "#d6b16a" : "rgba(214, 201, 176, 0.82)",
    minHeight: 48,
    minWidth: 116,
    opacity: 1,
    position: "relative",
    px: 1.75,
    "&::before": active
      ? {
          background:
            "linear-gradient(90deg, rgba(255, 34, 34, 0) 0%, rgba(255, 66, 66, 0.92) 18%, rgba(255, 66, 66, 0.92) 82%, rgba(255, 34, 34, 0) 100%)",
          borderRadius: 999,
          bottom: -7,
          content: '""',
          height: 3,
          left: 10,
          position: "absolute",
          right: 10,
        }
      : undefined,
    "&::after": active
      ? {
          background:
            "linear-gradient(180deg, rgba(255, 138, 91, 1) 0%, rgba(182, 23, 23, 1) 100%)",
          borderBottomLeftRadius: 2,
          borderBottomRightRadius: 2,
          bottom: -11,
          content: '""',
          height: 6,
          left: "50%",
          position: "absolute",
          transform: "translateX(-50%) rotate(45deg)",
          width: 6,
        }
      : undefined,
    "&:hover": {
      backgroundColor: "transparent",
      color: active ? "#e1c27d" : "#f3e8d1",
    },
  };
}

export function AppTopbar() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppSelector((state) => state.auth.currentUser);
  const [menuAnchorEl, setMenuAnchorEl] = useState<HTMLElement | null>(null);

  const isCampaignsSelected =
    location.pathname === appPaths.home || location.pathname.startsWith("/campaigns/");
  const isItemsSelected = location.pathname === appPaths.items;
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
                  alignItems: "center",
                  color: "inherit",
                  display: "inline-flex",
                  flexShrink: 0,
                  gap: { xs: 1, sm: 1.25 },
                  textDecoration: "none",
                }}
                to={appPaths.home}
              >
                <Box
                  alt={appConstants.appName}
                  component="img"
                  src="/images/campaign_manager_icon.svg"
                  sx={{
                    display: "block",
                    height: { xs: 34, sm: 42 },
                    objectFit: "contain",
                    width: { xs: 34, sm: 42 },
                  }}
                />
                <Stack spacing={0.1} sx={{ lineHeight: 1 }}>
                  <Typography
                    sx={{
                      color: "#d8b070",
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontSize: { xs: "0.78rem", sm: "1rem" },
                      fontWeight: 700,
                      letterSpacing: { xs: "0.08em", sm: "0.11em" },
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    CAMPAIGN
                  </Typography>
                  <Typography
                    sx={{
                      color: "#efe3c4",
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontSize: { xs: "0.74rem", sm: "0.96rem" },
                      fontWeight: 700,
                      letterSpacing: { xs: "0.13em", sm: "0.16em" },
                      lineHeight: 1,
                      whiteSpace: "nowrap",
                    }}
                  >
                    MANAGER
                  </Typography>
                </Stack>
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
                <Box sx={{ alignItems: "center", display: "flex", gap: 0.5 }}>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    sx={topbarNavButtonSx(isCampaignsSelected)}
                    to={appPaths.home}
                  >
                    Campaigns
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    sx={topbarNavButtonSx(isItemsSelected)}
                    to={appPaths.items}
                  >
                    Items
                  </Button>
                  <Button
                    color="inherit"
                    component={RouterLink}
                    sx={topbarNavButtonSx(isMonstersSelected)}
                    to={appPaths.monsters}
                  >
                    Monsters
                  </Button>
                </Box>
              </Box>

              <Box
                sx={{
                  alignItems: "center",
                  display: "flex",
                  gap: 1.5,
                  justifyContent: "flex-end",
                  ml: "auto",
                }}
              >
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
