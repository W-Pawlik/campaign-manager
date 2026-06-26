import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignInvitation } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignInvitationsListProps = {
  canRespondToInvitations: boolean;
  currentUserId: string | null;
  invitations: CampaignInvitation[];
  isSubmitting: boolean;
  onAcceptInvitation: (invitationId: string) => void;
  onDeclineInvitation: (invitationId: string) => void;
};

function formatDate(value: string): string {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getInvitationPrimaryLabel(invitation: CampaignInvitation): string {
  return invitation.username ?? invitation.userId;
}

export function CampaignInvitationsList({
  canRespondToInvitations,
  currentUserId,
  invitations,
  isSubmitting,
  onAcceptInvitation,
  onDeclineInvitation,
}: CampaignInvitationsListProps) {
  if (invitations.length === 0) {
    return (
      <EmptyState
        description="Pending and historical invitations will appear here."
        title="No invitations yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {invitations.map((invitation) => {
        const isOwnInvitation = invitation.userId === currentUserId;
        const canRespond = canRespondToInvitations && invitation.status === "INVITED" && isOwnInvitation;

        return (
          <Paper key={invitation.id} sx={{ p: 2.25 }} variant="outlined">
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{getInvitationPrimaryLabel(invitation)}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    Invited by: {invitation.invitedByUsername ?? invitation.invitedById}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Chip label={invitation.role.replace("_", " ")} size="small" variant="outlined" />
                  <Chip label={invitation.status.replace("_", " ")} size="small" />
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Typography color="text.secondary" variant="body2">
                  Created: {formatDate(invitation.createdAt)}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Responded: {invitation.respondedAt ? formatDate(invitation.respondedAt) : "Not responded yet"}
                </Typography>
              </Stack>

              {canRespond ? (
                <Stack direction="row" spacing={1.5}>
                  <Button
                    disabled={isSubmitting}
                    onClick={() => onAcceptInvitation(invitation.id)}
                    variant="contained"
                  >
                    Accept
                  </Button>
                  <Button
                    color="inherit"
                    disabled={isSubmitting}
                    onClick={() => onDeclineInvitation(invitation.id)}
                    variant="outlined"
                  >
                    Decline
                  </Button>
                </Stack>
              ) : null}
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
