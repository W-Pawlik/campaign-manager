import { Icon } from "@iconify/react";
import { Chip, MenuItem, Stack, TextField } from "@mui/material";

import {
  formatQuestSortFieldLabel,
  questListFilterOptions,
  questSortFieldOptions,
  type QuestListFilters,
} from "@/features/quests/ui/questListUi.utils";
import { formatQuestPriorityLabel, formatQuestTypeLabel } from "@/features/quests/ui/questPageUi.utils";

type CampaignQuestsFilterBarProps = {
  onChange: (nextFilters: QuestListFilters) => void;
  onSearchChange: (value: string) => void;
  searchValue: string;
  value: QuestListFilters;
};

function formatStatusLabel(value: string): string {
  switch (value) {
    case "ALL":
      return "All";
    case "AVAILABLE":
      return "Available";
    case "ACTIVE":
      return "Active";
    case "ON_HOLD":
      return "On hold";
    case "COMPLETED":
      return "Completed";
    case "FAILED":
      return "Failed";
    case "ABANDONED":
      return "Abandoned";
    case "DRAFT":
      return "Draft";
    default:
      return value.replaceAll("_", " ");
  }
}

const featuredStatusOptions = ["ALL", "MAIN", "SIDE", "ACTIVE", "AVAILABLE", "COMPLETED"] as const;

export function CampaignQuestsFilterBar({
  onChange,
  onSearchChange,
  searchValue,
  value,
}: CampaignQuestsFilterBarProps) {
  return (
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
        {featuredStatusOptions.map((option) => {
          const isTypeOption = option === "MAIN" || option === "SIDE";
          const selected = isTypeOption ? value.type === option : value.status === option;

          return (
            <Chip
              clickable
              icon={
                <Icon
                  icon={
                    option === "ALL"
                      ? "solar:tuning-2-bold"
                      : option === "MAIN"
                        ? "solar:crown-star-bold"
                        : option === "SIDE"
                          ? "game-icons:crossed-swords"
                          : option === "ACTIVE"
                            ? "solar:bolt-bold"
                            : option === "AVAILABLE"
                              ? "solar:eye-bold"
                              : "solar:check-circle-bold"
                  }
                  style={{ fontSize: 16 }}
                />
              }
              key={option}
              label={isTypeOption ? formatQuestTypeLabel(option) : formatStatusLabel(option)}
              onClick={() => {
                if (option === "ALL") {
                  onChange({ ...value, status: "ALL", type: "ALL" });
                  return;
                }

                if (isTypeOption) {
                  onChange({ ...value, status: "ALL", type: option });
                  return;
                }

                onChange({ ...value, status: option, type: "ALL" });
              }}
              sx={{
                bgcolor: selected ? "rgba(216, 176, 112, 0.12)" : "rgba(8, 10, 16, 0.36)",
                borderColor: selected ? "rgba(216, 176, 112, 0.44)" : "divider",
                color: selected ? "#e3bd7b" : "#d5cab4",
                fontWeight: selected ? 700 : 500,
                minHeight: 42,
                ".MuiChip-icon": { color: "inherit" },
              }}
              variant="outlined"
            />
          );
        })}
      </Stack>

      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.25}
        sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
      >
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <TextField
            select
            size="small"
            sx={{ minWidth: 170 }}
            value={value.priority}
            onChange={(event) => onChange({ ...value, priority: event.target.value })}
          >
            {questListFilterOptions.priorities.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "ALL" ? "All priorities" : formatQuestPriorityLabel(option)}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            size="small"
            sx={{ minWidth: 170 }}
            value={value.visibility}
            onChange={(event) => onChange({ ...value, visibility: event.target.value })}
          >
            {questListFilterOptions.visibilities.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "ALL" ? "All visibility" : option.replaceAll("_", " ")}
              </MenuItem>
            ))}
          </TextField>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.25}>
          <TextField
            placeholder="Search quests..."
            size="small"
            sx={{ minWidth: { sm: 260 } }}
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
          />

          <TextField
            select
            size="small"
            sx={{ minWidth: 190 }}
            value={value.sortField}
            onChange={(event) =>
              onChange({
                ...value,
                sortField: event.target.value as QuestListFilters["sortField"],
              })
            }
          >
            {questSortFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {formatQuestSortFieldLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>
    </Stack>
  );
}
