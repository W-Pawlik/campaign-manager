import { Icon } from "@iconify/react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import type { CampaignSessionListItem } from "@/features/campaigns/model/campaign.types";

type CampaignOverviewNextSessionCardProps = {
  campaignId: string;
  session: CampaignSessionListItem | null;
};

function formatDatePart(value: string | null) {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function formatTimePart(value: string | null) {
  if (!value) {
    return "TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

function formatSessionStatus(status: string | null | undefined) {
  switch (status) {
    case "CONFIRMED":
      return "Ready to play";
    case "COMPLETED":
      return "Completed";
    case "POSTPONED":
      return "Postponed";
    case "PLANNED":
      return "Planning";
    default:
      return "No upcoming session";
  }
}

export function CampaignOverviewNextSessionCard({
  campaignId,
  session,
}: CampaignOverviewNextSessionCardProps) {
  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(90deg, rgba(14, 10, 12, 0.94) 0%, rgba(14, 10, 12, 0.78) 54%, rgba(14, 10, 12, 0.42) 100%), url('/images/CampaignOverviewNextSessionSectionImage.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: "1px solid rgba(188, 128, 52, 0.32)",
        borderRadius: 3,
        minHeight: 280,
        overflow: "hidden",
        p: { xs: 2.5, md: 3 },
        position: "relative",
      }}
    >
      <Stack
        spacing={2}
        sx={{
          height: "100%",
          justifyContent: "space-between",
          maxWidth: { xs: "100%", md: "60%" },
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                alignItems: "center",
                bgcolor: "rgba(127, 22, 22, 0.38)",
                border: "1px solid rgba(230, 22, 26, 0.28)",
                borderRadius: 2,
                color: "#ffb38b",
                display: "inline-flex",
                justifyContent: "center",
                p: 0.9,
              }}
            >
              <Icon icon="mingcute:calendar-fill" style={{ fontSize: 18 }} />
            </Box>
            <Typography color="#f3d7a4" variant="h6">
              Next session
            </Typography>
          </Stack>

          <Stack spacing={0.75}>
            <Typography
              component="h2"
              sx={{
                color: "#fff8ec",
                fontSize: { xs: "2rem", md: "2.5rem" },
                fontWeight: 700,
                letterSpacing: "-0.03em",
                lineHeight: 1.02,
              }}
            >
              {session?.title ?? "Prepare the next adventure"}
            </Typography>
            <Typography color="rgba(245, 238, 226, 0.72)" variant="body1">
              {session?.summaryPublic ??
                "Plan your next gathering, share the hook, and keep the party aligned."}
            </Typography>
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#f0c988" }}>
              <Icon icon="solar:calendar-mark-bold" style={{ fontSize: 18 }} />
              <Typography variant="body1">
                {formatDatePart(session?.scheduledStartAt ?? null)}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", color: "#f0c988" }}>
              <Icon icon="solar:clock-circle-bold" style={{ fontSize: 18 }} />
              <Typography variant="body1">
                {formatTimePart(session?.scheduledStartAt ?? null)}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ alignItems: { sm: "center" } }}
        >
          <Chip
            color={session?.status === "CONFIRMED" ? "success" : "warning"}
            label={formatSessionStatus(session?.status)}
            sx={{
              bgcolor:
                session?.status === "CONFIRMED"
                  ? "rgba(46, 174, 103, 0.18)"
                  : "rgba(224, 161, 0, 0.16)",
              color: "#f7f3ea",
              fontWeight: 700,
            }}
          />
          <Button
            component={RouterLink}
            to={appPaths.campaignSessions(campaignId)}
            variant="contained"
          >
            Manage sessions
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
