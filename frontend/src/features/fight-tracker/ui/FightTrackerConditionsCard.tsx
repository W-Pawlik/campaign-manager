import { Icon } from "@iconify/react";
import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  Stack,
  Tabs,
  Tab,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { FightCombatant, FightCondition } from "@/features/fight-tracker/model/fightTracker.types";
import { formatDurationLabel, getConditionChipSx } from "@/features/fight-tracker/ui/fightTracker.utils";
import { EmptyState, SectionCard } from "@/shared/components";

type ConditionsTab = "combatants" | "global";

type FightTrackerConditionsCardProps = {
  combatants: FightCombatant[];
  globalConditions: FightCondition[];
  onAddCombatantCondition: () => void;
  onAddGlobalCondition: () => void;
  onRemoveCombatantCondition: (combatantId: string, conditionId: string) => void;
  onRemoveGlobalCondition: (conditionId: string) => void;
};

export function FightTrackerConditionsCard({
  combatants,
  globalConditions,
  onAddCombatantCondition,
  onAddGlobalCondition,
  onRemoveCombatantCondition,
  onRemoveGlobalCondition,
}: FightTrackerConditionsCardProps) {
  const [activeTab, setActiveTab] = useState<ConditionsTab>("combatants");

  const combatantsWithConditions = useMemo(
    () => combatants.filter((combatant) => combatant.conditions.length > 0),
    [combatants],
  );

  return (
    <SectionCard
      title="Conditions and special effects"
    >
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ justifyContent: "space-between" }}
        >
          <Tabs
            value={activeTab}
            onChange={(_event, value: ConditionsTab) => setActiveTab(value)}
          >
            <Tab label={`On combatants (${combatantsWithConditions.length})`} value="combatants" />
            <Tab label={`Global (${globalConditions.length})`} value="global" />
          </Tabs>

          <Stack direction="row" spacing={1}>
            <Button
              color="inherit"
              onClick={onAddCombatantCondition}
              size="small"
              startIcon={<Icon icon="solar:shield-plus-linear" />}
              variant="outlined"
            >
              Add state
            </Button>
            <Button
              color="inherit"
              onClick={onAddGlobalCondition}
              size="small"
              startIcon={<Icon icon="solar:cloudy-moon-linear" />}
              variant="outlined"
            >
              Add battlefield effect
            </Button>
          </Stack>
        </Stack>

        {activeTab === "combatants" ? (
          combatantsWithConditions.length > 0 ? (
            <Stack spacing={1.4}>
              {combatantsWithConditions.map((combatant, combatantIndex) => (
                <Box key={combatant.id}>
                  {combatantIndex > 0 ? <Divider sx={{ mb: 1.4 }} /> : null}
                  <Stack spacing={1}>
                    <Typography
                      sx={{
                        color: "#f1e2c0",
                        fontFamily: '"Georgia", "Times New Roman", serif',
                        fontSize: "1.25rem",
                      }}
                    >
                      {combatant.name}
                    </Typography>

                    {combatant.conditions.map((condition) => (
                      <ConditionRow
                        key={condition.id}
                        condition={condition}
                        onRemove={() => onRemoveCombatantCondition(combatant.id, condition.id)}
                      />
                    ))}
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <EmptyState
              description="Use states for conditions like restrained, frightened, blessed, poisoned, or any custom effect."
              title="No combatant conditions yet"
            />
          )
        ) : null}

        {activeTab === "global" ? (
          globalConditions.length > 0 ? (
            <Stack spacing={1}>
              {globalConditions.map((condition) => (
                <ConditionRow
                  key={condition.id}
                  condition={condition}
                  onRemove={() => onRemoveGlobalCondition(condition.id)}
                />
              ))}
            </Stack>
          ) : (
            <EmptyState
              description="Track rain, darkness, magical silence, wind, terrain hazards, or any custom battlefield rule."
              title="No battlefield effects yet"
            />
          )
        ) : null}
      </Stack>
    </SectionCard>
  );
}

function ConditionRow({
  condition,
  onRemove,
}: {
  condition: FightCondition;
  onRemove: () => void;
}) {
  return (
    <Box
      sx={{
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: 2.5,
        px: 1.3,
        py: 1.1,
      }}
    >
      <Stack
        direction={{ xs: "column", md: "row" }}
        spacing={1.2}
        sx={{ alignItems: { md: "center" }, justifyContent: "space-between" }}
      >
        <Stack spacing={0.5}>
          <Chip label={condition.name} size="small" sx={getConditionChipSx(condition)} />
          <Typography color="text.secondary" variant="body2">
            {condition.details}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
          <Typography color="text.secondary" variant="body2">
            {formatDurationLabel(condition.duration, condition.unit)}
          </Typography>
          <IconButton color="inherit" onClick={onRemove} size="small">
            <Icon icon="solar:trash-bin-minimalistic-linear" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
