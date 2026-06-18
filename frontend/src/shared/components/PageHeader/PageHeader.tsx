import { Stack, Typography } from "@mui/material";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: string;
  action?: ReactNode;
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
      }}
    >
      <Stack spacing={0.75}>
        <Typography component="h1" variant="h3">
          {title}
        </Typography>
        {description ? (
          <Typography color="text.secondary" variant="body1">
            {description}
          </Typography>
        ) : null}
      </Stack>
      {action}
    </Stack>
  );
}
