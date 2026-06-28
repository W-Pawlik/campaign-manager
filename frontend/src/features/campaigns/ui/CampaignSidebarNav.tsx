import {
  Box,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import {
  CampaignWorkspaceIcon,
  type CampaignWorkspaceIconKey,
} from "@/features/campaigns/ui/CampaignWorkspaceIcon";

type CampaignSidebarNavProps = {
  collapsed?: boolean;
  campaignId: string | null;
};

const campaignNavItems = [
  {
    icon: "overview",
    label: "Overview",
    path: (campaignId: string) => appPaths.campaign(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "sessions",
    label: "Sessions",
    path: (campaignId: string) => appPaths.campaignSessions(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "characters",
    label: "Characters",
    path: (campaignId: string) => appPaths.campaignCharacters(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "quests",
    label: "Quests",
    path: (campaignId: string) => appPaths.campaignQuests(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "chronicle",
    label: "Chronicle",
    path: (campaignId: string) => appPaths.campaignChronicle(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "notes",
    label: "Notes",
    path: (campaignId: string) => appPaths.campaignNotes(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "npcs",
    label: "NPCs",
    path: (campaignId: string) => appPaths.campaignNpcs(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "locations",
    label: "Locations",
    path: (campaignId: string) => appPaths.campaignLocations(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "monsters",
    label: "Monsters",
    path: (campaignId: string) => appPaths.campaignMonsters(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "items",
    label: "Items",
    path: (campaignId: string) => appPaths.campaignInventory(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "fightTracker",
    label: "Fight tracker",
    path: (campaignId: string) => appPaths.campaignFightTracker(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "members",
    label: "Members",
    path: (campaignId: string) => appPaths.campaignMembers(campaignId),
    section: "management",
    implemented: true,
  },
  { icon: "settings", label: "Settings", section: "management", implemented: false },
] as const;

function hasPath(
  item: (typeof campaignNavItems)[number],
): item is Extract<(typeof campaignNavItems)[number], { path: (campaignId: string) => string }> {
  return "path" in item;
}

function SidebarItemContent({
  collapsed,
  icon,
  label,
  secondary,
}: {
  collapsed: boolean;
  icon: CampaignWorkspaceIconKey;
  label: string;
  secondary?: string;
}) {
  if (collapsed) {
    return (
      <Tooltip placement="right" title={secondary ? `${label} · ${secondary}` : label}>
        <Stack
          sx={{
            alignItems: "center",
            justifyContent: "center",
            minHeight: 22,
            width: "100%",
          }}
        >
          <CampaignWorkspaceIcon icon={icon} size={20} />
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
      <Box
        sx={{
          alignItems: "center",
          color: "primary.light",
          display: "inline-flex",
          justifyContent: "center",
          minWidth: 22,
        }}
      >
        <CampaignWorkspaceIcon icon={icon} size={20} />
      </Box>
      <ListItemText primary={label} secondary={secondary} />
    </Stack>
  );
}

function itemSx(collapsed: boolean) {
  return {
    alignItems: "center",
    border: "1px solid transparent",
    borderRadius: 2,
    mb: 0.5,
    justifyContent: collapsed ? "center" : "flex-start",
    minHeight: 48,
    px: collapsed ? 1 : 2,
    "&.Mui-selected": {
      background:
        "linear-gradient(90deg, rgba(230, 22, 26, 0.24) 0%, rgba(230, 22, 26, 0.08) 100%)",
      borderColor: "rgba(230, 22, 26, 0.32)",
    },
    "&.Mui-selected:hover": {
      background:
        "linear-gradient(90deg, rgba(230, 22, 26, 0.28) 0%, rgba(230, 22, 26, 0.12) 100%)",
    },
  };
}

export function CampaignSidebarNav({ campaignId, collapsed = false }: CampaignSidebarNavProps) {
  const location = useLocation();
  const workspaceItems = campaignNavItems.filter((item) => item.section === "workspace");
  const managementItems = campaignNavItems.filter((item) => item.section === "management");

  if (!campaignId) {
    return (
      <Stack spacing={1.5}>
        <Typography color="text.secondary" variant="body2">
          Campaign navigation
        </Typography>
        <Typography color="text.secondary" variant="caption">
          Select a campaign from the dashboard or the switcher to enter its workspace.
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      <List disablePadding>
        {workspaceItems.map((item) => {
          const href = hasPath(item) ? item.path(campaignId) : undefined;
          const selected = href ? location.pathname === href : false;

          return (
            <ListItemButton
              key={item.label}
              component={href && item.implemented ? RouterLink : "button"}
              disabled={!item.implemented}
              selected={selected}
              sx={itemSx(collapsed)}
              to={href}
            >
              <SidebarItemContent
                collapsed={collapsed}
                icon={item.icon}
                label={item.label}
                secondary={!item.implemented ? "Coming soon" : undefined}
              />
            </ListItemButton>
          );
        })}
      </List>

      <Divider />

      {!collapsed ? (
        <Typography color="text.secondary" sx={{ px: 1 }} variant="caption">
          Campaign management
        </Typography>
      ) : null}

      <List disablePadding>
        {managementItems.map((item) => {
          const href = hasPath(item) ? item.path(campaignId) : undefined;
          const selected = href ? location.pathname === href : false;

          return (
            <ListItemButton
              key={item.label}
              component={href && item.implemented ? RouterLink : "button"}
              disabled={!item.implemented}
              selected={selected}
              sx={itemSx(collapsed)}
              to={href}
            >
              <SidebarItemContent
                collapsed={collapsed}
                icon={item.icon}
                label={item.label}
                secondary={!item.implemented ? "Coming soon" : undefined}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Stack>
  );
}
