import type { ReactNode } from "react";
import { Chip, Grid, Stack, Typography } from "@mui/material";

import type { FightTrackerState } from "@/features/fight-tracker/model/fightTracker.types";
import { getConditionChipSx } from "@/features/fight-tracker/ui/fightTracker.utils";
import { PageHeader, SectionCard } from "@/shared/components";

type FightTrackerHeaderProps = {
  action?: ReactNode;
  combatantCount: number;
  globalConditionsCount: number;
  isActiveRun: boolean;
  state: FightTrackerState;
};

export function FightTrackerHeader({
  action,
  combatantCount,
  globalConditionsCount,
  isActiveRun,
  state,
}: FightTrackerHeaderProps) {
  return (
    <Stack spacing={2.5}>
      <PageHeader
        action={action}
        description={
          <Stack spacing={0.6}>
            <Typography color="text.secondary" variant="body1">
              Track rounds, turns, HP, battlefield effects, and time-sensitive conditions while the DM drives the encounter.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              {isActiveRun
                ? "The encounter is live and every DM action updates the active combat state."
                : "Prepare initiative, conditions, and participants here before the DM starts the combat."}
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
        <Grid size={{ xs: 12, md: 4, xl: 3.3 }}>
          <SectionCard>
            <Stack spacing={0.45}>
              <Typography color="text.secondary" variant="caption">
                Encounter
              </Typography>
              <Typography
                sx={{
                  color: "#f3e0b5",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "1.75rem", md: "2.05rem" },
                  lineHeight: 1,
                }}
              >
                {state.encounterName}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                <Chip
                  label={isActiveRun ? "In progress" : "Ready to start"}
                  size="small"
                  sx={getConditionChipSx({
                    id: "status",
                    name: "",
                    details: "",
                    duration: null,
                    tone: isActiveRun ? "emerald" : "amber",
                    unit: "PERMANENT",
                  })}
                />
                <Chip
                  label={`${combatantCount} combatants`}
                  size="small"
                  sx={getConditionChipSx({
                    id: "count",
                    name: "",
                    details: "",
                    duration: null,
                    tone: "amber",
                    unit: "PERMANENT",
                  })}
                />
                <Chip
                  label={`${globalConditionsCount} global conditions`}
                  size="small"
                  sx={getConditionChipSx({
                    id: "cond-count",
                    name: "",
                    details: "",
                    duration: null,
                    tone: "violet",
                    unit: "PERMANENT",
                  })}
                />
              </Stack>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 6, md: 4, xl: 2.2 }}>
          <SectionCard>
            <Stack spacing={0.45}>
              <Typography color="text.secondary" variant="caption">
                Round
              </Typography>
              <Typography
                sx={{
                  color: "#f3e0b5",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "1.9rem", md: "2.35rem" },
                  lineHeight: 1,
                }}
              >
                {state.round}
              </Typography>
            </Stack>
          </SectionCard>
        </Grid>

        <Grid size={{ xs: 12, md: 4, xl: 6.5 }}>
          <SectionCard>
            <Stack spacing={0.45}>
              <Typography color="text.secondary" variant="caption">
                Environment
              </Typography>
              <Typography
                sx={{
                  color: "#f3e0b5",
                  fontFamily: '"Georgia", "Times New Roman", serif',
                  fontSize: { xs: "1.55rem", md: "1.85rem" },
                  lineHeight: 1,
                }}
              >
                {state.environmentName}
              </Typography>
              <Typography color="text.secondary" variant="body2">
                {state.environmentDetails}
              </Typography>
            </Stack>
          </SectionCard>
        </Grid>
      </Grid>
    </Stack>
  );
}
