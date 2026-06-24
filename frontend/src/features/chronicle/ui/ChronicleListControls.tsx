import { Button, Grid, MenuItem, Stack, TextField, Typography } from "@mui/material";

import {
  chronicleDatePresenceOptions,
  chronicleListFilterOptions,
  chronicleSortDirectionOptions,
  chronicleSortFieldOptions,
  defaultChronicleListFilters,
  formatChronicleDatePresenceLabel,
  formatChronicleSortFieldLabel,
  type ChronicleListFilters,
} from "@/features/chronicle/ui/chronicleListUi.utils";

type ChronicleListControlsProps = {
  onChange: (value: ChronicleListFilters) => void;
  value: ChronicleListFilters;
};

function toLabel(value: string): string {
  return value === "ALL" ? "All" : value.replaceAll("_", " ");
}

export function ChronicleListControls({ onChange, value }: ChronicleListControlsProps) {
  return (
    <Stack spacing={1.5}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
        <Typography color="text.secondary" variant="body2">
          Filter and sort chronicle entries by visibility, linked session, and available dates.
        </Typography>
        <Button onClick={() => onChange(defaultChronicleListFilters)} variant="text">
          Reset
        </Button>
      </Stack>

      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Visibility"
            onChange={(event) => onChange({ ...value, visibility: event.target.value })}
            select
            value={value.visibility}
          >
            {chronicleListFilterOptions.visibilities.map((option) => (
              <MenuItem key={option} value={option}>
                {toLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Entry filter"
            onChange={(event) =>
              onChange({ ...value, datePresence: event.target.value as ChronicleListFilters["datePresence"] })
            }
            select
            value={value.datePresence}
          >
            {chronicleDatePresenceOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {formatChronicleDatePresenceLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Sort by"
            onChange={(event) =>
              onChange({ ...value, sortField: event.target.value as ChronicleListFilters["sortField"] })
            }
            select
            value={value.sortField}
          >
            {chronicleSortFieldOptions.map((option) => (
              <MenuItem key={option} value={option}>
                {formatChronicleSortFieldLabel(option)}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TextField
            fullWidth
            label="Direction"
            onChange={(event) =>
              onChange({ ...value, sortDirection: event.target.value as ChronicleListFilters["sortDirection"] })
            }
            select
            value={value.sortDirection}
          >
            {chronicleSortDirectionOptions.map((option) => (
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
