import { Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  children?: ReactNode;
};

export function EmptyState({ title, description, action, children }: EmptyStateProps) {
  return (
    <Paper
      sx={{
        alignItems: "center",
        display: "flex",
        justifyContent: "center",
        minHeight: 220,
        p: { xs: 3, md: 4 },
        textAlign: "center",
      }}
      variant="outlined"
    >
      <Stack spacing={1.5} sx={{ alignItems: "center" }}>
        {children}
        <Typography component="h2" variant="h5">
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary" sx={{ maxWidth: 560 }}>
            {description}
          </Typography>
        ) : null}
        {action}
      </Stack>
    </Paper>
  );
}
