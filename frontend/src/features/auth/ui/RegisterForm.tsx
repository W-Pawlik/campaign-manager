import { Button, CircularProgress, Stack, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { register as registerUser } from "@/features/auth/model/authThunks";
import { AuthTextField } from "@/features/auth/ui/AuthTextField";

const registerSchema = z
  .object({
    confirmPassword: z.string().min(8, "Confirm your password."),
    email: z.string().trim().email("Enter a valid email address."),
    password: z.string().min(8, "Password must contain at least 8 characters."),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: "Passwords must match.",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

type RegisterFormProps = {
  onShowLogin: () => void;
};

export function RegisterForm({ onShowLogin }: RegisterFormProps) {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);
  const operationStatus = useAppSelector((state) => state.auth.operationStatus);
  const isSubmitting = operationStatus === "submitting";

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<RegisterFormValues>({
    defaultValues: {
      confirmPassword: "",
      email: "",
      password: "",
    },
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await dispatch(registerUser({ email: values.email, password: values.password })).unwrap();
  });

  return (
    <Stack component="form" noValidate onSubmit={onSubmit} spacing={3}>
      {errorMessage ? <Typography color="error.main">{errorMessage}</Typography> : null}

      <AuthTextField
        autoComplete="email"
        error={Boolean(errors.email)}
        helperText={errors.email?.message}
        label="Email"
        placeholder="Enter your email"
        {...register("email")}
      />

      <AuthTextField
        autoComplete="new-password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        label="Password"
        placeholder="Create a password"
        type="password"
        {...register("password")}
      />

      <AuthTextField
        autoComplete="new-password"
        error={Boolean(errors.confirmPassword)}
        helperText={errors.confirmPassword?.message}
        label="Confirm password"
        placeholder="Repeat your password"
        type="password"
        {...register("confirmPassword")}
      />

      <Stack spacing={1.75} sx={{ pt: 1 }}>
        <Button
          fullWidth
          onClick={() => void onSubmit()}
          size="large"
          sx={{
            borderRadius: 999,
            fontSize: "1.04rem",
            minHeight: 56,
          }}
          variant="contained"
        >
          {isSubmitting ? <CircularProgress color="inherit" size={22} /> : "Create account"}
        </Button>

        <Button
          fullWidth
          onClick={onShowLogin}
          size="large"
          sx={{
            borderRadius: 999,
            fontSize: "1.04rem",
            minHeight: 56,
          }}
          variant="outlined"
        >
          Back to sign in
        </Button>
      </Stack>
    </Stack>
  );
}
