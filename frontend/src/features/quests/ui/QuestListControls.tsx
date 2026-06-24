import { Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

import {
  formatQuestDatePresenceLabel,
  formatQuestSortFieldLabel,
  questDatePresenceFilterOptions,
  questListFilterOptions,
  questSortDirectionOptions,
  questSortFieldOptions,
  type QuestListFilters,
} from "@/features/quests/ui/questListUi.utils";

type QuestListControlsProps = {
  onChange: (nextFilters: QuestListFilters) => void;
  value: QuestListFilters;
};

function toLabel(value: string): string {
  return value === "ALL" ? "All" : value.replaceAll("_", " ");
}

export function QuestListControls({ onChange, value }: QuestListControlsProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
        <Typography color="text.secondary" variant="body2">
          Filter and sort quests by the data currently available in the list endpoint.
        </Typography>
        <Button onClick={() => onChange({
          datePresence: "ALL",
          priority: "ALL",
          sortDirection: "DESC",
          sortField: "UPDATED_AT",
          status: "ALL",
          type: "ALL",
          visibility: "ALL",
        })} variant="text">
          Reset
        </Button>
      </Stack>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Status"
            onChange={(event) => onChange({ ...value, status: event.target.value })}
            select
            value={value.status}
          >
            {questListFilterOptions.statuses.map((option) => (
              <MenuItem key={option} value={option}>
                {toLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Type"
            onChange={(event) => onChange({ ...value, type: event.target.value })}
            select
            value={value.type}
          >
            {questListFilterOptions.types.map((option) => (
              <MenuItem key={option} value={option}>
                {toLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Priority"
            onChange={(event) => onChange({ ...value, priority: event.target.value })}
            select
            value={value.priority}
          >
            {questListFilterOptions.priorities.map((option) => (
              <MenuItem key={option} value={option}>
                {toLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Visibility"
            onChange={(event) => onChange({ ...value, visibility: event.target.value })}
            select
            value={value.visibility}
          >
            {questListFilterOptions.visibilities.map((option) => (
              <MenuItem key={option} value={option}>
                {toLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            fullWidth
            label="Timeline filter"
            onChange={(event) => onChange({ ...value, datePresence: event.target.value as QuestListFilters["datePresence"] })}
            select
            value={value.datePresence}
          >
            {questDatePresenceFilterOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {formatQuestDatePresenceLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            fullWidth
            label="Sort by"
            onChange={(event) => onChange({ ...value, sortField: event.target.value as QuestListFilters["sortField"] })}
            select
            value={value.sortField}
          >
            {questSortFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {formatQuestSortFieldLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 4 }}>
          <TextField
            fullWidth
            label="Direction"
            onChange={(event) => onChange({ ...value, sortDirection: event.target.value as QuestListFilters["sortDirection"] })}
            select
            value={value.sortDirection}
          >
            {questSortDirectionOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {option === "DESC" ? "Descending" : "Ascending"}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
      </Grid>
    </Stack>
  );
}
