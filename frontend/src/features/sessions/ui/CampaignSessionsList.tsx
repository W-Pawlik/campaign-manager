import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignSessionListItem } from "@/features/campaigns";
import { SessionStatusChip } from "@/features/sessions/ui/SessionStatusChip";
import { formatDateTime } from "@/features/sessions/ui/sessionUi.utils";
import { EmptyState } from "@/shared/components";

type CampaignSessionsListProps = {
  canManageSessions: boolean;
  isSubmitting: boolean;
  onCancelSession: (sessionId: string) => void;
  onCompleteSession: (sessionId: string) => void;
  onEditSession: (sessionId: string) => void;
  onOpenDetails: (sessionId: string) => void;
  sessions: CampaignSessionListItem[];
};

export function CampaignSessionsList({
  canManageSessions,
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
          canManageSessions &&
          session.status !== "COMPLETED" &&
          session.status !== "CANCELLED";
        const canCancel =
          canManageSessions &&
          session.status !== "COMPLETED" &&
          session.status !== "CANCELLED";

        return (
          <Paper key={session.id} sx={{ p: 2.25 }} variant="outlined">
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{session.title}</Typography>
                  <Typography color="text.secondary">{session.description ?? "No description yet."}</Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <SessionStatusChip status={session.status} />
                  {session.locationType ? (
                    <Chip label={session.locationType.replace("_", " ")} size="small" variant="outlined" />
                  ) : null}
                </Stack>
              </Stack>

              <Stack spacing={0.5}>
                <Typography color="text.secondary" variant="body2">
                  Starts: {formatDateTime(session.scheduledStartAt)}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Ends: {formatDateTime(session.scheduledEndAt)}
                </Typography>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Button color="inherit" onClick={() => onOpenDetails(session.id)} variant="outlined">
                  View details
                </Button>
                {canEdit ? (
                  <Button color="inherit" onClick={() => onEditSession(session.id)} variant="text">
                    Edit
                  </Button>
                ) : null}
                {canComplete ? (
                  <Button disabled={isSubmitting} onClick={() => onCompleteSession(session.id)} variant="contained">
                    Complete
                  </Button>
                ) : null}
                {canCancel ? (
                  <Button
                    color="inherit"
                    disabled={isSubmitting}
                    onClick={() => onCancelSession(session.id)}
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
    </Stack>
  );
}
