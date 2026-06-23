import { Box } from "@mui/material";
import { useLocation, useNavigate } from "react-router-dom";

import { appPaths } from "@/app/router/paths";
import { useAppDispatch } from "@/app/store/hooks";
import { clearAuthFeedback } from "@/features/auth/model/authSlice";
import { AuthFormPanel } from "@/features/auth/ui/AuthFormPanel";
import { AuthHeroPanel } from "@/features/auth/ui/AuthHeroPanel";
import { authViewModes, type AuthViewMode } from "@/features/auth/ui/authViewMode";

function getAuthMode(pathname: string): AuthViewMode {
  return pathname === appPaths.register ? authViewModes.register : authViewModes.login;
}

export function AuthPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const mode = getAuthMode(location.pathname);

  const navigateToMode = (nextMode: AuthViewMode) => {
    if (nextMode === mode) {
      return;
    }

    dispatch(clearAuthFeedback());
    navigate(nextMode === authViewModes.login ? appPaths.login : appPaths.register);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <Box
        sx={{
          background: (theme) =>
            theme.palette.mode === "dark"
              ? "linear-gradient(90deg, #0a0b0f 0%, #121419 100%)"
              : "linear-gradient(90deg, #f4f5f7 0%, #ffffff 100%)",
          display: "grid",
          gridTemplateColumns: { xs: "1fr", lg: "1.08fr 0.92fr" },
          minHeight: "100vh",
          position: "relative",
        }}
      >
        <AuthHeroPanel />
        <AuthFormPanel
          mode={mode}
          onShowLogin={() => navigateToMode(authViewModes.login)}
          onShowRegister={() => navigateToMode(authViewModes.register)}
        />
      </Box>
    </Box>
  );
}
