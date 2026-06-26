import {
  Button,
  Chip,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import type { CampaignMember } from "@/features/campaigns";
import { invitedMemberRoleOptions } from "@/features/members/model/member.types";
import { EmptyState } from "@/shared/components";

type CampaignMembersListProps = {
  canManageMembers: boolean;
  isSubmitting: boolean;
  members: CampaignMember[];
  onRemoveMember: (memberId: string) => void;
  onRoleChange: (memberId: string, role: "GM" | "CO_GM" | "PLAYER" | "OBSERVER") => void;
};

function formatDate(value: string | null): string {
  if (!value) {
    return "Not available";
  }

  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function getMemberPrimaryLabel(member: CampaignMember): string {
  return member.nickname ?? member.username ?? member.userId;
}

function getMemberSecondaryLabel(member: CampaignMember): string {
  if (member.username) {
    return `@${member.username}`;
  }

  return `User ID: ${member.userId}`;
}

export function CampaignMembersList({
  canManageMembers,
  isSubmitting,
  members,
  onRemoveMember,
  onRoleChange,
}: CampaignMembersListProps) {
  if (members.length === 0) {
    return (
      <EmptyState
        description="Members will appear here once your campaign starts inviting players and co-GMs."
        title="No members yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {members.map((member) => {
        const canEditRole = canManageMembers && member.role !== "OWNER";

        return (
          <Paper key={member.id} sx={{ p: 2.25 }} variant="outlined">
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{getMemberPrimaryLabel(member)}</Typography>
                  <Typography color="text.secondary" variant="body2">
                    {getMemberSecondaryLabel(member)}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Chip label={member.role.replace("_", " ")} size="small" variant="outlined" />
                  <Chip label={member.status.replace("_", " ")} size="small" />
                </Stack>
              </Stack>

              <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                <Typography color="text.secondary" variant="body2">
                  Joined: {formatDate(member.joinedAt)}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Invited: {formatDate(member.invitedAt)}
                </Typography>
              </Stack>

              {canEditRole ? (
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                  <TextField
                    defaultValue={member.role}
                    label="Role"
                    select
                    size="small"
                    sx={{ minWidth: 220 }}
                    onChange={(event) =>
                      onRoleChange(
                        member.id,
                        event.target.value as "GM" | "CO_GM" | "PLAYER" | "OBSERVER",
                      )
                    }
                  >
                    {invitedMemberRoleOptions.map((role) => (
                      <MenuItem key={role} value={role}>
                        {role.replace("_", " ")}
                      </MenuItem>
                    ))}
                  </TextField>

                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onRemoveMember(member.id)}
                    variant="outlined"
                  >
                    Remove member
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
