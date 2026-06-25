import { Icon } from "@iconify/react";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";

import type { CampaignSessionListItem } from "@/features/campaigns";
import { SessionMetaRow } from "@/features/sessions/ui/SessionMetaRow";
import { SessionStatusChip } from "@/features/sessions/ui/SessionStatusChip";
import { getSessionDateCardParts } from "@/features/sessions/ui/sessionUi.utils";
import { EmptyState } from "@/shared/components";

type CampaignSessionsListProps = {
  canManageSessions: boolean;
  highlightedSessionId?: string | null;
  isSubmitting: boolean;
  onCancelSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onEditSession: (sessionId: string) => void;
  onOpenDetails: (sessionId: string) => void;
  sessions: CampaignSessionListItem[];
};

export function CampaignSessionsList({
  canManageSessions,
  highlightedSessionId = null,
  isSubmitting,
  onCancelSession,
  onCompleteSession,
  onEditSession,
  onOpenDetails,
  sessions,
}: CampaignSessionsListProps) {
  if (sessions.length === 0) {
    return (
      <EmptyState
        description="Plan your next adventure, set a date, and start collecting attendance confirmations."
        title="No sessions yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {sessions.map((session) => {
        const canEdit = canManageSessions;
        const canComplete =
          canManageSessions && session.status !== "COMPLETED" && session.status !== "CANCELLED";
        const canCancel =
          canManageSessions && session.status !== "COMPLETED" && session.status !== "CANCELLED";
        const dateParts = getSessionDateCardParts(session.scheduledStartAt);

        return (
          <Paper
            id={`session-card-${session.id}`}
            key={session.id}
            sx={{
              backgroundColor: "background.paper",
              borderColor:
                highlightedSessionId === session.id
                  ? "rgba(188, 128, 52, 0.38)"
                  : "divider",
              borderRadius: 2.5,
              p: { xs: 2, md: 2.5 },
              scrollMarginTop: 96,
            }}
            variant="outlined"
          >
            <Stack
              direction={{ xs: "column", lg: "row" }}
              spacing={2}
              sx={{ alignItems: { lg: "center" }, justifyContent: "space-between" }}
            >
              <Stack direction="row" spacing={2} sx={{ minWidth: 0 }}>
                <Stack
                  sx={{
                    alignItems: "center",
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                    flexShrink: 0,
                    justifyContent: "center",
                    minHeight: 112,
                    px: 1.75,
                    py: 1.25,
                    textAlign: "center",
                    width: 76,
                  }}
                >
                  <Typography color="#d5ae70" sx={{ letterSpacing: "0.08em" }} variant="caption">
                    {dateParts.month}
                  </Typography>
                  <Typography
                    sx={{
                      color: "#fff0d8",
                      fontFamily: '"Georgia", "Times New Roman", serif',
                      fontSize: "2.2rem",
                      lineHeight: 1,
                    }}
                  >
                    {dateParts.day}
                  </Typography>
                  <Typography color="text.secondary" variant="body2">
                    {dateParts.year}
                  </Typography>
                </Stack>

                <Stack spacing={1.1} sx={{ minWidth: 0 }}>
                  <Stack
                    direction={{ xs: "column", sm: "row" }}
                    spacing={1.25}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#fff0d8",
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontSize: { xs: "1.65rem", md: "2rem" },
                          lineHeight: 1.02,
                        }}
                      >
                        {session.title}
                      </Typography>
                      <Typography color="text.secondary" variant="body1">
                        {session.description?.trim() || "No description yet."}
                      </Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: "center", flexWrap: "wrap" }}
                    >
                      <SessionStatusChip status={session.status} />
                    </Stack>
                  </Stack>

                  <SessionMetaRow session={session} variant="compact" />
                </Stack>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: { sm: "center" },
                  flexShrink: 0,
                  flexWrap: "wrap",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => onOpenDetails(session.id)}
                  startIcon={<Icon icon="solar:magnifer-linear" />}
                  variant="outlined"
                >
                  Details
                </Button>
                {canEdit ? (
                  <Button
                    color="inherit"
                    onClick={() => onEditSession(session.id)}
                    startIcon={<Icon icon="solar:pen-2-linear" />}
                    variant="outlined"
                  >
                    Edit
                  </Button>
                ) : null}
                {canComplete ? (
                  <Button
                    color="inherit"
                    disabled={isSubmitting}
                    onClick={() => onCompleteSession(session.id)}
                    startIcon={<Icon icon="solar:check-circle-linear" />}
                    variant="outlined"
                  >
                    Complete
                  </Button>
                ) : null}
                {canCancel ? (
                  <Button
                    color="inherit"
                    disabled={isSubmitting}
                    onClick={() => onCancelSession(session.id)}
                    startIcon={<Icon icon="solar:trash-bin-minimalistic-linear" />}
                    sx={{
                      borderColor: "rgba(212, 91, 73, 0.34)",
                      color: "#d77d6c",
                    }}
                    variant="outlined"
                  >
                    Cancel
                  </Button>
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        );
      })}

      <Box sx={{ pb: 1, pt: 1 }}>
        <Stack spacing={0.75} sx={{ alignItems: "center", color: "#8e7451", textAlign: "center" }}>
          <Icon icon="game-icons:rolling-dices" style={{ fontSize: 26 }} />
          <Typography variant="body2">That is every session in this campaign.</Typography>
          <Typography color="text.secondary" variant="body2">
            Schedule the next gathering when the party is ready for another chapter.
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
}
