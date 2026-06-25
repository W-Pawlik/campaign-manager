import { Icon } from "@iconify/react";
import { Box, Button, Chip, Stack, Typography } from "@mui/material";

import type { CampaignSessionListItem } from "@/features/campaigns";
import { SessionMetaRow } from "@/features/sessions/ui/SessionMetaRow";
import { SessionStatusChip } from "@/features/sessions/ui/SessionStatusChip";

type CampaignSessionsFeaturedCardProps = {
  canManageSessions: boolean;
  isSubmitting: boolean;
  onCompleteSession: (sessionId: string) => void;
  onEditSession: (sessionId: string) => void;
  onOpenDetails: (sessionId: string) => void;
  session: CampaignSessionListItem;
};

export function CampaignSessionsFeaturedCard({
  canManageSessions,
  isSubmitting,
  onCompleteSession,
  onEditSession,
  onOpenDetails,
  session,
}: CampaignSessionsFeaturedCardProps) {
  const canComplete =
    canManageSessions && session.status !== "COMPLETED" && session.status !== "CANCELLED";

  return (
    <Box
      sx={{
        backgroundImage:
          "linear-gradient(90deg, rgba(14, 11, 12, 0.96) 0%, rgba(14, 11, 12, 0.82) 48%, rgba(14, 11, 12, 0.42) 100%), url('/images/CampaignOverviewNextSessionSectionImage.png')",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        border: "1px solid rgba(188, 128, 52, 0.32)",
        borderRadius: 3,
        minHeight: 304,
        overflow: "hidden",
        p: { xs: 2.5, md: 3.25 },
        position: "relative",
      }}
    >
      <Stack
        spacing={2.5}
        sx={{
          justifyContent: "space-between",
          maxWidth: { xs: "100%", lg: "58%" },
          minHeight: "100%",
          position: "relative",
          zIndex: 1,
        }}
      >
        <Stack spacing={1.5}>
          <Stack direction="row" sx={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <Stack spacing={1.1}>
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
              <Typography
                component="h2"
                sx={{
                  color: "#fff2de",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "2.25rem", md: "3.2rem" },
                  letterSpacing: "-0.04em",
                  lineHeight: 0.98,
                }}
              >
                {session.title}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              spacing={1}
              sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}
            >
              <SessionStatusChip status={session.status} />
              <Chip
                label={session.meetingUrl?.trim() ? "Live link ready" : "Session notes pending"}
                sx={{
                  bgcolor: "rgba(11, 12, 16, 0.55)",
                  border: "1px solid rgba(213, 174, 112, 0.18)",
                  color: "#efe0c2",
                  fontWeight: 600,
                }}
                variant="outlined"
              />
            </Stack>
          </Stack>

          <Typography color="rgba(244, 232, 206, 0.82)" sx={{ maxWidth: 720 }} variant="body1">
            {session.description?.trim() ||
              "Prepare the next gathering, track attendance, and keep the party aligned before the dice start rolling."}
          </Typography>

          <SessionMetaRow session={session} />
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button onClick={() => onOpenDetails(session.id)} variant="contained">
            Open details
          </Button>
          {canManageSessions ? (
            <Button color="inherit" onClick={() => onEditSession(session.id)} variant="outlined">
              Prepare session
            </Button>
          ) : null}
          {canComplete ? (
            <Button
              color="inherit"
              disabled={isSubmitting}
              onClick={() => onCompleteSession(session.id)}
              variant="outlined"
            >
              Complete session
            </Button>
          ) : null}
        </Stack>
      </Stack>
    </Box>
  );
}
