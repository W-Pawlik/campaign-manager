import { Icon } from "@iconify/react";
import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Menu,
  Stack,
  Typography,
} from "@mui/material";
import { useState, type MouseEvent } from "react";

import {
  useAcceptUserCampaignInvitationMutation,
  useCurrentUserCampaignInvitationsQuery,
  useDeclineUserCampaignInvitationMutation,
} from "@/features/members/api/membersQueries";

function formatInvitationRole(role: string): string {
  return role.replaceAll("_", " ");
}

export function InvitationNotificationsMenu() {
  const invitationsQuery = useCurrentUserCampaignInvitationsQuery();
  const acceptInvitationMutation = useAcceptUserCampaignInvitationMutation();
  const declineInvitationMutation = useDeclineUserCampaignInvitationMutation();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const open = anchorEl !== null;
  const invitations = invitationsQuery.data ?? [];
  const isSubmitting =
    acceptInvitationMutation.isPending || declineInvitationMutation.isPending;
  const mutationError =
    acceptInvitationMutation.error?.message ??
    declineInvitationMutation.error?.message ??
    null;
  const pendingCount = invitations.filter((invitation) => invitation.status === "INVITED").length;

  const handleOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton color="inherit" onClick={handleOpen}>
        <Badge badgeContent={pendingCount} color="error" max={9}>
          <Icon icon="solar:bell-bing-outline" style={{ fontSize: 22 }} />
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        onClose={handleClose}
        open={open}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
      >
        <Box sx={{ maxWidth: 360, px: 2, py: 1.5 }}>
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", justifyContent: "space-between" }}>
              <Typography variant="subtitle1">Invitations</Typography>
              {invitationsQuery.isLoading ? <CircularProgress size={16} /> : null}
            </Stack>

            {mutationError ? <Typography color="error" variant="body2">{mutationError}</Typography> : null}

            {invitationsQuery.isError ? (
              <Typography color="error" variant="body2">
                {invitationsQuery.error.message}
              </Typography>
            ) : null}

            {!invitationsQuery.isLoading && invitations.length === 0 ? (
              <Typography color="text.secondary" variant="body2">
                No pending campaign invitations.
              </Typography>
            ) : null}

            {invitations.map((invitation, index) => (
              <Box key={invitation.id}>
                {index > 0 ? <Divider sx={{ mb: 1.5 }} /> : null}
                <Stack spacing={1}>
                  <Stack spacing={0.25}>
                    <Typography variant="body2">
                      Invitation to <strong>{invitation.campaignName ?? "campaign"}</strong>
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      Role: {formatInvitationRole(invitation.role)}
                    </Typography>
                    <Typography color="text.secondary" variant="caption">
                      Invited by: {invitation.invitedByUsername ?? invitation.invitedById}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={1}>
                    <Button
                      disabled={isSubmitting}
                      onClick={() =>
                        acceptInvitationMutation.mutate({
                          campaignId: invitation.campaignId,
                          invitationId: invitation.id,
                        })
                      }
                      size="small"
                      variant="contained"
                    >
                      Accept
                    </Button>
                    <Button
                      color="inherit"
                      disabled={isSubmitting}
                      onClick={() =>
                        declineInvitationMutation.mutate({
                          campaignId: invitation.campaignId,
                          invitationId: invitation.id,
                        })
                      }
                      size="small"
                      variant="outlined"
                    >
                      Decline
                    </Button>
                  </Stack>
                </Stack>
              </Box>
            ))}
          </Stack>
        </Box>
      </Menu>
    </>
  );
}
