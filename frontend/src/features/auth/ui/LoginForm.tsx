import { Box, Button, Checkbox, CircularProgress, FormControlLabel, Stack, Typography } from "@mui/material";

import { useAppDispatch, useAppSelector } from "@/app/store/hooks";
import { login } from "@/features/auth/model/authThunks";
import { AuthTextField } from "@/features/auth/ui/AuthTextField";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const loginSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

type LoginFormValues = z.infer<typeof loginSchema>;

type LoginFormProps = {
  onShowRegister: () => void;
};

export function LoginForm({ onShowRegister }: LoginFormProps) {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector((state) => state.auth.errorMessage);
  const operationStatus = useAppSelector((state) => state.auth.operationStatus);
  const isSubmitting = operationStatus === "submitting";

  const {
    formState: { errors },
    handleSubmit,
    register,
  } = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    await dispatch(login(values)).unwrap();
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
        autoComplete="current-password"
        error={Boolean(errors.password)}
        helperText={errors.password?.message}
        label="Password"
        placeholder="Enter your password"
        type="password"
        {...register("password")}
      />

      <Box
        sx={{
          alignItems: { xs: "flex-start", sm: "center" },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 1.5,
          justifyContent: "space-between",
        }}
      >
        <FormControlLabel
          control={<Checkbox defaultChecked sx={{ p: 0.25 }} />}
          label="Remember me"
          sx={{
            color: "text.secondary",
            gap: 1,
            m: 0,
            "& .MuiFormControlLabel-label": {
              fontSize: "0.98rem",
            },
          }}
        />

        <Typography sx={{ color: "primary.main", fontSize: "0.95rem" }}>
          Forgot your password?
        </Typography>
      </Box>

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
          {isSubmitting ? <CircularProgress color="inherit" size={22} /> : "Sign in"}
        </Button>

        <Button
          fullWidth
          onClick={onShowRegister}
          size="large"
          sx={{
            borderRadius: 999,
            fontSize: "1.04rem",
            minHeight: 56,
          }}
          variant="outlined"
        >
          Create account
        </Button>
      </Stack>
    </Stack>
  );
}
