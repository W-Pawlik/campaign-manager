import { Icon } from "@iconify/react";
import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignCharacterListItem } from "@/features/campaigns";
import {
  formatCharacterStatusLabel,
  formatCharacterTypeLabel,
  getCharacterOwnerLabel,
  getCharacterSubtitle,
  type CharacterViewMode,
} from "@/features/characters/ui/characterUi.utils";
import { EmptyState } from "@/shared/components";

type CampaignCharactersListProps = {
  canManageAllCharacters: boolean;
  currentUserId: string | null;
  isSubmitting: boolean;
  onArchiveCharacter: (characterId: string) => void;
  onDeleteCharacter: (characterId: string) => void;
  onEditCharacter: (characterId: string) => void;
  onOpenDetails: (characterId: string) => void;
  selectedCharacterId: string | null;
  viewMode: CharacterViewMode;
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
  selectedCharacterId,
  viewMode,
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
    <Box
      sx={{
        display: "grid",
        gap: 1.75,
        gridTemplateColumns:
          viewMode === "cards" ? { xs: "1fr", xl: "repeat(2, minmax(0, 1fr))" } : "1fr",
      }}
    >
      {characters.map((character) => {
        const selected = selectedCharacterId === character.id;
        const canEdit = canManageAllCharacters || character.ownerUserId === currentUserId;

        return (
          <Paper
            key={character.id}
            sx={{
              backgroundColor: "background.paper",
              borderColor: selected ? "rgba(184, 55, 42, 0.52)" : "divider",
              borderRadius: 2.5,
              minHeight: viewMode === "cards" ? 286 : undefined,
              p: viewMode === "cards" ? 2.1 : 1.5,
            }}
            variant="outlined"
          >
            <Stack
              direction={viewMode === "cards" ? "column" : { xs: "column", sm: "row" }}
              spacing={1.5}
              sx={{ alignItems: viewMode === "cards" ? "stretch" : { sm: "center" } }}
            >
              <Stack direction="row" spacing={1.25} sx={{ minWidth: 0 }}>
                <AvatarPlate avatarUrl={character.avatarUrl} name={character.name} />
                <Stack spacing={0.7} sx={{ minWidth: 0 }}>
                  <Stack
                    direction="row"
                    spacing={1}
                    sx={{ alignItems: "flex-start", justifyContent: "space-between" }}
                  >
                    <Stack spacing={0.35} sx={{ minWidth: 0 }}>
                      <Typography
                        sx={{
                          color: "#f4e1be",
                          fontFamily: '"Georgia", "Times New Roman", serif',
                          fontSize: viewMode === "cards" ? "2rem" : "1.45rem",
                          lineHeight: 1,
                        }}
                      >
                        {character.name}
                      </Typography>
                      <Typography color="text.secondary" variant="body2">
                        {getCharacterSubtitle(character)}
                      </Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" spacing={0.75} sx={{ flexWrap: "wrap", rowGap: 0.75 }}>
                    <Chip
                      label={formatCharacterTypeLabel(character.type)}
                      size="small"
                      sx={{ bgcolor: "rgba(137, 45, 38, 0.14)", color: "#cb6e62", fontWeight: 700 }}
                    />
                    <Chip
                      label={formatCharacterStatusLabel(character.status)}
                      size="small"
                      sx={{ bgcolor: "rgba(56, 106, 59, 0.14)", color: "#88b870", fontWeight: 700 }}
                    />
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={0.75}
                    sx={{ alignItems: "center", color: "#b59a6f" }}
                  >
                    <Icon icon="tdesign:member-filled" style={{ fontSize: 15 }} />
                    <Typography color="inherit" variant="body2">
                      {getCharacterOwnerLabel(
                        character.ownerUsername,
                        character.ownerUserId,
                      )}
                    </Typography>
                  </Stack>

                  <Stack
                    direction="row"
                    spacing={1.2}
                    sx={{ color: "#c9ab77", flexWrap: "wrap", rowGap: 0.75 }}
                  >
                    <Stack direction="row" spacing={0.55} sx={{ alignItems: "center" }}>
                      <Icon icon="game-icons:crested-helmet" style={{ fontSize: 15 }} />
                      <Typography color="inherit" variant="body2">
                        {character.characterClass ?? "No class"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.55} sx={{ alignItems: "center" }}>
                      <Icon icon="mdi:sword-cross" style={{ fontSize: 15 }} />
                      <Typography color="inherit" variant="body2">
                        {character.level ? `Level ${character.level}` : "No level"}
                      </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.55} sx={{ alignItems: "center" }}>
                      <Icon icon="mdi:feather" style={{ fontSize: 15 }} />
                      <Typography color="inherit" variant="body2">
                        {character.race ?? "Unknown race"}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                sx={{
                  alignItems: { sm: "center" },
                  flexWrap: "wrap",
                  justifyContent: viewMode === "cards" ? "flex-start" : "flex-end",
                  marginLeft: viewMode === "cards" ? undefined : "auto",
                  rowGap: 1,
                }}
              >
                <Button
                  color="inherit"
                  onClick={() => onOpenDetails(character.id)}
                  startIcon={<Icon icon="solar:eye-linear" />}
                  variant={selected ? "contained" : "outlined"}
                >
                  Details
                </Button>
                {canEdit ? (
                  <>
                    <Button
                      color="inherit"
                      onClick={() => onEditCharacter(character.id)}
                      startIcon={<Icon icon="solar:pen-2-linear" />}
                      variant="outlined"
                    >
                      Edit
                    </Button>
                    <Button
                      color="inherit"
                      disabled={isSubmitting}
                      onClick={() => onArchiveCharacter(character.id)}
                      startIcon={<Icon icon="solar:archive-minimalistic-linear" />}
                      variant="outlined"
                    >
                      Archive
                    </Button>
                    <Button
                      color="inherit"
                      disabled={isSubmitting}
                      onClick={() => onDeleteCharacter(character.id)}
                      startIcon={<Icon icon="solar:trash-bin-minimalistic-linear" />}
                      sx={{ borderColor: "rgba(212, 91, 73, 0.34)", color: "#d77d6c" }}
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
    </Box>
  );
}

function AvatarPlate({ avatarUrl, name }: { avatarUrl: string | null; name: string }) {
  return (
    <Box
      sx={{
        bgcolor: "rgba(216, 176, 112, 0.08)",
        border: "1px solid rgba(216, 176, 112, 0.16)",
        borderRadius: "50%",
        flexShrink: 0,
        height: 78,
        overflow: "hidden",
        width: 78,
      }}
    >
      {avatarUrl ? (
        <Box
          alt={name}
          component="img"
          src={avatarUrl}
          sx={{ display: "block", height: "100%", objectFit: "cover", width: "100%" }}
        />
      ) : (
        <Box
          sx={{ alignItems: "center", display: "flex", height: "100%", justifyContent: "center" }}
        >
          <Icon icon="game-icons:crested-helmet" style={{ color: "#d8b070", fontSize: 32 }} />
        </Box>
      )}
    </Box>
  );
}
