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
import { useForm } from "react-hook-form";
import { z } from "zod";

import { invitedMemberRoleOptions } from "@/features/members/model/member.types";

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
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<InviteMemberFormValues>({
    defaultValues: {
      role: "PLAYER",
      userId: "",
    },
    resolver: zodResolver(inviteMemberSchema),
  });

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={handleDialogClose} open={open}>
      <DialogTitle>Invite member</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            This backend flow currently expects a target user ID, so the invite form uses that value directly.
          </Typography>

          {submitError ? <Alert severity="error">{submitError}</Alert> : null}

          <TextField
            autoFocus
            error={Boolean(errors.userId)}
            fullWidth
            helperText={errors.userId?.message ?? "Use the application user ID of the invited person."}
            label="User ID"
            {...register("userId")}
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
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Send invitation"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
