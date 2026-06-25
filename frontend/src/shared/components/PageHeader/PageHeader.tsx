import { Box, Stack, Typography, type SxProps, type Theme } from "@mui/material";
import type { ReactNode } from "react";

type PageHeaderProps = {
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  titleSx?: SxProps<Theme>;
  wrapperSx?: SxProps<Theme>;
};

export function PageHeader({ title, description, action, titleSx, wrapperSx }: PageHeaderProps) {
  return (
    <Box sx={wrapperSx}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={2}
        sx={{
          alignItems: { xs: "flex-start", md: "center" },
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={0.75}>
          <Typography component="h1" sx={titleSx} variant="h3">
            {title}
          </Typography>
          {description}
        </Stack>
        {action}
      </Stack>
    </Box>
  );
}
