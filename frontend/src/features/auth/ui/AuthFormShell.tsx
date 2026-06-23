import { Alert, Box, Link as MuiLink, Paper, Stack, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import type { PropsWithChildren, ReactNode } from "react";

type AuthFormShellProps = PropsWithChildren<{
  eyebrow: string;
  footerLabel: string;
  footerLinkLabel: string;
  footerLinkTo: string;
  subtitle: string;
  title: string;
  errorMessage?: string | null;
  actions?: ReactNode;
}>;

export function AuthFormShell({
  actions,
  children,
  eyebrow,
  errorMessage,
  footerLabel,
  footerLinkLabel,
  footerLinkTo,
  subtitle,
  title,
}: AuthFormShellProps) {
  return (
    <Paper
      sx={{
        backdropFilter: "blur(14px)",
        background: "linear-gradient(180deg, rgba(13, 22, 38, 0.94) 0%, rgba(7, 15, 28, 0.98) 100%)",
        border: "1px solid rgba(50, 129, 255, 0.24)",
        borderRadius: 6,
        boxShadow: "0 30px 70px rgba(11, 19, 33, 0.28)",
        color: "#f3f7ff",
        marginInline: "auto",
        maxWidth: 480,
        p: { xs: 3, md: 4 },
        width: "100%",
      }}
    >
      <Stack spacing={3}>
        <Stack spacing={1.5}>
          <Typography
            color="#69b1ff"
            sx={{ letterSpacing: "0.14em", textTransform: "uppercase" }}
            variant="caption"
          >
            {eyebrow}
          </Typography>
          <Typography sx={{ color: "#f5f9ff", fontWeight: 700 }} variant="h4">
            {title}
          </Typography>
          <Typography sx={{ color: "rgba(214, 228, 255, 0.7)" }}>{subtitle}</Typography>
        </Stack>

        {errorMessage ? <Alert severity="error">{errorMessage}</Alert> : null}

        <Box component="section">{children}</Box>

        {actions}

        <Typography sx={{ color: "rgba(214, 228, 255, 0.72)" }} variant="body2">
          {footerLabel}{" "}
          <MuiLink component={RouterLink} sx={{ color: "#58a6ff" }} to={footerLinkTo} underline="hover">
            {footerLinkLabel}
          </MuiLink>
        </Typography>
      </Stack>
    </Paper>
  );
}
