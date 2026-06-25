import { Icon } from "@iconify/react";
import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignQuestDetails } from "@/features/quests/model/quest.types";
import { QuestPriorityIndicator } from "@/features/quests/ui/QuestPriorityIndicator";
import { QuestStatusChip } from "@/features/quests/ui/QuestStatusChip";
import {
  formatQuestTypeLabel,
  formatQuestVisibilityLabel,
  getQuestObjectiveStats,
} from "@/features/quests/ui/questPageUi.utils";

type CampaignQuestsFeaturedSectionProps = {
  canManageQuests: boolean;
  isSubmitting: boolean;
  onEditQuest: (questId: string) => void;
  onOpenDetails: (questId: string) => void;
  onDeleteQuest: (questId: string) => void;
  quest: CampaignQuestDetails | null;
};

function ObjectiveRow({ done, title }: { done: boolean; title: string }) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Icon
        icon={done ? "solar:check-circle-bold" : "solar:shield-warning-linear"}
        style={{ color: done ? "#74b76b" : "#d2b277", fontSize: 18 }}
      />
      <Typography color={done ? "text.primary" : "text.secondary"} variant="body2">
        {title}
      </Typography>
    </Stack>
  );
}

export function CampaignQuestsFeaturedSection({
  canManageQuests,
  isSubmitting,
  onDeleteQuest,
  onEditQuest,
  onOpenDetails,
  quest,
}: CampaignQuestsFeaturedSectionProps) {
  if (!quest) {
    return (
      <Paper sx={{ borderRadius: 2.5, p: 3 }} variant="outlined">
        <Stack spacing={1}>
          <Typography
            sx={{ color: "#f3e5cc", fontFamily: '"Georgia", "Times New Roman", serif', fontSize: "2rem" }}
          >
            Current quest spotlight
          </Typography>
          <Typography color="text.secondary">
            Create the first quest to start tracking your party&apos;s current objectives.
          </Typography>
        </Stack>
      </Paper>
    );
  }

  const objectiveStats = getQuestObjectiveStats(quest);
  const sortedObjectives = quest.objectives.slice().sort((left, right) => left.sortOrder - right.sortOrder);

  return (
    <Paper
      sx={{
        backgroundColor: "background.paper",
        borderRadius: 2.5,
        p: { xs: 2.5, md: 3 },
      }}
      variant="outlined"
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2.5}
          sx={{ justifyContent: "space-between" }}
        >
          <Stack spacing={1.25} sx={{ maxWidth: 760 }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#d7b06b" }}>
              <Icon icon="game-icons:info-board" style={{ fontSize: 18 }} />
              <Typography sx={{ letterSpacing: "0.08em", textTransform: "uppercase" }} variant="body2">
                Current quest
              </Typography>
            </Stack>

            <Typography
              sx={{
                color: "#f3e5cc",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: { xs: "2rem", md: "3rem" },
                lineHeight: 0.98,
              }}
            >
              {quest.title}
            </Typography>

            <Typography color="text.secondary" variant="body1">
              {quest.description ?? "No description yet."}
            </Typography>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
              <QuestStatusChip status={quest.status} />
              <Chip label={formatQuestTypeLabel(quest.type)} size="small" variant="outlined" />
              <Chip label={formatQuestVisibilityLabel(quest.visibility)} size="small" variant="outlined" />
            </Stack>
          </Stack>

          <Stack spacing={1.25} sx={{ minWidth: { lg: 240 } }}>
            <QuestPriorityIndicator priority={quest.priority} />
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#c9ab77" }}>
              <Icon icon="solar:checklist-minimalistic-bold" style={{ fontSize: 18 }} />
              <Typography variant="body2">
                {objectiveStats.done}/{objectiveStats.total} objectives resolved
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#c9ab77" }}>
              <Icon icon="solar:gift-bold" style={{ fontSize: 18 }} />
              <Typography variant="body2">
                {quest.rewardDescription?.trim() || "Rewards still to be assigned"}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction={{ xs: "column", xl: "row" }} spacing={2}>
          <Paper
            sx={{
              bgcolor: "rgba(11, 14, 20, 0.52)",
              borderRadius: 2.25,
              flex: 1,
              p: 2,
            }}
            variant="outlined"
          >
            <Stack spacing={1.25}>
              <Typography color="#e3bd7b" variant="h6">
                Active objectives
              </Typography>
              {sortedObjectives.length > 0 ? (
                sortedObjectives.slice(0, 4).map((objective) => (
                  <ObjectiveRow
                    done={objective.status === "DONE"}
                    key={objective.id}
                    title={objective.title}
                  />
                ))
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No objectives have been added yet.
                </Typography>
              )}
            </Stack>
          </Paper>

          <Paper
            sx={{
              bgcolor: "rgba(11, 14, 20, 0.52)",
              borderRadius: 2.25,
              p: 2,
              width: { xs: "100%", xl: 320 },
            }}
            variant="outlined"
          >
            <Stack spacing={1.25}>
              <Typography color="#e3bd7b" variant="h6">
                GM note
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {quest.gmNotes?.trim() || "No GM notes for this quest yet."}
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <Button onClick={() => onOpenDetails(quest.id)} startIcon={<Icon icon="solar:eye-linear" />} variant="contained">
            Open details
          </Button>
          {canManageQuests ? (
            <Button color="inherit" onClick={() => onEditQuest(quest.id)} startIcon={<Icon icon="solar:pen-2-linear" />} variant="outlined">
              Edit quest
            </Button>
          ) : null}
          {canManageQuests ? (
            <Button
              color="inherit"
              disabled={isSubmitting}
              onClick={() => onDeleteQuest(quest.id)}
              startIcon={<Icon icon="solar:trash-bin-minimalistic-linear" />}
              sx={{ borderColor: "rgba(212, 91, 73, 0.34)", color: "#d77d6c" }}
              variant="outlined"
            >
              Delete quest
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Paper>
  );
}
