import { Icon } from "@iconify/react";
import { Chip, Stack } from "@mui/material";

import type { SessionFilterValue } from "@/features/sessions/ui/sessionUi.utils";
import {
  formatSessionStatusLabel,
  sessionFilterOptions,
} from "@/features/sessions/ui/sessionUi.utils";

type SessionStatusFilterBarProps = {
  onChange: (value: SessionFilterValue) => void;
  value: SessionFilterValue;
};

export function SessionStatusFilterBar({ onChange, value }: SessionStatusFilterBarProps) {
  return (
    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
      {sessionFilterOptions.map((option) => {
        const selected = option === value;
        const tone = getFilterTone(option);

        return (
          <Chip
            clickable
            icon={<Icon icon={getFilterIcon(option)} style={{ fontSize: 16 }} />}
            key={option}
            label={option === "ALL" ? "All sessions" : formatSessionStatusLabel(option)}
            onClick={() => onChange(option)}
            sx={{
              backdropFilter: "blur(12px)",
              bgcolor: selected ? `${tone}16` : "rgba(8, 10, 16, 0.36)",
              borderColor: selected ? `${tone}66` : "rgba(208, 170, 108, 0.18)",
              color: selected ? tone : "#d5cab4",
              fontWeight: selected ? 700 : 500,
              minHeight: 42,
              px: 0.5,
              ".MuiChip-icon": {
                color: "inherit",
              },
            }}
            variant="outlined"
          />
        );
      })}
    </Stack>
  );
}

function getFilterIcon(option: SessionFilterValue): string {
  switch (option) {
    case "PLANNED":
      return "mingcute:calendar-fill";
    case "CONFIRMED":
      return "solar:verified-check-bold";
    case "COMPLETED":
      return "solar:check-circle-bold";
    case "CANCELLED":
      return "solar:close-circle-bold";
    case "POSTPONED":
      return "solar:clock-circle-bold";
    default:
      return "solar:tuning-2-bold";
  }
}

function getFilterTone(option: SessionFilterValue): string {
  switch (option) {
    case "PLANNED":
      return "#78a7dc";
    case "CONFIRMED":
      return "#87b94c";
    case "COMPLETED":
      return "#d6a94f";
    case "CANCELLED":
      return "#d45b49";
    case "POSTPONED":
      return "#d28839";
    default:
      return "#d8b070";
  }
}
