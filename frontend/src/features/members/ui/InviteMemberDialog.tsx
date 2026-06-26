import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { invitedMemberRoleOptions } from "@/features/members/model/member.types";
import { UserLookupAutocomplete } from "@/features/users";
import type { UserLookupItem } from "@/features/users";

const inviteMemberSchema = z.object({
  role: z.enum(["GM", "CO_GM", "PLAYER", "OBSERVER"]),
  userId: z.string().trim().min(1, "Enter the target user ID."),
});

type InviteMemberFormValues = z.infer<typeof inviteMemberSchema>;

type InviteMemberDialogProps = {
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: InviteMemberFormValues) => Promise<void>;
  open: boolean;
  submitError: string | null;
};

export function InviteMemberDialog({
  isSubmitting,
  onClose,
  onSubmit,
  open,
  submitError,
}: InviteMemberDialogProps) {
  const [selectedUser, setSelectedUser] = useState<UserLookupItem | null>(null);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
  } = useForm<InviteMemberFormValues>({
    defaultValues: {
      role: "PLAYER",
      userId: "",
    },
    resolver: zodResolver(inviteMemberSchema),
  });

  const handleDialogClose = () => {
    setSelectedUser(null);
    reset();
    onClose();
  };

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    setSelectedUser(null);
    reset();
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={open}>
      <DialogTitle>Invite member</DialogTitle>

      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Search for the target user by unique username and send the invitation directly.
          </Typography>

          {submitError ? <Alert severity="error">{submitError}</Alert> : null}

          <input type="hidden" {...register("userId")} />
          <UserLookupAutocomplete
            error={Boolean(errors.userId)}
            helperText={errors.userId?.message}
            label="User"
            onChange={(value) => {
              setSelectedUser(value);
              setValue("userId", value?.id ?? "", { shouldValidate: true });
            }}
            placeholder="Start typing a username"
            value={selectedUser}
          />

          <TextField
            error={Boolean(errors.role)}
            fullWidth
            helperText={errors.role?.message}
            label="Role"
            select
            {...register("role")}
          >
            {invitedMemberRoleOptions.map((role) => (
              <MenuItem key={role} value={role}>
                {role.replace("_", " ")}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button
          disabled={isSubmitting}
          onClick={() => void handleValidSubmit()}
          variant="contained"
        >
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Send invitation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
