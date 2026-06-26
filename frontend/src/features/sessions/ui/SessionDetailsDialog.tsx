import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import { useCampaignChronicleQuery } from "@/features/chronicle";
import type { CampaignSessionDetails } from "@/features/sessions/model/session.types";
import { SessionChronicleCards } from "@/features/sessions/ui/SessionChronicleCards";
import { SessionStatusChip } from "@/features/sessions/ui/SessionStatusChip";
import { formatDateTime } from "@/features/sessions/ui/sessionUi.utils";

type SessionDetailsDialogProps = {
  campaignId: string;
  canManageSessions: boolean;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirmAttendance: () => void;
  onDeclineAttendance: () => void;
  open: boolean;
  session: CampaignSessionDetails | null;
};

export function SessionDetailsDialog({
  campaignId,
  canManageSessions,
  isSubmitting,
  onClose,
  onConfirmAttendance,
  onDeclineAttendance,
  open,
  session,
}: SessionDetailsDialogProps) {
  const chronicleQuery = useCampaignChronicleQuery(campaignId);
  const linkedChronicleEntries = (chronicleQuery.data ?? []).filter((entry) => entry.sessionId === session?.id);

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{session?.title ?? "Session details"}</DialogTitle>
      <DialogContent dividers>
        {session ? (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <SessionStatusChip status={session.status} />
              {session.locationType ? (
                <Chip label={session.locationType.replace("_", " ")} size="small" variant="outlined" />
              ) : null}
            </Stack>

            <Typography color="text.secondary">{session.description ?? "No description yet."}</Typography>

            <Stack spacing={0.75}>
              <Typography variant="subtitle1">Schedule</Typography>
              <Typography color="text.secondary">Start: {formatDateTime(session.scheduledStartAt)}</Typography>
              <Typography color="text.secondary">End: {formatDateTime(session.scheduledEndAt)}</Typography>
              <Typography color="text.secondary">
                Meeting: {session.meetingUrl ?? "No meeting URL provided"}
              </Typography>
            </Stack>

            <Divider />

            <Stack spacing={0.75}>
              <Typography variant="subtitle1">Participants</Typography>
              {session.participants.length === 0 ? (
                <Typography color="text.secondary">No participants yet.</Typography>
              ) : (
                session.participants.map((participant) => (
                  <Stack key={participant.id} spacing={0.35}>
                    <Typography>{participant.username ?? participant.userId}</Typography>
                  <Typography color="text.secondary" variant="body2">
                      {participant.attendanceStatus.replace("_", " ")}
                      {participant.characterId ? ` · Character ${participant.characterId}` : ""}
                    </Typography>
                    {participant.note ? (
                      <Typography color="text.secondary" variant="body2">
                        {participant.note}
                      </Typography>
                    ) : null}
                  </Stack>
                ))
              )}
            </Stack>

            {session.summaryPublic ? (
              <>
                <Divider />
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">Public summary</Typography>
                  <Typography color="text.secondary">{session.summaryPublic}</Typography>
                </Stack>
              </>
            ) : null}

            {"summaryPrivate" in session && session.summaryPrivate ? (
              <>
                <Divider />
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">Private GM summary</Typography>
                  <Typography color="text.secondary">{session.summaryPrivate}</Typography>
                </Stack>
              </>
            ) : null}

            <Divider />
            <Stack spacing={0.75}>
              <Typography variant="subtitle1">Linked chronicle</Typography>
              <SessionChronicleCards entries={linkedChronicleEntries} />
            </Stack>
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
        {!canManageSessions ? (
          <>
            <Button disabled={isSubmitting} onClick={onDeclineAttendance} variant="outlined">
              Decline
            </Button>
            <Button disabled={isSubmitting} onClick={onConfirmAttendance} variant="contained">
              Confirm attendance
            </Button>
          </>
        ) : null}
      </DialogActions>
    </Dialog>
  );
}
