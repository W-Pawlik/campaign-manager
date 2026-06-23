import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignCharacterListItem } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignCharactersListProps = {
  canManageAllCharacters: boolean;
  currentUserId: string | null;
  isSubmitting: boolean;
  onArchiveCharacter: (characterId: string) => void;
  onDeleteCharacter: (characterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onOpenDetails: (characterId: string) => void;
  characters: CampaignCharacterListItem[];
};

export function CampaignCharactersList({
  canManageAllCharacters,
  currentUserId,
  isSubmitting,
  onArchiveCharacter,
  onDeleteCharacter,
  onEditCharacter,
  onOpenDetails,
  characters,
}: CampaignCharactersListProps) {
  if (characters.length === 0) {
    return (
      <EmptyState
        description="Add the first player character, companion, or temporary hero to start building your party."
        title="No characters yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {characters.map((character) => {
        const canEdit = canManageAllCharacters || character.ownerUserId === currentUserId;

        return (
          <Paper key={character.id} sx={{ p: 2.25 }} variant="outlined">
            <Stack spacing={1.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                spacing={1.5}
                sx={{ justifyContent: "space-between" }}
              >
                <Stack spacing={0.5}>
                  <Typography variant="h6">{character.name}</Typography>
                  <Typography color="text.secondary">
                    {character.race ?? "Unknown race"} · {character.characterClass ?? "No class"}
                    {character.level ? ` · Level ${character.level}` : ""}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                  <Chip label={character.type.replace("_", " ")} size="small" variant="outlined" />
                  <Chip label={character.status.replace("_", " ")} size="small" />
                </Stack>
              </Stack>

              <Typography color="text.secondary" variant="body2">
                Owner: {character.ownerUserId ?? "Unassigned"}
              </Typography>

              <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
                <Button onClick={() => onOpenDetails(character.id)} variant="outlined">
                  View details
                </Button>
                {canEdit ? (
                  <>
                    <Button onClick={() => onEditCharacter(character.id)} variant="text">
                      Edit
                    </Button>
                    <Button
                      color="inherit"
                      disabled={isSubmitting}
                      onClick={() => onArchiveCharacter(character.id)}
                      variant="outlined"
                    >
                      Archive
                    </Button>
                    <Button
                      color="error"
                      disabled={isSubmitting}
                      onClick={() => onDeleteCharacter(character.id)}
                      variant="outlined"
                    >
                      Delete
                    </Button>
                  </>
                ) : null}
              </Stack>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}
