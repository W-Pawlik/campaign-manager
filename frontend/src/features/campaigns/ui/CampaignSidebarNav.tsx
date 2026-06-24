import {
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

type CampaignSidebarNavProps = {
  collapsed?: boolean;
  campaignId: string | null;
};

const campaignNavItems = [
  {
    icon: "OV",
    label: "Overview",
    path: (campaignId: string) => appPaths.campaign(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "SE",
    label: "Sessions",
    path: (campaignId: string) => appPaths.campaignSessions(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "CH",
    label: "Characters",
    path: (campaignId: string) => appPaths.campaignCharacters(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "QU",
    label: "Quests",
    path: (campaignId: string) => appPaths.campaignQuests(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "CR",
    label: "Chronicle",
    path: (campaignId: string) => appPaths.campaignChronicle(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "NO",
    label: "Notes",
    path: (campaignId: string) => appPaths.campaignNotes(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "NP",
    label: "NPCs",
    path: (campaignId: string) => appPaths.campaignNpcs(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "LO",
    label: "Locations",
    path: (campaignId: string) => appPaths.campaignLocations(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "MO",
    label: "Monsters",
    path: (campaignId: string) => appPaths.campaignMonsters(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "IN",
    label: "Inventory",
    path: (campaignId: string) => appPaths.campaignInventory(campaignId),
    section: "workspace",
    implemented: true,
  },
  {
    icon: "ME",
    label: "Members",
    path: (campaignId: string) => appPaths.campaignMembers(campaignId),
    section: "management",
    implemented: true,
  },
  { icon: "ST", label: "Settings", section: "management", implemented: false },
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
  icon: string;
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
          <Typography sx={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.08em" }}>
            {icon}
          </Typography>
        </Stack>
      </Tooltip>
    );
  }

  return <ListItemText primary={label} secondary={secondary} />;
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
              to={href}
              sx={{
                alignItems: "center",
                borderRadius: 1.5,
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                minHeight: 48,
                px: collapsed ? 1 : 2,
              }}
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
              to={href}
              sx={{
                alignItems: "center",
                borderRadius: 1.5,
                mb: 0.5,
                justifyContent: collapsed ? "center" : "flex-start",
                minHeight: 48,
                px: collapsed ? 1 : 2,
              }}
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
