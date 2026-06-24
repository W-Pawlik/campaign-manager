import { alpha, Chip, Stack, Typography } from "@mui/material";

import type { SessionFilterValue } from "@/features/sessions/ui/sessionUi.utils";
import { formatSessionStatusLabel, sessionFilterOptions } from "@/features/sessions/ui/sessionUi.utils";

type SessionStatusFilterBarProps = {
  onChange: (value: SessionFilterValue) => void;
  value: SessionFilterValue;
};

export function SessionStatusFilterBar({
  onChange,
  value,
}: SessionStatusFilterBarProps) {
  return (
    <Stack spacing={1.25}>
      <Typography color="text.secondary" variant="body2">
        Filter by status
      </Typography>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
        {sessionFilterOptions.map((option) => {
          const selected = option === value;

          return (
            <Chip
              clickable
              key={option}
              label={option === "ALL" ? "All" : formatSessionStatusLabel(option)}
              onClick={() => onChange(option)}
              sx={{
                bgcolor: selected ? (theme) => alpha(theme.palette.primary.main, 0.14) : "transparent",
                borderColor: selected
                  ? (theme) => alpha(theme.palette.primary.main, 0.42)
                  : (theme) => alpha(theme.palette.text.secondary, 0.28),
                color: selected ? "primary.main" : "text.secondary",
                fontWeight: selected ? 700 : 500,
              }}
              variant="outlined"
            />
          );
        })}
      </Stack>
    </Stack>
  );
}
