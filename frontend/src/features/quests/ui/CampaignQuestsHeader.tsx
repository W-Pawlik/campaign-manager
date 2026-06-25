import { Icon } from "@iconify/react";
import { Box, Button, Stack, Typography } from "@mui/material";

type CampaignQuestsHeaderProps = {
  canManageQuests: boolean;
  onCreateQuest: () => void;
};

export function CampaignQuestsHeader({
  canManageQuests,
  onCreateQuest,
}: CampaignQuestsHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", lg: "row" }}
      spacing={2.5}
      sx={{ alignItems: { lg: "center" }, justifyContent: "space-between" }}
    >
      <Stack direction="row" spacing={1.5} sx={{ alignItems: "flex-start" }}>
        <Box
          sx={{
            alignItems: "center",
            border: "1px solid rgba(208, 170, 108, 0.22)",
            borderRadius: "50%",
            color: "#d7b06b",
            display: "inline-flex",
            height: 54,
            justifyContent: "center",
            mt: 0.4,
            width: 54,
          }}
        >
          <Icon icon="game-icons:info-board" style={{ fontSize: 24 }} />
        </Box>

        <Stack spacing={0.8}>
          <Typography
            component="h1"
            sx={{
              color: "#f3e5cc",
              fontFamily: '"Georgia", "Times New Roman", serif',
              fontSize: { xs: "2.35rem", md: "3.25rem" },
              lineHeight: 0.98,
            }}
          >
            Campaign quests
          </Typography>
          <Typography color="text.secondary" sx={{ maxWidth: 760 }} variant="body1">
            Keep the party&apos;s main arcs, side hooks, active objectives, and unresolved rewards
            in one clear board.
          </Typography>
        </Stack>
      </Stack>

      {canManageQuests ? (
        <Button onClick={onCreateQuest} startIcon={<Icon icon="solar:add-circle-linear" />} variant="contained">
          Create quest
        </Button>
      ) : null}
    </Stack>
  );
}
