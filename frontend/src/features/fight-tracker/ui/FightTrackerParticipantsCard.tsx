import { Icon } from "@iconify/react";
import {
  Button,
  Chip,
  IconButton,
  LinearProgress,
  MenuItem,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type {
  FightCombatant,
  FightTrackerFilter,
} from "@/features/fight-tracker/model/fightTracker.types";
import {
  formatCombatantKind,
  getCombatantHpBarSx,
  getCombatantKindChipSx,
} from "@/features/fight-tracker/ui/fightTracker.utils";
import { EmptyState, SectionCard } from "@/shared/components";

type FightTrackerParticipantsCardProps = {
  combatants: FightCombatant[];
  onAddCombatant: () => void;
  onAddCondition: (combatantId: string) => void;
  onRemoveCombatant: (combatantId: string) => void;
  onUpdateInitiative: (combatantId: string, delta: number) => void;
  onSelectCombatant: (combatantId: string) => void;
};

export function FightTrackerParticipantsCard({
  combatants,
  onAddCombatant,
  onAddCondition,
  onRemoveCombatant,
  onSelectCombatant,
  onUpdateInitiative,
}: FightTrackerParticipantsCardProps) {
  const [filter, setFilter] = useState<FightTrackerFilter>("ALL");
  const [searchValue, setSearchValue] = useState("");
  const filteredCombatants = useMemo(
    () =>
      combatants.filter((combatant) => {
        const matchesFilter = filter === "ALL" ? true : combatant.kind === filter;
        const matchesSearch =
          searchValue.trim().length === 0
            ? true
            : `${combatant.name} ${combatant.subtitle}`.toLowerCase().includes(searchValue.toLowerCase());

        return matchesFilter && matchesSearch;
      }),
    [combatants, filter, searchValue],
  );

  return (
    <SectionCard title="Combatants roster">
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between" }}
        >
          <Tabs value={filter} onChange={(_event, value: FightTrackerFilter) => setFilter(value)}>
            <Tab label={`All (${combatants.length})`} value="ALL" />
            <Tab
              label={`Heroes (${combatants.filter((combatant) => combatant.kind === "HERO").length})`}
              value="HERO"
            />
            <Tab
              label={`NPCs (${combatants.filter((combatant) => combatant.kind === "NPC").length})`}
              value="NPC"
            />
            <Tab
              label={`Monsters (${combatants.filter((combatant) => combatant.kind === "MONSTER").length})`}
              value="MONSTER"
            />
          </Tabs>

          <Stack direction="row" spacing={1}>
            <TextField
              placeholder="Search combatants"
              size="small"
              value={searchValue}
              onChange={(event) => setSearchValue(event.target.value)}
            />
            <Button
              color="inherit"
              onClick={onAddCombatant}
              size="small"
              startIcon={<Icon icon="solar:user-plus-linear" />}
              variant="outlined"
            >
              Add quick
            </Button>
          </Stack>
        </Stack>

        {filteredCombatants.length === 0 ? (
          <EmptyState
            description="Try a different filter or add new combatants to the tracker."
            title="No combatants match this view"
          />
        ) : (
          <Stack spacing={0.9}>
            {filteredCombatants.map((combatant) => (
              <Stack
                key={combatant.id}
                direction={{ xs: "column", lg: "row" }}
                spacing={1.5}
                sx={{
                  alignItems: { lg: "center" },
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 2.25,
                  px: 1.25,
                  py: 1.1,
                }}
              >
                <Stack spacing={0.35} sx={{ flexGrow: 1, minWidth: 0 }}>
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
                  {combatant.conditions.length > 0 ? (
                    <Stack direction="row" spacing={0.8} sx={{ flexWrap: "wrap", rowGap: 0.8 }}>
                      {combatant.conditions.map((condition) => (
                        <Chip key={condition.id} label={condition.name} size="small" variant="outlined" />
                      ))}
                    </Stack>
                  ) : null}
                </Stack>

                <StatEditor
                  label="Init"
                  value={combatant.initiative}
                  onDecrease={() => onUpdateInitiative(combatant.id, -1)}
                  onIncrease={() => onUpdateInitiative(combatant.id, 1)}
                />

                <Stack spacing={0.45} sx={{ minWidth: 150 }}>
                  <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                    <Typography color="text.secondary" variant="caption">
                      HP
                    </Typography>
                    <Typography variant="body2">
                      {combatant.hitPoints}/{combatant.maxHitPoints}
                    </Typography>
                  </Stack>
                  <LinearProgress
                    sx={getCombatantHpBarSx(combatant)}
                    value={(combatant.hitPoints / combatant.maxHitPoints) * 100}
                    variant="determinate"
                  />
                </Stack>

                <TextField
                  disabled
                  select
                  size="small"
                  value={combatant.armorClass.toString()}
                  sx={{ minWidth: 88 }}
                >
                  <MenuItem value={combatant.armorClass.toString()}>
                    AC {combatant.armorClass}
                  </MenuItem>
                </TextField>

                <Stack direction="row" spacing={0.25}>
                  <IconButton color="inherit" onClick={() => onSelectCombatant(combatant.id)} size="small">
                    <Icon icon="solar:eye-linear" />
                  </IconButton>
                  <IconButton
                    color="inherit"
                    onClick={() => onAddCondition(combatant.id)}
                    size="small"
                  >
                    <Icon icon="solar:shield-plus-linear" />
                  </IconButton>
                  <IconButton color="inherit" onClick={() => onRemoveCombatant(combatant.id)} size="small">
                    <Icon icon="solar:trash-bin-minimalistic-linear" />
                  </IconButton>
                </Stack>
              </Stack>
            ))}
          </Stack>
        )}
      </Stack>
    </SectionCard>
  );
}

function StatEditor({
  label,
  value,
  onDecrease,
  onIncrease,
}: {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) {
  return (
    <Stack direction="row" spacing={0.5} sx={{ alignItems: "center" }}>
      <Typography color="text.secondary" variant="caption">
        {label}
      </Typography>
      <IconButton color="inherit" onClick={onDecrease} size="small">
        <Icon icon="solar:minus-circle-linear" />
      </IconButton>
      <Typography sx={{ minWidth: 20, textAlign: "center" }} variant="body2">
        {value}
      </Typography>
      <IconButton color="inherit" onClick={onIncrease} size="small">
        <Icon icon="solar:add-circle-linear" />
      </IconButton>
    </Stack>
  );
}
