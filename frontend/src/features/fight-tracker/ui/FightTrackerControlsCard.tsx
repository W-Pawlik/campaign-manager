import { Icon } from "@iconify/react";
import {
  Alert,
  Button,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { FightCombatant } from "@/features/fight-tracker/model/fightTracker.types";
import { SectionCard } from "@/shared/components";

type FightTrackerControlsCardProps = {
  canManageFight: boolean;
  combatants: FightCombatant[];
  onOpenImportDialog: () => void;
  onOpenQuickAddDialog: () => void;
  onQuickHpApply: (input: {
    combatantId: string;
    damage: number;
    healing: number;
    tempDelta: number;
  }) => void;
};

export function FightTrackerControlsCard({
  canManageFight,
  combatants,
  onOpenImportDialog,
  onOpenQuickAddDialog,
  onQuickHpApply,
}: FightTrackerControlsCardProps) {
  const [selectedCombatantId, setSelectedCombatantId] = useState<string>(combatants[0]?.id ?? "");
  const [damageValue, setDamageValue] = useState("5");
  const [healingValue, setHealingValue] = useState("0");
  const [tempHpValue, setTempHpValue] = useState("0");

  const resolvedCombatantId =
    combatants.some((combatant) => combatant.id === selectedCombatantId)
      ? selectedCombatantId
      : combatants[0]?.id ?? "";

  const selectedCombatant = useMemo(
    () => combatants.find((combatant) => combatant.id === resolvedCombatantId) ?? null,
    [combatants, resolvedCombatantId],
  );

  return (
    <Stack spacing={2}>
      {!canManageFight ? (
        <Alert severity="info">
          Only the DM can manage imports, quick additions, and HP changes in the final flow.
        </Alert>
      ) : null}

      <SectionCard title="Add and organize">
        <Stack spacing={1.1}>
          <Button
            color="inherit"
            disabled={!canManageFight}
            onClick={onOpenImportDialog}
            startIcon={<Icon icon="solar:inbox-in-linear" />}
            variant="outlined"
          >
            Import from campaign
          </Button>
          <Button
            color="inherit"
            disabled={!canManageFight}
            onClick={onOpenQuickAddDialog}
            startIcon={<Icon icon="solar:user-plus-linear" />}
            variant="outlined"
          >
            Quick add
          </Button>
          <Button
            color="inherit"
            disabled={!canManageFight}
            startIcon={<Icon icon="solar:layers-linear" />}
            variant="outlined"
          >
            Reorder from initiative
          </Button>
        </Stack>
      </SectionCard>

      <SectionCard title="Quick HP actions">
        <Stack spacing={1.2}>
            <TextField
              select
              size="small"
              value={resolvedCombatantId}
              onChange={(event) => setSelectedCombatantId(event.target.value)}
            >
            {combatants.map((combatant) => (
              <MenuItem key={combatant.id} value={combatant.id}>
                {combatant.name}
              </MenuItem>
            ))}
          </TextField>

          {selectedCombatant ? (
            <Typography color="text.secondary" variant="body2">
              Current HP: {selectedCombatant.hitPoints}/{selectedCombatant.maxHitPoints}
              {selectedCombatant.tempHitPoints > 0 ? ` - Temp ${selectedCombatant.tempHitPoints}` : ""}
            </Typography>
          ) : null}

          <Stack direction="row" spacing={1}>
            <TextField
              label="Damage"
              size="small"
              type="number"
              value={damageValue}
              onChange={(event) => setDamageValue(event.target.value)}
            />
            <TextField
              label="Heal"
              size="small"
              type="number"
              value={healingValue}
              onChange={(event) => setHealingValue(event.target.value)}
            />
            <TextField
              label="Temp HP"
              size="small"
              type="number"
              value={tempHpValue}
              onChange={(event) => setTempHpValue(event.target.value)}
            />
          </Stack>

          <Button
            disabled={!canManageFight || !resolvedCombatantId}
            onClick={() =>
              onQuickHpApply({
                combatantId: resolvedCombatantId,
                damage: Number(damageValue) || 0,
                healing: Number(healingValue) || 0,
                tempDelta: Number(tempHpValue) || 0,
              })
            }
            variant="contained"
          >
            Apply changes
          </Button>
        </Stack>
      </SectionCard>
    </Stack>
  );
}
