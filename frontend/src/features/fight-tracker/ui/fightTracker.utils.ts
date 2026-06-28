import type { SxProps, Theme } from "@mui/material";

import type {
  FightCombatant,
  FightCombatantKind,
  FightCondition,
  FightConditionTone,
  FightConditionUnit,
  FightTrackerFilter,
} from "@/features/fight-tracker/model/fightTracker.types";

const toneStyles: Record<FightConditionTone, { border: string; bg: string; color: string }> = {
  violet: {
    border: "rgba(170, 112, 255, 0.35)",
    bg: "rgba(119, 69, 201, 0.16)",
    color: "#c8abff",
  },
  emerald: {
    border: "rgba(96, 183, 123, 0.35)",
    bg: "rgba(43, 96, 58, 0.18)",
    color: "#9ad99d",
  },
  amber: {
    border: "rgba(219, 166, 63, 0.34)",
    bg: "rgba(128, 88, 28, 0.18)",
    color: "#f0c974",
  },
  blue: {
    border: "rgba(82, 148, 219, 0.34)",
    bg: "rgba(31, 64, 112, 0.18)",
    color: "#93c9ff",
  },
  red: {
    border: "rgba(219, 91, 84, 0.34)",
    bg: "rgba(105, 28, 28, 0.2)",
    color: "#ff9b97",
  },
  slate: {
    border: "rgba(129, 138, 156, 0.34)",
    bg: "rgba(71, 79, 94, 0.18)",
    color: "#d0d6df",
  },
};

export function getConditionChipSx(condition: FightCondition): SxProps<Theme> {
  const tone = toneStyles[condition.tone];

  return {
    bgcolor: tone.bg,
    border: "1px solid",
    borderColor: tone.border,
    color: tone.color,
    fontWeight: 700,
  };
}

export function formatDurationLabel(duration: number | null, unit: FightConditionUnit): string {
  if (unit === "PERMANENT" || duration === null) {
    return "Until removed";
  }

  return `${duration} ${unit === "ROUNDS" ? (duration === 1 ? "round" : "rounds") : duration === 1 ? "turn" : "turns"}`;
}

export function formatCombatantKind(kind: FightCombatantKind): string {
  switch (kind) {
    case "HERO":
      return "Hero";
    case "NPC":
      return "NPC";
    case "MONSTER":
      return "Monster";
    default:
      return "Quick";
  }
}

export function getCombatantKindChipSx(kind: FightCombatantKind): SxProps<Theme> {
  switch (kind) {
    case "HERO":
      return {
        bgcolor: "rgba(49, 113, 183, 0.16)",
        border: "1px solid rgba(49, 113, 183, 0.34)",
        color: "#8bc4ff",
      };
    case "NPC":
      return {
        bgcolor: "rgba(103, 129, 162, 0.14)",
        border: "1px solid rgba(103, 129, 162, 0.3)",
        color: "#d0dde9",
      };
    case "MONSTER":
      return {
        bgcolor: "rgba(169, 62, 62, 0.14)",
        border: "1px solid rgba(169, 62, 62, 0.3)",
        color: "#ff9a8d",
      };
    default:
      return {
        bgcolor: "rgba(189, 151, 90, 0.14)",
        border: "1px solid rgba(189, 151, 90, 0.3)",
        color: "#eccf8e",
      };
  }
}

export function getCombatantHpRatio(combatant: FightCombatant): number {
  if (combatant.maxHitPoints <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(1, combatant.hitPoints / combatant.maxHitPoints));
}

export function getCombatantHpBarSx(combatant: FightCombatant): SxProps<Theme> {
  const ratio = getCombatantHpRatio(combatant);
  const color =
    ratio <= 0.25 ? "#df4f4f" : ratio <= 0.55 ? "#f09d48" : "#56bb6a";

  return {
    "& .MuiLinearProgress-bar": {
      background: `linear-gradient(90deg, ${color} 0%, ${color} 75%, rgba(255,255,255,0.18) 100%)`,
      borderRadius: 999,
    },
    backgroundColor: "rgba(255,255,255,0.06)",
    borderRadius: 999,
    height: 8,
  };
}

export function getQueue(excludingCurrent: FightCombatant[], filter: FightTrackerFilter) {
  if (filter === "ALL") {
    return excludingCurrent;
  }

  return excludingCurrent.filter((combatant) => combatant.kind === filter);
}
