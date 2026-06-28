import { Icon } from "@iconify/react";
import {
  Avatar,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";

import type { FightCombatant } from "@/features/fight-tracker/model/fightTracker.types";
import { formatCombatantKind, getCombatantKindChipSx } from "@/features/fight-tracker/ui/fightTracker.utils";
import { EmptyState } from "@/shared/components";

type Props = {
  candidates: FightCombatant[];
  existingSourceIds: Set<string>;
  onAddCombatant: (combatant: FightCombatant) => void;
  onClose: () => void;
  open: boolean;
};

type ImportTab = "ALL" | "HERO" | "NPC" | "MONSTER";

function AvatarFallback({ kind }: { kind: FightCombatant["kind"] }) {
  const icon =
    kind === "HERO"
      ? "game-icons:crested-helmet"
      : kind === "NPC"
        ? "solar:user-rounded-bold"
        : "game-icons:crossed-slashes";

  return <Icon icon={icon} style={{ fontSize: 20 }} />;
}

export function FightTrackerImportDialog({
  candidates,
  existingSourceIds,
  onAddCombatant,
  onClose,
  open,
}: Props) {
  const [activeTab, setActiveTab] = useState<ImportTab>("ALL");
  const [searchValue, setSearchValue] = useState("");

  const visibleCandidates = useMemo(
    () =>
      candidates.filter((candidate) => {
        const matchesTab = activeTab === "ALL" ? true : candidate.kind === activeTab;
        const normalizedSearch = searchValue.trim().toLowerCase();
        const matchesSearch =
          normalizedSearch.length === 0
            ? true
            : `${candidate.name} ${candidate.subtitle} ${candidate.tags.join(" ")}`
                .toLowerCase()
                .includes(normalizedSearch);

        return matchesTab && matchesSearch;
      }),
    [activeTab, candidates, searchValue],
  );

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>Import from campaign</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1.5}>
          <Typography color="text.secondary" variant="body2">
            Pull existing characters, NPCs, and monsters from the campaign into the active encounter.
          </Typography>

          <Tabs value={activeTab} onChange={(_event, value: ImportTab) => setActiveTab(value)}>
            <Tab label="All" value="ALL" />
            <Tab label="Heroes" value="HERO" />
            <Tab label="NPCs" value="NPC" />
            <Tab label="Monsters" value="MONSTER" />
          </Tabs>

          <TextField
            fullWidth
            placeholder="Search by name, subtitle, or tag"
            size="small"
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />

          {visibleCandidates.length === 0 ? (
            <EmptyState
              description="There are no campaign entities available for this filter yet."
              title="Nothing to import"
            />
          ) : (
            <Stack spacing={1}>
              {visibleCandidates.map((candidate) => {
                const alreadyAdded =
                  candidate.sourceId !== null && existingSourceIds.has(candidate.sourceId);

                return (
                  <Stack
                    key={`${candidate.kind}-${candidate.sourceId ?? candidate.id}`}
                    direction={{ xs: "column", md: "row" }}
                    spacing={1.5}
                    sx={{
                      alignItems: { md: "center" },
                      border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 2.25,
                      px: 1.4,
                      py: 1.1,
                    }}
                  >
                    <Stack direction="row" spacing={1.25} sx={{ alignItems: "center", flexGrow: 1, minWidth: 0 }}>
                      <Avatar
                        src={candidate.avatarUrl ?? undefined}
                        sx={{
                          bgcolor: "rgba(255,255,255,0.05)",
                          color: "#d2d8df",
                        }}
                      >
                        <AvatarFallback kind={candidate.kind} />
                      </Avatar>
                      <Stack spacing={0.3} sx={{ minWidth: 0 }}>
                        <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                          <Typography variant="body1">{candidate.name}</Typography>
                          <Chip
                            label={formatCombatantKind(candidate.kind)}
                            size="small"
                            sx={getCombatantKindChipSx(candidate.kind)}
                          />
                        </Stack>
                        <Typography color="text.secondary" noWrap variant="body2">
                          {candidate.subtitle}
                        </Typography>
                      </Stack>
                    </Stack>

                    <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                      <Typography color="text.secondary" variant="caption">
                        Init {candidate.initiative} - AC {candidate.armorClass} - HP {candidate.maxHitPoints}
                      </Typography>
                      <Button
                        disabled={alreadyAdded}
                        onClick={() => onAddCombatant(candidate)}
                        variant={alreadyAdded ? "outlined" : "contained"}
                      >
                        {alreadyAdded ? "Already added" : "Import"}
                      </Button>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>
          )}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
