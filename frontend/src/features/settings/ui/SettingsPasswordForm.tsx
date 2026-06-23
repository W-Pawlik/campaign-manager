import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

const settingsPasswordSchema = z
  .object({
    confirmPassword: z.string().min(8, "Confirm the new password."),
    currentPassword: z.string().min(1, "Enter your current password."),
    newPassword: z.string().min(8, "New password must contain at least 8 characters.").max(128),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type SettingsPasswordFormValues = z.infer<typeof settingsPasswordSchema>;

type SettingsPasswordFormProps = {
  isSubmitting: boolean;
  onSubmit: (values: SettingsPasswordFormValues) => Promise<void>;
  submitError: string | null;
  submitSuccess: string | null;
};

export function SettingsPasswordForm({
  isSubmitting,
  onSubmit,
  submitError,
  submitSuccess,
}: SettingsPasswordFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SettingsPasswordFormValues>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(settingsPasswordSchema),
  });

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
    reset();
  });

  return (
    <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
      <Stack spacing={0.75}>
        <Typography variant="h6">Password</Typography>
        <Typography color="text.secondary">
          Change your password without leaving the application.
        </Typography>
      </Stack>

      {submitError ? <Alert severity="error">{submitError}</Alert> : null}
      {submitSuccess ? <Alert severity="success">{submitSuccess}</Alert> : null}

      <TextField
        error={Boolean(errors.currentPassword)}
        fullWidth
        helperText={errors.currentPassword?.message}
        label="Current password"
        type="password"
        {...register("currentPassword")}
      />
      <TextField
        error={Boolean(errors.newPassword)}
        fullWidth
        helperText={errors.newPassword?.message}
        label="New password"
        type="password"
        {...register("newPassword")}
      />
      <TextField
        error={Boolean(errors.confirmPassword)}
        fullWidth
        helperText={errors.confirmPassword?.message}
        label="Confirm new password"
        type="password"
        {...register("confirmPassword")}
      />

      <Button
        disabled={isSubmitting}
        size="large"
        sx={{ alignSelf: "flex-start" }}
        type="submit"
        variant="outlined"
      >
        {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Update password"}
      </Button>
    </Stack>
  );
}
