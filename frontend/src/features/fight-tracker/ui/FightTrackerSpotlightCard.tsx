import { Icon } from "@iconify/react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  LinearProgress,
  Stack,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { FightCombatant } from "@/features/fight-tracker/model/fightTracker.types";
import {
  formatCombatantKind,
  formatDurationLabel,
  getCombatantHpBarSx,
  getCombatantKindChipSx,
  getConditionChipSx,
} from "@/features/fight-tracker/ui/fightTracker.utils";
import { EmptyState, SectionCard } from "@/shared/components";

type SpotlightTab = "overview" | "effects" | "details" | "notes";

type FightTrackerSpotlightCardProps = {
  combatant: FightCombatant | null;
};

function AvatarFallback({ kind }: { kind: FightCombatant["kind"] }) {
  const icon =
    kind === "HERO"
      ? "game-icons:crested-helmet"
      : kind === "NPC"
        ? "solar:user-rounded-bold"
        : "game-icons:crossed-slashes";

  return <Icon icon={icon} style={{ fontSize: 30 }} />;
}

export function FightTrackerSpotlightCard({ combatant }: FightTrackerSpotlightCardProps) {
  const [activeTab, setActiveTab] = useState<SpotlightTab>("overview");

  const derivedDetailRows = useMemo(() => {
    if (!combatant) {
      return [];
    }

    return [
      { label: "Initiative", value: combatant.initiative.toString() },
      { label: "Armor class", value: combatant.armorClass.toString() },
      { label: "Speed", value: combatant.speed },
      {
        label: "Temp HP",
        value: combatant.tempHitPoints > 0 ? combatant.tempHitPoints.toString() : "None",
      },
    ];
  }, [combatant]);

  if (!combatant) {
    return (
      <SectionCard title="Active combatant">
        <EmptyState
          description="Add or import combatants to start the encounter flow."
          title="No one in initiative yet"
        />
      </SectionCard>
    );
  }

  return (
    <SectionCard>
      <Stack spacing={2.2}>
        <Stack
          direction={{ xs: "column", lg: "row" }}
          spacing={2}
          sx={{ alignItems: { lg: "center" }, justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", minWidth: 0 }}>
            <Avatar
              src={combatant.avatarUrl ?? undefined}
              sx={{
                bgcolor: "rgba(233, 178, 72, 0.12)",
                border: "1px solid rgba(233, 178, 72, 0.26)",
                color: "#efce83",
                height: 72,
                width: 72,
              }}
            >
              <AvatarFallback kind={combatant.kind} />
            </Avatar>

            <Stack spacing={0.5} sx={{ minWidth: 0 }}>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Typography
                  sx={{
                    color: "#f4e4bf",
                    fontFamily: '"Georgia", "Times New Roman", serif',
                    fontSize: { xs: "2rem", md: "2.4rem" },
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
              <Typography color="text.secondary" variant="body2">
                {combatant.subtitle}
              </Typography>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                {combatant.tags.map((tag) => (
                  <Chip key={tag} label={tag} size="small" variant="outlined" />
                ))}
              </Stack>
            </Stack>
          </Stack>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            sx={{ alignItems: { sm: "center" }, flexWrap: "wrap", rowGap: 2 }}
          >
            <StatPill
              icon="solar:heart-outline"
              label="HP"
              value={`${combatant.hitPoints}/${combatant.maxHitPoints}`}
            />
            <StatPill icon="mdi:shield-outline" label="AC" value={combatant.armorClass.toString()} />
            <StatPill
              icon="solar:bolt-outline"
              label="Initiative"
              value={combatant.initiative.toString()}
            />
          </Stack>
        </Stack>

        <LinearProgress
          sx={getCombatantHpBarSx(combatant)}
          value={(combatant.hitPoints / combatant.maxHitPoints) * 100}
          variant="determinate"
        />

        <Tabs value={activeTab} onChange={(_event, value: SpotlightTab) => setActiveTab(value)}>
          <Tab label="Overview" value="overview" />
          <Tab label="Effects" value="effects" />
          <Tab label="Details" value="details" />
          <Tab label="Notes" value="notes" />
        </Tabs>

        {activeTab === "overview" ? (
          <Stack spacing={1.25}>
            <Typography color="text.secondary" variant="body2">
              {combatant.notes || "No tactical notes added yet."}
            </Typography>
            <Stack direction="row" spacing={1.1} sx={{ flexWrap: "wrap", rowGap: 1.1 }}>
              {derivedDetailRows.map((row) => (
                <Box
                  key={row.label}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2,
                    minWidth: 150,
                    px: 1.2,
                    py: 1,
                  }}
                >
                  <Typography color="text.secondary" variant="caption">
                    {row.label}
                  </Typography>
                  <Typography variant="body1">{row.value}</Typography>
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : null}

        {activeTab === "effects" ? (
          combatant.conditions.length > 0 ? (
            <Stack spacing={1.25}>
              {combatant.conditions.map((condition) => (
                <Box
                  key={condition.id}
                  sx={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 2.5,
                    px: 1.4,
                    py: 1.2,
                  }}
                >
                  <Stack
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.2}
                    sx={{ justifyContent: "space-between" }}
                  >
                    <Stack spacing={0.45}>
                      <Chip label={condition.name} size="small" sx={getConditionChipSx(condition)} />
                      <Typography color="text.secondary" variant="body2">
                        {condition.details}
                      </Typography>
                    </Stack>
                    <Typography color="text.secondary" variant="body2">
                      {formatDurationLabel(condition.duration, condition.unit)}
                    </Typography>
                  </Stack>
                </Box>
              ))}
            </Stack>
          ) : (
            <EmptyState
              description="This combatant has no active effects right now."
              title="No active effects"
            />
          )
        ) : null}

        {activeTab === "details" ? (
          <Stack spacing={1}>
            {derivedDetailRows.map((row, index) => (
              <Box key={row.label}>
                {index > 0 ? <Divider sx={{ mb: 1 }} /> : null}
                <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                  <Typography color="text.secondary" variant="body2">
                    {row.label}
                  </Typography>
                  <Typography variant="body2">{row.value}</Typography>
                </Stack>
              </Box>
            ))}
          </Stack>
        ) : null}

        {activeTab === "notes" ? (
          <Typography color="text.secondary" variant="body2">
            {combatant.notes || "No narrative or DM notes for this combatant yet."}
          </Typography>
        ) : null}
      </Stack>
    </SectionCard>
  );
}

function StatPill({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
      <Box
        sx={{
          alignItems: "center",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "999px",
          color: "#d2d8df",
          display: "inline-flex",
          justifyContent: "center",
          height: 38,
          width: 38,
        }}
      >
        <Icon icon={icon} style={{ fontSize: 18 }} />
      </Box>
      <Stack spacing={0}>
        <Typography color="text.secondary" variant="caption">
          {label}
        </Typography>
        <Typography variant="body1">{value}</Typography>
      </Stack>
    </Stack>
  );
}
