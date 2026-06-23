import { Box, Stack, Typography } from "@mui/material";
import { alpha } from "@mui/material/styles";

import { authViewContent } from "@/features/auth/ui/authContent";
import type { AuthViewMode } from "@/features/auth/ui/authViewMode";
import { LoginForm } from "@/features/auth/ui/LoginForm";
import { RegisterForm } from "@/features/auth/ui/RegisterForm";

type AuthFormPanelProps = {
  mode: AuthViewMode;
  onShowLogin: () => void;
  onShowRegister: () => void;
};

export function AuthFormPanel({ mode, onShowLogin, onShowRegister }: AuthFormPanelProps) {
  const copy = authViewContent[mode];

  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        color: "text.primary",
        display: "flex",
        minWidth: 0,
        position: "relative",
      }}
    >
      <Box
        aria-hidden
        sx={{
          background: (theme) =>
            `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0)} 0%, ${alpha(
              theme.palette.primary.main,
              0.92,
            )} 18%, ${theme.palette.primary.main} 50%, ${alpha(theme.palette.primary.main, 0.92)} 82%, ${alpha(
              theme.palette.primary.main,
              0,
            )} 100%)`,
          boxShadow: (theme) => `0 0 28px ${alpha(theme.palette.primary.main, 0.8)}`,
          display: { xs: "none", lg: "block" },
          left: 0,
          position: "absolute",
          top: 36,
          bottom: 36,
          width: "3px",
        }}
      />

      <Stack
        spacing={3.5}
        sx={{
          flex: 1,
          justifyContent: "center",
          maxWidth: 640,
          mx: "auto",
          px: { xs: 3, md: 5, lg: 8 },
          py: { xs: 4, md: 5 },
          width: "100%",
        }}
      >
        <Box
          key={mode}
          sx={{
            animation: "auth-panel-enter 260ms ease",
            "@keyframes auth-panel-enter": {
              from: {
                opacity: 0,
                transform: "translateY(12px) scale(0.985)",
              },
              to: {
                opacity: 1,
                transform: "translateY(0) scale(1)",
              },
            },
          }}
        >
          <Stack spacing={1.25}>
            <Typography color="primary.main" sx={{ letterSpacing: "0.14em", textTransform: "uppercase" }} variant="caption">
              {copy.eyebrow}
            </Typography>
            <Typography sx={{ fontSize: { xs: "2.15rem", md: "2.6rem" }, fontWeight: 700 }}>
              {copy.title}
            </Typography>
            <Typography color="text.secondary" sx={{ fontSize: "1.02rem" }}>
              {copy.subtitle}
            </Typography>
          </Stack>

          <Box sx={{ mt: 4 }}>
            {mode === "login" ? (
              <LoginForm onShowRegister={onShowRegister} />
            ) : (
              <RegisterForm onShowLogin={onShowLogin} />
            )}
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
