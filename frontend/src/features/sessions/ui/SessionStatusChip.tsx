import { Icon } from "@iconify/react";
import { Chip, alpha } from "@mui/material";

import { formatSessionStatusLabel } from "@/features/sessions/ui/sessionUi.utils";

type SessionStatusChipProps = {
  status: string;
};

export function SessionStatusChip({ status }: SessionStatusChipProps) {
  return (
    <Chip
      icon={<Icon icon={getStatusIcon(status)} style={{ fontSize: 16 }} />}
      label={formatSessionStatusLabel(status)}
      size="small"
      sx={(theme) => {
        const tone = getStatusTone(theme, status);

        return {
          bgcolor: alpha(tone, 0.1),
          borderColor: alpha(tone, 0.42),
          color: tone,
          fontWeight: 700,
          ".MuiChip-icon": {
            color: "inherit",
            marginLeft: "8px",
          },
        };
      }}
      variant="outlined"
    />
  );
}

function getStatusIcon(status: string): string {
  switch (status) {
    case "COMPLETED":
      return "solar:check-circle-bold";
    case "CANCELLED":
      return "solar:close-circle-bold";
    case "CONFIRMED":
      return "solar:verified-check-bold";
    case "POSTPONED":
      return "solar:clock-circle-bold";
    default:
      return "mingcute:calendar-fill";
  }
}

function getStatusTone(
  theme: {
    palette: {
      success: { main: string };
      error: { main: string };
      info: { main: string };
      warning: { main: string };
      text: { secondary: string };
    };
  },
  status: string,
): string {
  switch (status) {
    case "COMPLETED":
      return theme.palette.success.main;
    case "CANCELLED":
      return theme.palette.error.main;
    case "CONFIRMED":
      return theme.palette.info.main;
    case "POSTPONED":
      return theme.palette.warning.main;
    default:
      return "#7ea8d8";
  }
}
