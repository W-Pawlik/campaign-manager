import { Icon } from "@iconify/react";
import { Box, Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

import type { CampaignInventoryListItem, CampaignNote } from "@/features/campaigns";

import { formatShortDate } from "@/features/quests/ui/questPageUi.utils";

type CampaignQuestsSidebarProps = {
  notes: CampaignNote[];
  rewardQuestTitle: string | null;
  rewards: CampaignInventoryListItem[];
};

function SidebarPanel({
  children,
  icon,
  title,
}: {
  children: ReactNode;
  icon: string;
  title: string;
}) {
  return (
    <Paper sx={{ borderRadius: 2.5, p: 2.25 }} variant="outlined">
      <Stack spacing={1.5}>
        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Icon icon={icon} style={{ color: "#d7b06b", fontSize: 18 }} />
          <Typography color="#f3e5cc" variant="h6">
            {title}
          </Typography>
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

export function CampaignQuestsSidebar({
  notes,
  rewardQuestTitle,
  rewards,
}: CampaignQuestsSidebarProps) {
  return (
    <Stack spacing={2}>
      <SidebarPanel icon="streamline-plump:feather-pen-solid" title="GM quick notes">
        {notes.length > 0 ? (
          <Stack spacing={1.25}>
            {notes.map((note) => (
              <Box
                key={note.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.25,
                }}
              >
                <Stack spacing={0.5}>
                  <Typography color="#f3e5cc" variant="body2">
                    {note.title?.trim() || "Untitled note"}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {note.content}
                  </Typography>
                  <Typography color="text.disabled" variant="caption">
                    Updated {formatShortDate(note.updatedAt)}
                  </Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">
            No GM notes linked to the current quest yet.
          </Typography>
        )}
      </SidebarPanel>

      <SidebarPanel icon="game-icons:two-coins" title="Rewards to assign">
        <Typography color="text.secondary" variant="body2">
          {rewardQuestTitle
            ? `Items still attached to ${rewardQuestTitle}.`
            : "No quest selected for unassigned rewards."}
        </Typography>

        {rewards.length > 0 ? (
          <Stack spacing={1.1}>
            {rewards.map((reward) => (
              <Box
                key={reward.id}
                sx={{
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 1.25,
                }}
              >
                <Stack direction="row" spacing={1.1} sx={{ alignItems: "flex-start" }}>
                  <Icon
                    icon={
                      reward.isMagical
                        ? "solar:magic-stick-3-bold"
                        : reward.type === "TREASURE"
                          ? "game-icons:two-coins"
                          : reward.type === "QUEST_ITEM"
                            ? "solar:document-text-bold"
                            : "solar:backpack-bold"
                    }
                    style={{ color: "#d7b06b", fontSize: 18, marginTop: 2 }}
                  />
                  <Stack spacing={0.4} sx={{ minWidth: 0 }}>
                    <Typography color="#f3e5cc" variant="body2">
                      {reward.name}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      {reward.quantity}x {reward.type.replaceAll("_", " ")}
                      {reward.rarity ? ` • ${reward.rarity.replaceAll("_", " ")}` : ""}
                    </Typography>
                    <Typography color="text.disabled" variant="caption">
                      {reward.valueAmount && reward.valueCurrency
                        ? `${reward.valueAmount} ${reward.valueCurrency}`
                        : "No value set"}
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : (
          <Typography color="text.secondary" variant="body2">
            No unassigned quest rewards were found.
          </Typography>
        )}
      </SidebarPanel>
    </Stack>
  );
}
