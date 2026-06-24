import { alpha, Chip } from "@mui/material";

type QuestStatusChipProps = {
  status: string;
};

export function QuestStatusChip({ status }: QuestStatusChipProps) {
  return (
    <Chip
      label={status.replace("_", " ")}
      size="small"
      sx={(theme) => {
        switch (status) {
          case "COMPLETED":
          case "DONE":
            return {
              bgcolor: alpha(theme.palette.success.main, 0.14),
              borderColor: alpha(theme.palette.success.main, 0.42),
              color: theme.palette.success.main,
              fontWeight: 700,
            };
          case "FAILED":
          case "ABANDONED":
            return {
              bgcolor: alpha(theme.palette.error.main, 0.14),
              borderColor: alpha(theme.palette.error.main, 0.42),
              color: theme.palette.error.main,
              fontWeight: 700,
            };
          case "IN_PROGRESS":
          case "ACTIVE":
            return {
              bgcolor: alpha(theme.palette.warning.main, 0.14),
              borderColor: alpha(theme.palette.warning.main, 0.42),
              color: theme.palette.warning.main,
              fontWeight: 700,
            };
          case "AVAILABLE":
          case "TODO":
            return {
              bgcolor: alpha(theme.palette.info.main, 0.14),
              borderColor: alpha(theme.palette.info.main, 0.42),
              color: theme.palette.info.main,
              fontWeight: 700,
            };
          case "ON_HOLD":
          case "OPTIONAL_SKIPPED":
            return {
              bgcolor: alpha(theme.palette.secondary.main, 0.14),
              borderColor: alpha(theme.palette.secondary.main, 0.42),
              color: theme.palette.secondary.main,
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
