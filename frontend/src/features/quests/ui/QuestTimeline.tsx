import { Box, Stack, Typography } from "@mui/material";

type QuestTimelineProps = {
  completedAt: string | null;
  failedAt: string | null;
  startedAt: string | null;
  status: string;
};

function formatTimelineDate(value: string | null): string {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function getTimelineEndState(status: string, completedAt: string | null, failedAt: string | null) {
  switch (status) {
    case "COMPLETED":
      return {
        color: "success.main" as const,
        dateValue: completedAt,
        label: "Completed",
        showDot: true,
      };
    case "FAILED":
      return {
        color: "error.main" as const,
        dateValue: failedAt,
        label: "Failed",
        showDot: true,
      };
    case "ABANDONED":
      return {
        color: "error.main" as const,
        dateValue: failedAt,
        label: "Abandoned",
        showDot: true,
      };
    case "ACTIVE":
      return {
        color: "warning.main" as const,
        dateValue: null,
        label: "In progress",
        showDot: false,
      };
    case "ON_HOLD":
      return {
        color: "warning.main" as const,
        dateValue: null,
        label: "On hold",
        showDot: false,
      };
    case "AVAILABLE":
      return {
        color: "warning.main" as const,
        dateValue: null,
        label: "Not started yet",
        showDot: false,
      };
    case "DRAFT":
    case "HIDDEN":
    default:
      return {
        color: "warning.main" as const,
        dateValue: null,
        label: "Not finished yet",
        showDot: false,
      };
  }
}

export function QuestTimeline({ completedAt, failedAt, startedAt, status }: QuestTimelineProps) {
  const endState = getTimelineEndState(status, completedAt, failedAt);
  const endLabel = endState.label;
  const endValue = endState.dateValue;
  const hasStart = Boolean(startedAt);
  const hasEnd = endState.showDot;
  const isEmpty = !hasStart && !hasEnd;

  return (
    <Stack spacing={0.75}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Stack spacing={0.2} sx={{ maxWidth: "48%" }}>
            <Typography color={hasStart ? "common.white" : "text.disabled"} variant="caption">
              Started
            </Typography>
            <Typography color={hasStart ? "common.white" : "text.disabled"} variant="caption">
              {formatTimelineDate(startedAt)}
            </Typography>
          </Stack>
          <Stack spacing={0.2} sx={{ alignItems: "flex-end", maxWidth: "48%" }}>
            <Typography
              color={endState.color}
              variant="caption"
            >
              {endLabel}
            </Typography>
            <Typography
              color={endState.color}
              variant="caption"
            >
              {formatTimelineDate(endValue)}
            </Typography>
          </Stack>
        </Stack>

        <Box
          sx={(theme) => ({
            position: "relative",
            height: 22,
            opacity: isEmpty ? 0.45 : 1,
            "--timeline-start": hasStart ? theme.palette.common.white : theme.palette.text.disabled,
            "--timeline-end":
              hasEnd ||
              status === "ACTIVE" ||
              status === "ON_HOLD" ||
              status === "AVAILABLE" ||
              status === "DRAFT" ||
              status === "HIDDEN"
                ? theme.palette.warning.main
                : theme.palette.text.disabled,
          })}
        >
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: 0,
              right: 0,
              transform: "translateY(-50%)",
              height: 4,
              borderRadius: 999,
              background:
                "linear-gradient(90deg, var(--timeline-start) 0%, var(--timeline-end) 100%)",
            }}
          />
          {hasStart ? (
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: "50%",
                left: 0,
                width: 12,
                height: 12,
                transform: "translateY(-50%)",
                borderRadius: "50%",
                bgcolor: theme.palette.common.white,
                boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
              })}
            />
          ) : null}
          {hasEnd ? (
            <Box
              sx={(theme) => ({
                position: "absolute",
                top: "50%",
                right: 0,
                width: 12,
                height: 12,
                transform: "translateY(-50%)",
                borderRadius: "50%",
                bgcolor: endState.color === "success.main"
                  ? theme.palette.success.main
                  : endState.color === "error.main"
                    ? theme.palette.error.main
                    : theme.palette.warning.main,
                boxShadow: `0 0 0 3px ${theme.palette.background.paper}`,
              })}
            />
          ) : null}
        </Box>
        <Typography sx={{ textAlign: "center" }} variant="body2">
          Timeline
        </Typography>
      </Stack>
    </Stack>
  );
}
