import { Paper, Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type SectionCardProps = {
  title?: string;
  children: ReactNode;
};

export function SectionCard({ title, children }: SectionCardProps) {
  return (
    <Paper
      sx={{
        height: "100%",
        p: { xs: 2.5, md: 3 },
      }}
      variant="outlined"
    >
      <Stack spacing={1.5}>
        {title ? (
          <Typography component="h2" variant="h6">
            {title}
          </Typography>
        ) : null}
        {children}
      </Stack>
    </Paper>
  );
}
