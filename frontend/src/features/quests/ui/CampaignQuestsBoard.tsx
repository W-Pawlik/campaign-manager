import { Icon } from "@iconify/react";
import { alpha, Box, Button, Chip, Divider, Paper, Stack, Typography } from "@mui/material";

import type { CampaignQuestListItem } from "@/features/campaigns";
import { QuestPriorityIndicator } from "@/features/quests/ui/QuestPriorityIndicator";
import { QuestStatusChip } from "@/features/quests/ui/QuestStatusChip";
import { formatQuestTypeLabel, formatShortDate } from "@/features/quests/ui/questPageUi.utils";
import { EmptyState, SectionCard } from "@/shared/components";

type CampaignQuestsBoardProps = {
  canManageQuests: boolean;
  isSubmitting: boolean;
  onDeleteQuest: (questId: string) => void;
  onEditQuest: (questId: string) => void;
  onOpenDetails: (questId: string) => void;
  quests: CampaignQuestListItem[];
};

function ParchmentChip({
  color,
  label,
}: {
  color: "green" | "red" | "gold" | "blue";
  label: string;
}) {
  const tone =
    color === "green"
      ? { bg: "rgba(99, 133, 68, 0.22)", border: "rgba(99, 133, 68, 0.5)", text: "#58733a" }
      : color === "red"
        ? { bg: "rgba(149, 69, 53, 0.2)", border: "rgba(149, 69, 53, 0.48)", text: "#8a4334" }
        : color === "blue"
          ? { bg: "rgba(78, 108, 152, 0.18)", border: "rgba(78, 108, 152, 0.45)", text: "#3f5f96" }
          : { bg: "rgba(166, 128, 71, 0.16)", border: "rgba(166, 128, 71, 0.42)", text: "#6f5632" };

  return (
    <Chip
      label={label}
      size="small"
      sx={{
        bgcolor: tone.bg,
        borderColor: tone.border,
        color: tone.text,
        fontWeight: 700,
        height: 28,
      }}
      variant="outlined"
    />
  );
}

function getTypeTone(type: string): "green" | "red" | "gold" | "blue" {
  switch (type) {
    case "MAIN":
      return "red";
    case "SIDE":
      return "gold";
    case "FACTION":
      return "blue";
    default:
      return "gold";
  }
}

function getVisibilityTone(visibility: string): "green" | "red" | "gold" | "blue" {
  switch (visibility) {
    case "PUBLIC":
      return "gold";
    case "DISCOVERED":
      return "green";
    case "GM_ONLY":
      return "blue";
    default:
      return "gold";
  }
}

function QuestBoardCard({
  canManageQuests,
  isSubmitting,
  onDeleteQuest,
  onEditQuest,
  onOpenDetails,
  quest,
}: {
  canManageQuests: boolean;
  isSubmitting: boolean;
  onDeleteQuest: (questId: string) => void;
  onEditQuest: (questId: string) => void;
  onOpenDetails: (questId: string) => void;
  quest: CampaignQuestListItem;
}) {
  return (
    <Paper
      sx={{
        backgroundColor: "background.paper",
        borderColor: "divider",
        borderRadius: 2.5,
        minHeight: 332,
        p: 2,
        position: "relative",
      }}
      variant="outlined"
    >
      <Box
        sx={{
          background:
            "linear-gradient(180deg, rgba(212, 157, 85, 0.06) 0%, rgba(212, 157, 85, 0) 16%)",
          borderRadius: 2,
          inset: 0,
          pointerEvents: "none",
          position: "absolute",
        }}
      />

      <Stack spacing={1.6} sx={{ height: "100%", position: "relative" }}>
        <Stack spacing={1.1}>
          <Stack direction="row" spacing={1.25} sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Stack spacing={0.7} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={0.85} sx={{ alignItems: "center", color: "#c9ab77" }}>
                <Icon icon="game-icons:compass" style={{ fontSize: 15 }} />
                <Typography sx={{ letterSpacing: "0.08em", textTransform: "uppercase" }} variant="caption">
                  Quest entry
                </Typography>
              </Stack>
              <Typography
                sx={{
                  color: "#f3e5cc",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "1.55rem", md: "1.8rem" },
                  lineHeight: 1.04,
                }}
              >
                {quest.title}
              </Typography>
            </Stack>

            <Box sx={{ flexShrink: 0 }}>
              <QuestStatusChip status={quest.status} />
            </Box>
          </Stack>

          <Typography color="text.secondary" sx={{ minHeight: 44 }} variant="body2">
            {quest.description ?? "No description yet."}
          </Typography>

          <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
            <ParchmentChip color={getTypeTone(quest.type)} label={formatQuestTypeLabel(quest.type)} />
            <ParchmentChip
              color={getVisibilityTone(quest.visibility)}
              label={quest.visibility.replaceAll("_", " ")}
            />
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: "divider" }} />

        <QuestPriorityIndicator priority={quest.priority} />

        <Box
          sx={{
            display: "grid",
            gap: 1,
            gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))" },
          }}
        >
          <InfoCell
            icon="mdi:location"
            label="Location"
            value={quest.relatedLocationId ? "Linked location" : "No linked location"}
          />
          <InfoCell
            icon="game-icons:two-coins"
            label="Reward"
            value={quest.rewardDescription?.trim() || "No reward set"}
          />
          <InfoCell
            icon="tdesign:member-filled"
            label="Quest giver"
            value={quest.giverNpcId ? "Linked NPC" : "No quest giver"}
          />
          <InfoCell
            icon="solar:calendar-mark-bold"
            label="Updated"
            value={formatShortDate(quest.updatedAt)}
          />
        </Box>

        <Box sx={{ mt: "auto", pt: 0.4 }}>
          <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.8 }}>
            <Button
              onClick={() => onOpenDetails(quest.id)}
              size="small"
              startIcon={<Icon icon="solar:eye-linear" />}
              sx={{ minWidth: 0, px: 1.6 }}
              variant="contained"
            >
              Details
            </Button>
            {canManageQuests ? (
              <Button
                color="inherit"
                onClick={() => onEditQuest(quest.id)}
                size="small"
                startIcon={<Icon icon="solar:pen-2-linear" />}
                sx={{
                  borderColor: alpha("#c9ab77", 0.22),
                  color: "text.primary",
                  minWidth: 0,
                  px: 1.5,
                }}
                variant="outlined"
              >
                Edit
              </Button>
            ) : null}
            {canManageQuests ? (
              <Button
                color="inherit"
                disabled={isSubmitting}
                onClick={() => onDeleteQuest(quest.id)}
                size="small"
                startIcon={<Icon icon="solar:trash-bin-minimalistic-linear" />}
                sx={{
                  borderColor: "rgba(144, 73, 56, 0.34)",
                  color: "#c56e60",
                  minWidth: 0,
                  px: 1.5,
                }}
                variant="outlined"
              >
                Delete
              </Button>
            ) : null}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

function InfoCell({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Box
      sx={{
        backgroundColor: "rgba(255,255,255,0.02)",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 1.8,
        p: 1.1,
      }}
    >
      <Stack spacing={0.55}>
        <Stack direction="row" spacing={0.7} sx={{ alignItems: "center", color: "#c9ab77" }}>
          <Icon icon={icon} style={{ fontSize: 14 }} />
          <Typography color="inherit" variant="caption">
            {label}
          </Typography>
        </Stack>
        <Typography color="text.secondary" sx={{ lineHeight: 1.25 }} variant="body2">
          {value}
        </Typography>
      </Stack>
    </Box>
  );
}

export function CampaignQuestsBoard({
  canManageQuests,
  isSubmitting,
  onDeleteQuest,
  onEditQuest,
  onOpenDetails,
  quests,
}: CampaignQuestsBoardProps) {
  return (
    <SectionCard title="Quest board">
      {quests.length === 0 ? (
        <EmptyState
          description="Create the first quest or loosen the filters to see more hooks here."
          title="No quests match the current filters"
        />
      ) : (
        <Box
          sx={{
            display: "grid",
            gap: 1.75,
            gridTemplateColumns: {
              xs: "1fr",
              md: "repeat(2, minmax(0, 1fr))",
              xl: "repeat(3, minmax(0, 1fr))",
            },
          }}
        >
          {quests.map((quest) => (
            <QuestBoardCard
              canManageQuests={canManageQuests}
              isSubmitting={isSubmitting}
              key={quest.id}
              onDeleteQuest={onDeleteQuest}
              onEditQuest={onEditQuest}
              onOpenDetails={onOpenDetails}
              quest={quest}
            />
          ))}
        </Box>
      )}
    </SectionCard>
  );
}
