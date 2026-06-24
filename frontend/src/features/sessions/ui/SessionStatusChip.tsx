import { alpha, Chip } from "@mui/material";

import { formatSessionStatusLabel } from "@/features/sessions/ui/sessionUi.utils";

type SessionStatusChipProps = {
  status: string;
};

export function SessionStatusChip({ status }: SessionStatusChipProps) {
  return (
    <Chip
      label={formatSessionStatusLabel(status)}
      size="small"
      sx={(theme) => {
        switch (status) {
          case "COMPLETED":
            return {
              bgcolor: alpha(theme.palette.success.main, 0.14),
              borderColor: alpha(theme.palette.success.main, 0.42),
              color: theme.palette.success.main,
              fontWeight: 700,
            };
          case "CANCELLED":
            return {
              bgcolor: alpha(theme.palette.error.main, 0.14),
              borderColor: alpha(theme.palette.error.main, 0.42),
              color: theme.palette.error.main,
              fontWeight: 700,
            };
          case "CONFIRMED":
            return {
              bgcolor: alpha(theme.palette.info.main, 0.14),
              borderColor: alpha(theme.palette.info.main, 0.42),
              color: theme.palette.info.main,
              fontWeight: 700,
            };
          case "POSTPONED":
            return {
              bgcolor: alpha(theme.palette.warning.main, 0.14),
              borderColor: alpha(theme.palette.warning.main, 0.42),
              color: theme.palette.warning.main,
              fontWeight: 700,
            };
          default:
            return {
              bgcolor: alpha(theme.palette.text.secondary, 0.1),
              borderColor: alpha(theme.palette.text.secondary, 0.28),
              color: theme.palette.text.secondary,
              fontWeight: 700,
            };
        }
      }}
      variant="outlined"
    />
  );
}
