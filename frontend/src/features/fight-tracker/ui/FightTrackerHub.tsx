import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type {
  FightEncounterHistoryEntry,
  FightPreparedEncounter,
} from "@/features/fight-tracker/model/fightTracker.types";
import { PageHeader, SectionCard } from "@/shared/components";

type FightTrackerHubProps = {
  encounterHistory: FightEncounterHistoryEntry[];
  onCreateEncounter: () => void;
  onOpenPreparedEncounter: (encounterId: string) => void;
  preparedEncounters: FightPreparedEncounter[];
};

export function FightTrackerHub({
  encounterHistory,
  onCreateEncounter,
  onOpenPreparedEncounter,
  preparedEncounters,
}: FightTrackerHubProps) {
  return (
    <Stack spacing={3}>
      <PageHeader
        action={
          <Button onClick={onCreateEncounter} startIcon={<Icon icon="solar:swords-bold" />} variant="contained">
            Create encounter
          </Button>
        }
        description={
          <Stack spacing={0.6}>
            <Typography color="text.secondary" variant="body1">
              Prepare encounters before initiative starts, reopen recent combat history, and enter each encounter before the DM starts the battle.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Once combat starts, the tracker switches into the live initiative view.
            </Typography>
          </Stack>
        }
        title="Fight tracker"
        titleSx={{
          color: "#f4e4bf",
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: { xs: "2.55rem", md: "3.35rem" },
          lineHeight: 0.98,
        }}
      />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, xl: 7 }}>
          <SectionCard title="Prepared encounters">
            <Stack spacing={1.25}>
              {preparedEncounters.map((encounter) => (
                <Stack
                  key={encounter.id}
                  direction={{ xs: "column", lg: "row" }}
                  spacing={1.5}
                  sx={{
                    alignItems: { lg: "center" },
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2.5,
                    px: 1.5,
                    py: 1.35,
                  }}
                >
                  <Stack spacing={0.45} sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      sx={{
                        color: "#f3e0b5",
                        fontFamily: '"Georgia", "Times New Roman", serif',
                        fontSize: "1.55rem",
                        lineHeight: 1,
                      }}
                    >
                      {encounter.encounterName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {encounter.environmentName}
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {encounter.description}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                      <Chip label={`${encounter.combatantCount} combatants`} size="small" />
                      <Chip label={`${encounter.conditionCount} effects`} size="small" variant="outlined" />
                      <Chip label={encounter.updatedAtLabel} size="small" variant="outlined" />
                    </Stack>
                  </Stack>

                  <Button
                    color="inherit"
                    onClick={() => onOpenPreparedEncounter(encounter.id)}
                    startIcon={<Icon icon="solar:arrow-right-up-linear" />}
                    variant="outlined"
                  >
                    Open encounter
                  </Button>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, xl: 5 }}>
          <SectionCard title="Combat history">
            <Stack spacing={1.2}>
              {encounterHistory.map((entry) => (
                <Stack
                  key={entry.id}
                  spacing={0.55}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2.5,
                    px: 1.4,
                    py: 1.2,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Typography variant="body1">{entry.encounterName}</Typography>
                    <Typography color="text.secondary" variant="caption">
                      {entry.finishedAtLabel}
                    </Typography>
                  </Stack>
                  <Typography color="text.secondary" variant="body2">
                    {entry.environmentName}
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    <Chip label={entry.outcomeLabel} size="small" />
                    <Chip label={`${entry.roundsCompleted} rounds`} size="small" variant="outlined" />
                    <Chip label={entry.durationLabel} size="small" variant="outlined" />
                  </Stack>
                </Stack>
              ))}
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
