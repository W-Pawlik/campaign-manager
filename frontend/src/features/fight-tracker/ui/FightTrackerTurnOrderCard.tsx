import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  LinearProgress,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import type {
  FightCombatant,
  FightTrackerFilter,
} from "@/features/fight-tracker/model/fightTracker.types";
import {
  formatCombatantKind,
  getCombatantHpBarSx,
  getCombatantKindChipSx,
  getQueue,
} from "@/features/fight-tracker/ui/fightTracker.utils";
import { SectionCard } from "@/shared/components";

type FightTrackerTurnOrderCardProps = {
  canManageFight: boolean;
  combatants: FightCombatant[];
  currentCombatant: FightCombatant | null;
  currentIndex: number;
  filter: FightTrackerFilter;
  hasUndo: boolean;
  isTimerRunning: boolean;
  onAdvanceTurn: () => void;
  onEndEncounter: () => void;
  onDeckCombatant: FightCombatant | null;
  onOpenConditionDialog: () => void;
  onSelectCombatant: (combatantId: string) => void;
  onToggleTimer: () => void;
  onUndo: () => void;
  timerLabel: string;
};

function AvatarFallback({ kind }: { kind: FightCombatant["kind"] }) {
  const icon =
    kind === "HERO"
      ? "game-icons:crested-helmet"
      : kind === "NPC"
        ? "solar:user-rounded-bold"
        : "game-icons:crossed-slashes";

  return <Icon icon={icon} style={{ fontSize: 22 }} />;
}

function QueueRow({
  combatant,
  highlighted,
  label,
  onClick,
}: {
  combatant: FightCombatant;
  highlighted: boolean;
  label?: string;
  onClick: () => void;
}) {
  return (
    <ListItemButton
      onClick={onClick}
      sx={{
        alignItems: "stretch",
        border: "1px solid",
        borderColor: highlighted ? "rgba(233, 178, 72, 0.38)" : "divider",
        borderRadius: 2.5,
        mb: 1,
        px: 1.5,
        py: 1.2,
        ...(highlighted
          ? {
              background:
                "linear-gradient(90deg, rgba(120, 24, 24, 0.42) 0%, rgba(120, 24, 24, 0.14) 100%)",
              boxShadow: "0 0 0 1px rgba(229, 168, 64, 0.12), 0 18px 35px rgba(0, 0, 0, 0.22)",
            }
          : {}),
      }}
    >
      <Stack spacing={1.1} sx={{ width: "100%" }}>
        <Stack direction="row" spacing={1.35} sx={{ alignItems: "center" }}>
          <Avatar
            src={combatant.avatarUrl ?? undefined}
            sx={{
              bgcolor: highlighted ? "rgba(233, 178, 72, 0.14)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(233, 178, 72, 0.28)",
              color: highlighted ? "#efce83" : "#c2c7d0",
              height: highlighted ? 62 : 48,
              width: highlighted ? 62 : 48,
            }}
          >
            <AvatarFallback kind={combatant.kind} />
          </Avatar>

          <Stack spacing={0.4} sx={{ flexGrow: 1, minWidth: 0 }}>
            {label ? (
              <Typography color={highlighted ? "#efbf6d" : "text.secondary"} variant="caption">
                {label}
              </Typography>
            ) : null}
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Typography
                sx={{
                  color: highlighted ? "#f6e4bc" : "#efe4cb",
                  fontFamily: highlighted ? '"Georgia", "Times New Roman", serif' : "inherit",
                  fontSize: highlighted ? "1.85rem" : "1rem",
                  lineHeight: 1,
                }}
              >
                {combatant.name}
              </Typography>
              <Chip
                label={formatCombatantKind(combatant.kind)}
                size="small"
                sx={getCombatantKindChipSx(combatant.kind)}
              />
            </Stack>
            <Typography color="text.secondary" noWrap variant="body2">
              {combatant.subtitle}
            </Typography>
          </Stack>

          <Stack spacing={0.45} sx={{ minWidth: highlighted ? 160 : 112 }}>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
              <Typography color="text.secondary" variant="caption">
                Init
              </Typography>
              <Typography variant="body2">{combatant.initiative}</Typography>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between" }}>
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
        </Stack>

        {highlighted && combatant.conditions.length > 0 ? (
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {combatant.conditions.map((condition) => (
              <Chip key={condition.id} label={condition.name} size="small" sx={{ color: "inherit" }} variant="outlined" />
            ))}
          </Stack>
        ) : null}
      </Stack>
    </ListItemButton>
  );
}

export function FightTrackerTurnOrderCard({
  canManageFight,
  combatants,
  currentCombatant,
  currentIndex,
  filter,
  hasUndo,
  isTimerRunning,
  onAdvanceTurn,
  onEndEncounter,
  onDeckCombatant,
  onOpenConditionDialog,
  onSelectCombatant,
  onToggleTimer,
  onUndo,
  timerLabel,
}: FightTrackerTurnOrderCardProps) {
  const queue = getQueue(
    combatants.filter((_, index) => index !== currentIndex),
    filter,
  );

  return (
    <SectionCard>
      <Stack spacing={1.5}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          sx={{
            alignItems: { lg: "center" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={0.2}>
            <Typography component="h2" variant="h6">
              Initiative order
            </Typography>
            <Typography color="text.secondary" variant="body2">
              Current: {currentCombatant?.name ?? "None selected"} | On deck: {onDeckCombatant?.name ?? "No next combatant"}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: { lg: "flex-end" } }}
          >
            <Chip
              label={timerLabel}
              sx={{
                border: "1px solid rgba(233, 178, 72, 0.25)",
                color: "#f3e0b5",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: "0.95rem",
                height: 34,
              }}
              variant="outlined"
            />
            <Button
              color="inherit"
              disabled={!canManageFight}
              onClick={onToggleTimer}
              startIcon={
                <Icon icon={isTimerRunning ? "solar:pause-linear" : "solar:play-linear"} />
              }
              variant="outlined"
            >
              {isTimerRunning ? "Pause timer" : "Resume timer"}
            </Button>
            <Button
              color="inherit"
              disabled={!canManageFight || !hasUndo}
              onClick={onUndo}
              startIcon={<Icon icon="solar:undo-left-round-linear" />}
              variant="outlined"
            >
              Undo
            </Button>
            <Button
              color="inherit"
              disabled={!canManageFight}
              onClick={onOpenConditionDialog}
              startIcon={<Icon icon="solar:shield-plus-linear" />}
              variant="outlined"
            >
              Add state
            </Button>
            <Button
              disabled={!canManageFight || combatants.length === 0}
              onClick={onAdvanceTurn}
              startIcon={<Icon icon="solar:round-arrow-right-linear" />}
              variant="contained"
            >
              Next turn
            </Button>
            <Button
              color="inherit"
              disabled={!canManageFight}
              onClick={onEndEncounter}
              startIcon={<Icon icon="solar:stop-circle-linear" />}
              sx={{
                borderColor: "rgba(219, 84, 84, 0.34)",
                color: "#ff9e97",
              }}
              variant="outlined"
            >
              End combat
            </Button>
          </Stack>
        </Stack>

        <Stack spacing={0.25}>
          {currentCombatant ? (
            <QueueRow
              combatant={currentCombatant}
              highlighted
              label="Current turn"
              onClick={() => onSelectCombatant(currentCombatant.id)}
            />
          ) : null}

          {onDeckCombatant ? (
            <QueueRow
              combatant={onDeckCombatant}
              label="On deck"
              highlighted={false}
              onClick={() => onSelectCombatant(onDeckCombatant.id)}
            />
          ) : null}

          <List disablePadding sx={{ mt: 0.25 }}>
            {queue
              .filter((combatant) => combatant.id !== onDeckCombatant?.id)
              .map((combatant, index) => (
                <ListItemButton
                  key={combatant.id}
                  onClick={() => onSelectCombatant(combatant.id)}
                  sx={{
                    alignItems: "center",
                    borderBottom: "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 1.5,
                    columnGap: 1.25,
                    px: 1,
                    py: 1,
                  }}
                >
                  <Typography color="text.secondary" sx={{ minWidth: 18 }} variant="body2">
                    {index + 1 + (onDeckCombatant ? 2 : 1)}
                  </Typography>
                  <Avatar
                    src={combatant.avatarUrl ?? undefined}
                    sx={{
                      bgcolor: "rgba(255,255,255,0.05)",
                      color: "#cfd3dc",
                      height: 34,
                      width: 34,
                    }}
                  >
                    <AvatarFallback kind={combatant.kind} />
                  </Avatar>
                  <ListItemText
                    primary={combatant.name}
                    secondary={`${combatant.initiative} init - ${combatant.hitPoints}/${combatant.maxHitPoints} HP`}
                  />
                  <Box sx={{ width: 84 }}>
                    <LinearProgress
                      sx={getCombatantHpBarSx(combatant)}
                      value={(combatant.hitPoints / combatant.maxHitPoints) * 100}
                      variant="determinate"
                    />
                  </Box>
                </ListItemButton>
              ))}
          </List>
        </Stack>
      </Stack>
    </SectionCard>
  );
}
