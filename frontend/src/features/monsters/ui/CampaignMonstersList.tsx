import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignMonsterListItem } from "@/features/monsters/model/monster.types";
import { EmptyState } from "@/shared/components";

type CampaignMonstersListProps = {
  canManageMonsters: boolean;
  isSubmitting: boolean;
  monsters: CampaignMonsterListItem[];
  onArchiveMonster: (monsterId: string) => void;
  onEditMonster: (monsterId: string) => void;
  onOpenDetails: (monsterId: string) => void;
};

export function CampaignMonstersList({
  canManageMonsters,
  isSubmitting,
  monsters,
  onArchiveMonster,
  onEditMonster,
  onOpenDetails,
}: CampaignMonstersListProps) {
  if (monsters.length === 0) {
    return (
      <EmptyState
        description="Build a campaign bestiary, keep custom statblocks close to the table, and import creatures from Open5e when needed."
        title="No monsters yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {monsters.map((monster) => (
        <Paper key={monster.id} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{monster.name}</Typography>
                <Typography color="text.secondary">
                  {monster.type ?? "Unknown type"} · {monster.size ?? "Unknown size"} · CR {monster.challengeRating ?? "?"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={monster.source} size="small" variant="outlined" />
                <Chip label={monster.visibility.replace("_", " ")} size="small" />
              </Stack>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(monster.id)} variant="outlined">
                View details
              </Button>
              {canManageMonsters ? (
                <>
                  <Button onClick={() => onEditMonster(monster.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onArchiveMonster(monster.id)}
                    variant="outlined"
                  >
                    Archive
                  </Button>
                </>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
