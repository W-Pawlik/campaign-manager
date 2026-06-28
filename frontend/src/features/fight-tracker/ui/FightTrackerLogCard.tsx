import { Box, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useMemo, useState } from "react";

import type { FightLogEntry } from "@/features/fight-tracker/model/fightTracker.types";
import { SectionCard } from "@/shared/components";

type FightTrackerLogCardProps = {
  log: FightLogEntry[];
};

type LogFilter = "ALL" | FightLogEntry["tone"];

export function FightTrackerLogCard({ log }: FightTrackerLogCardProps) {
  const [filter, setFilter] = useState<LogFilter>("ALL");

  const visibleEntries = useMemo(
    () => (filter === "ALL" ? log : log.filter((entry) => entry.tone === filter)),
    [filter, log],
  );

  return (
    <SectionCard title="Combat history">
      <Stack spacing={1.35}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
          <Typography color="text.secondary" variant="body2">
            DM-facing event feed for turn changes, HP updates, and condition changes.
          </Typography>
          <TextField
            select
            size="small"
            sx={{ minWidth: 170 }}
            value={filter}
            onChange={(event) => setFilter(event.target.value as LogFilter)}
          >
            <MenuItem value="ALL">All events</MenuItem>
            <MenuItem value="system">System</MenuItem>
            <MenuItem value="damage">Damage</MenuItem>
            <MenuItem value="heal">Healing</MenuItem>
            <MenuItem value="effect">Effects</MenuItem>
          </TextField>
        </Stack>

        <Stack
          spacing={0}
          sx={{
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: 2.5,
            overflow: "hidden",
          }}
        >
          {visibleEntries.map((entry, index) => (
            <Box
              key={entry.id}
              sx={{
                borderTop: index === 0 ? "none" : "1px solid rgba(255,255,255,0.06)",
                px: 1.4,
                py: 1.2,
              }}
            >
              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Typography color="text.secondary" sx={{ minWidth: 70 }} variant="caption">
                  {entry.timeLabel}
                </Typography>
                <Typography
                  color={
                    entry.tone === "damage"
                      ? "#ff9a8d"
                      : entry.tone === "heal"
                        ? "#9ad99d"
                        : entry.tone === "effect"
                          ? "#d5c287"
                          : "text.primary"
                  }
                  variant="body2"
                >
                  {entry.text}
                </Typography>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Stack>
    </SectionCard>
  );
}
