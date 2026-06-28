import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import type {
  FightEncounterHistoryEntry,
  FightTrackerState,
} from "@/features/fight-tracker/model/fightTracker.types";
import { formatDurationLabel, formatCombatantKind, getConditionChipSx, getCombatantKindChipSx } from "@/features/fight-tracker/ui/fightTracker.utils";
import { PageHeader, SectionCard } from "@/shared/components";

type FightTrackerEncounterDetailsProps = {
  encounter: FightTrackerState;
  encounterHistory: FightEncounterHistoryEntry[];
  onBack: () => void;
  onStart: () => void;
};

export function FightTrackerEncounterDetails({
  encounter,
  encounterHistory,
  onBack,
  onStart,
}: FightTrackerEncounterDetailsProps) {
  const relatedHistory = encounterHistory.filter(
    (entry) => entry.encounterName.toLowerCase() === encounter.encounterName.toLowerCase(),
  );

  return (
    <Stack spacing={3}>
      <PageHeader
        action={
          <Stack direction="row" spacing={1}>
            <Button color="inherit" onClick={onBack} startIcon={<Icon icon="solar:alt-arrow-left-linear" />} variant="outlined">
              Back
            </Button>
            <Button onClick={onStart} startIcon={<Icon icon="solar:play-bold" />} variant="contained">
              Start combat
            </Button>
          </Stack>
        }
        description={
          <Stack spacing={0.5}>
            <Typography color="text.secondary" variant="body1">
              Review combatants, battlefield effects, and notes before the DM starts initiative.
            </Typography>
            <Typography color="text.secondary" variant="body2">
              This encounter can be started multiple times and each run is saved to combat history.
            </Typography>
          </Stack>
        }
        title={encounter.encounterName}
        titleSx={{
          color: "#f4e4bf",
          fontFamily: '"Georgia", "Times New Roman", serif',
          fontSize: { xs: "2.4rem", md: "3rem" },
          lineHeight: 0.98,
        }}
      />

      <SectionCard title="Encounter overview">
        <Stack spacing={1.25}>
          <Typography variant="body1">{encounter.environmentName}</Typography>
          <Typography color="text.secondary" variant="body2">
            {encounter.environmentDetails}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            <Chip label={`${encounter.combatants.length} combatants`} size="small" />
            <Chip label={`${encounter.globalConditions.length} battlefield effects`} size="small" variant="outlined" />
            <Chip label={`${relatedHistory.length} previous runs`} size="small" variant="outlined" />
          </Stack>
        </Stack>
      </SectionCard>

      <Stack direction={{ xs: "column", xl: "row" }} spacing={2}>
        <SectionCard title="Combatants">
          <Stack spacing={1}>
            {encounter.combatants.map((combatant, index) => (
              <Stack key={combatant.id} spacing={0.7}>
                {index > 0 ? <Divider /> : null}
                <Stack direction={{ xs: "column", md: "row" }} spacing={1.2} sx={{ justifyContent: "space-between" }}>
                  <Stack spacing={0.45}>
                    <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                      <Typography variant="body1">{combatant.name}</Typography>
                      <Chip
                        label={formatCombatantKind(combatant.kind)}
                        size="small"
                        sx={getCombatantKindChipSx(combatant.kind)}
                      />
                    </Stack>
                    <Typography color="text.secondary" variant="body2">
                      {combatant.subtitle}
                    </Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    <Chip label={`Init ${combatant.initiative}`} size="small" variant="outlined" />
                    <Chip label={`HP ${combatant.hitPoints}/${combatant.maxHitPoints}`} size="small" variant="outlined" />
                    <Chip label={`AC ${combatant.armorClass}`} size="small" variant="outlined" />
                  </Stack>
                </Stack>

                {combatant.conditions.length > 0 ? (
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                    {combatant.conditions.map((condition) => (
                      <Chip
                        key={condition.id}
                        label={`${condition.name} - ${formatDurationLabel(condition.duration, condition.unit)}`}
                        size="small"
                        sx={getConditionChipSx(condition)}
                      />
                    ))}
                  </Stack>
                ) : null}
              </Stack>
            ))}
          </Stack>
        </SectionCard>

        <Stack spacing={2} sx={{ width: { xl: 360 } }}>
          <SectionCard title="Battlefield effects">
            <Stack spacing={1}>
              {encounter.globalConditions.length > 0 ? (
                encounter.globalConditions.map((condition) => (
                  <Stack
                    key={condition.id}
                    spacing={0.4}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 2,
                      px: 1.2,
                      py: 1,
                    }}
                  >
                    <Chip label={condition.name} size="small" sx={getConditionChipSx(condition)} />
                    <Typography color="text.secondary" variant="body2">
                      {condition.details}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary" variant="body2">
                  No battlefield effects prepared yet.
                </Typography>
              )}
            </Stack>
          </SectionCard>

          <SectionCard title="Previous runs">
            <Stack spacing={1}>
              {relatedHistory.length > 0 ? (
                relatedHistory.map((entry) => (
                  <Stack
                    key={entry.id}
                    spacing={0.35}
                    sx={{
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 2,
                      px: 1.2,
                      py: 1,
                    }}
                  >
                    <Typography variant="body2">{entry.finishedAtLabel}</Typography>
                    <Typography color="text.secondary" variant="caption">
                      {entry.outcomeLabel} - {entry.durationLabel}
                    </Typography>
                  </Stack>
                ))
              ) : (
                <Typography color="text.secondary" variant="body2">
                  This encounter has not been run yet.
                </Typography>
              )}
            </Stack>
          </SectionCard>
        </Stack>
      </Stack>
    </Stack>
  );
}
