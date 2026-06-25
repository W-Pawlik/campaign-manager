import { Icon } from "@iconify/react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  MenuItem,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useAppSelector } from "@/app/store/hooks";
import { useCampaignDetailsQuery } from "@/features/campaigns";
import {
  useArchiveCharacterMutation,
  useCampaignCharactersQuery,
  useCharacterDetailsQuery,
  useCreateCharacterMutation,
  useDeleteCharacterMutation,
  useUpdateCharacterMutation,
} from "@/features/characters/api/charactersQueries";
import { CharacterDetailsDialog } from "@/features/characters/ui/CharacterDetailsDialog";
import { CharacterFormDialog } from "@/features/characters/ui/CharacterFormDialog";
import { CampaignCharactersList } from "@/features/characters/ui/CampaignCharactersList";
import {
  characterTypeFilterOptions,
  formatCharacterSortLabel,
  formatCharacterTypeLabel,
  getCharacterSearchText,
  isCharacterTypeFilterMatch,
  sortCharacters,
  type CharacterSortValue,
  type CharacterTypeFilterValue,
  type CharacterViewMode,
} from "@/features/characters/ui/characterUi.utils";
import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";
import { ErrorState, LoadingScreen } from "@/shared/components";

function canManageAllCharacters(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (value === undefined) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function buildCreateCharacterPayload(values: CharacterFormValues, canManageAll: boolean) {
  return {
    alignment: toNullableString(values.alignment),
    appearance: toNullableString(values.appearance),
    armorClass: values.armorClass ?? null,
    avatarUrl: toNullableString(values.avatarUrl),
    background: toNullableString(values.background),
    backstory: toNullableString(values.backstory),
    bonds: toNullableString(values.bonds),
    characterClass: toNullableString(values.characterClass),
    charisma: values.charisma ?? null,
    constitution: values.constitution ?? null,
    currentHitPoints: values.currentHitPoints ?? null,
    dexterity: values.dexterity ?? null,
    flaws: toNullableString(values.flaws),
    ideals: toNullableString(values.ideals),
    intelligence: values.intelligence ?? null,
    level: values.level ?? null,
    maxHitPoints: values.maxHitPoints ?? null,
    name: values.name.trim(),
    ...(canManageAll ? { ownerUserId: toNullableString(values.ownerUserId) } : {}),
    personalityTraits: toNullableString(values.personalityTraits),
    race: toNullableString(values.race),
    status: values.status,
    strength: values.strength ?? null,
    subclass: toNullableString(values.subclass),
    type: values.type,
    wisdom: values.wisdom ?? null,
  };
}

function buildUpdateCharacterPayload(values: CharacterFormValues, canManageAll: boolean) {
  return {
    alignment: toNullableString(values.alignment),
    appearance: toNullableString(values.appearance),
    armorClass: values.armorClass ?? null,
    avatarUrl: toNullableString(values.avatarUrl),
    background: toNullableString(values.background),
    backstory: toNullableString(values.backstory),
    bonds: toNullableString(values.bonds),
    characterClass: toNullableString(values.characterClass),
    charisma: values.charisma ?? null,
    constitution: values.constitution ?? null,
    currentHitPoints: values.currentHitPoints ?? null,
    dexterity: values.dexterity ?? null,
    flaws: toNullableString(values.flaws),
    ideals: toNullableString(values.ideals),
    intelligence: values.intelligence ?? null,
    level: values.level ?? null,
    maxHitPoints: values.maxHitPoints ?? null,
    name: values.name.trim(),
    ...(canManageAll ? { ownerUserId: toNullableString(values.ownerUserId) } : {}),
    personalityTraits: toNullableString(values.personalityTraits),
    race: toNullableString(values.race),
    status: values.status,
    strength: values.strength ?? null,
    subclass: toNullableString(values.subclass),
    type: values.type,
    wisdom: values.wisdom ?? null,
  };
}

export function CampaignCharactersPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const currentUserId = useAppSelector((state) => state.auth.currentUser?.id ?? null);
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const charactersQuery = useCampaignCharactersQuery(campaignId);
  const createCharacterMutation = useCreateCharacterMutation(campaignId);
  const updateCharacterMutation = useUpdateCharacterMutation(campaignId);
  const archiveCharacterMutation = useArchiveCharacterMutation(campaignId);
  const deleteCharacterMutation = useDeleteCharacterMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCharacterId, setEditingCharacterId] = useState<string | null>(null);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string | null>(null);
  const [detailsDialogCharacterId, setDetailsDialogCharacterId] = useState<string | null>(null);
  const [characterPendingDelete, setCharacterPendingDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [typeFilter, setTypeFilter] = useState<CharacterTypeFilterValue>("ALL");
  const [sortValue, setSortValue] = useState<CharacterSortValue>("UPDATED");
  const [viewMode, setViewMode] = useState<CharacterViewMode>("cards");

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (charactersQuery.isError) {
      return charactersQuery.error.message;
    }

    return null;
  }, [
    campaignDetailsQuery.error,
    campaignDetailsQuery.isError,
    charactersQuery.error,
    charactersQuery.isError,
  ]);

  const allCharacters = useMemo(() => charactersQuery.data ?? [], [charactersQuery.data]);
  const filteredCharacters = useMemo(() => {
    const search = searchValue.trim().toLowerCase();

    return allCharacters.filter((character) => {
      const matchesType = isCharacterTypeFilterMatch(character, typeFilter);
      const matchesSearch =
        search.length === 0 ? true : getCharacterSearchText(character).includes(search);

      return matchesType && matchesSearch;
    });
  }, [allCharacters, searchValue, typeFilter]);
  const sortedCharacters = useMemo(
    () => sortCharacters(filteredCharacters, sortValue),
    [filteredCharacters, sortValue],
  );
  const effectiveSelectedCharacterId = useMemo(() => {
    if (sortedCharacters.length === 0) {
      return null;
    }

    const selectedStillVisible = sortedCharacters.some(
      (character) => character.id === selectedCharacterId,
    );

    return selectedStillVisible ? selectedCharacterId : sortedCharacters[0].id;
  }, [selectedCharacterId, sortedCharacters]);
  const characterDetailsQuery = useCharacterDetailsQuery(
    campaignId,
    editingCharacterId ?? detailsDialogCharacterId ?? effectiveSelectedCharacterId,
  );

  if (campaignDetailsQuery.isLoading || charactersQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Characters could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void charactersQuery.refetch();
        }}
        title="Unable to load characters"
      />
    );
  }

  const canManageAll = canManageAllCharacters(campaignDetailsQuery.data.role);
  const isMutating =
    createCharacterMutation.isPending ||
    updateCharacterMutation.isPending ||
    archiveCharacterMutation.isPending ||
    deleteCharacterMutation.isPending;
  const mutationError =
    createCharacterMutation.error?.message ??
    updateCharacterMutation.error?.message ??
    archiveCharacterMutation.error?.message ??
    deleteCharacterMutation.error?.message ??
    null;
  return (
    <>
      <Stack spacing={3}>
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2.5}
          sx={{
            alignItems: { xl: "flex-start" },
            justifyContent: "space-between",
          }}
        >
          <Stack spacing={1}>
            <Typography
              sx={{
                color: "#f3e5cc",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: { xs: "2.45rem", md: "3.4rem" },
                lineHeight: 0.98,
              }}
            >
              Campaign characters
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 760 }} variant="body1">
              Manage player heroes, companions, and temporary allies from one shared roster.
            </Typography>
          </Stack>

          <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
            Create character
          </Button>
        </Stack>

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2}
          sx={{ alignItems: { xl: "center" }, justifyContent: "space-between" }}
        >
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
            {characterTypeFilterOptions.map((option) => {
              const selected = option === typeFilter;

              return (
                <Chip
                  clickable
                  icon={
                    <Icon
                      icon={
                        option === "ALL"
                          ? "solar:tuning-2-bold"
                          : option === "PLAYER_CHARACTER"
                            ? "game-icons:crested-helmet"
                            : option === "COMPANION"
                              ? "tdesign:member-filled"
                              : "mdi:incognito"
                      }
                      style={{ fontSize: 16 }}
                    />
                  }
                  key={option}
                  label={option === "ALL" ? "All characters" : formatCharacterTypeLabel(option)}
                  onClick={() => setTypeFilter(option)}
                  sx={{
                    bgcolor: selected ? "rgba(216, 176, 112, 0.12)" : "rgba(8, 10, 16, 0.36)",
                    borderColor: selected
                      ? "rgba(216, 176, 112, 0.44)"
                      : "divider",
                    color: selected ? "#e3bd7b" : "#d5cab4",
                    fontWeight: selected ? 700 : 500,
                    minHeight: 42,
                    ".MuiChip-icon": { color: "inherit" },
                  }}
                  variant="outlined"
                />
              );
            })}
          </Stack>

          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}
          >
            <ToggleButtonGroup
              exclusive
              size="small"
              value={viewMode}
              onChange={(_event, value: CharacterViewMode | null) => {
                if (value) {
                  setViewMode(value);
                }
              }}
            >
              <ToggleButton value="cards">Cards</ToggleButton>
              <ToggleButton value="list">List</ToggleButton>
            </ToggleButtonGroup>

            <TextField
              select
              size="small"
              sx={{ minWidth: 180 }}
              value={sortValue}
              onChange={(event) => setSortValue(event.target.value as CharacterSortValue)}
            >
              <MenuItem value="UPDATED">{formatCharacterSortLabel("UPDATED")}</MenuItem>
              <MenuItem value="NAME">{formatCharacterSortLabel("NAME")}</MenuItem>
              <MenuItem value="LEVEL">{formatCharacterSortLabel("LEVEL")}</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        <Box
          sx={{
            display: "grid",
            gap: 2,
            gridTemplateColumns: "1fr",
          }}
        >
          <Stack spacing={1.5}>
            <Box
              sx={{
                backgroundColor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2.5,
                p: 2,
              }}
            >
              <Stack spacing={1.5}>
                <TextField
                  fullWidth
                  placeholder="Search characters..."
                  size="small"
                  value={searchValue}
                  onChange={(event) => setSearchValue(event.target.value)}
                />
                <Typography color="text.secondary" variant="body2">
                  {sortedCharacters.length} character{sortedCharacters.length === 1 ? "" : "s"}
                </Typography>
              </Stack>
            </Box>

            <CampaignCharactersList
              canManageAllCharacters={canManageAll}
              characters={sortedCharacters}
              currentUserId={currentUserId}
              isSubmitting={isMutating}
              onArchiveCharacter={(characterId) => archiveCharacterMutation.mutate(characterId)}
              onDeleteCharacter={(characterId) => {
                const target = allCharacters.find((character) => character.id === characterId);
                setCharacterPendingDelete(target ? { id: target.id, name: target.name } : null);
              }}
              onEditCharacter={(characterId) => setEditingCharacterId(characterId)}
              onOpenDetails={(characterId) => {
                setSelectedCharacterId(characterId);
                setDetailsDialogCharacterId(characterId);
              }}
              selectedCharacterId={effectiveSelectedCharacterId}
              viewMode={viewMode}
            />
          </Stack>
        </Box>
      </Stack>

      <CharacterFormDialog
        canAssignOwner={canManageAll}
        isSubmitting={createCharacterMutation.isPending}
        onClose={() => {
          createCharacterMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (values) => {
          await createCharacterMutation.mutateAsync(
            buildCreateCharacterPayload(values, canManageAll),
          );
          createCharacterMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitError={createCharacterMutation.error?.message ?? null}
      />

      <CharacterFormDialog
        canAssignOwner={canManageAll}
        initialCharacter={editingCharacterId ? (characterDetailsQuery.data ?? null) : null}
        isSubmitting={updateCharacterMutation.isPending || characterDetailsQuery.isLoading}
        onClose={() => {
          updateCharacterMutation.reset();
          setEditingCharacterId(null);
        }}
        onSubmit={async (values) => {
          if (!editingCharacterId) {
            return;
          }

          await updateCharacterMutation.mutateAsync({
            characterId: editingCharacterId,
            payload: buildUpdateCharacterPayload(values, canManageAll),
          });
          updateCharacterMutation.reset();
          setEditingCharacterId(null);
        }}
        open={Boolean(editingCharacterId)}
        submitError={updateCharacterMutation.error?.message ?? null}
      />

      <CharacterDetailsDialog
        character={detailsDialogCharacterId ? (characterDetailsQuery.data ?? null) : null}
        onClose={() => setDetailsDialogCharacterId(null)}
        onEdit={
          detailsDialogCharacterId
            ? () => {
                setEditingCharacterId(detailsDialogCharacterId);
                setDetailsDialogCharacterId(null);
              }
            : undefined
        }
        open={Boolean(detailsDialogCharacterId)}
      />

      <Dialog
        fullWidth
        maxWidth="sm"
        onClose={() => setCharacterPendingDelete(null)}
        open={Boolean(characterPendingDelete)}
        slotProps={{
          paper: {
            sx: {
              background:
                "linear-gradient(180deg, rgba(18, 21, 29, 0.98) 0%, rgba(12, 15, 20, 1) 100%)",
              border: "1px solid rgba(188, 128, 52, 0.18)",
              borderRadius: 3,
            },
          },
        }}
      >
        <DialogContent sx={{ p: 3 }}>
          <Stack spacing={1.5}>
            <Typography
              sx={{
                color: "#f3e5cc",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: "2rem",
                lineHeight: 1,
              }}
            >
              Delete character?
            </Typography>
            <Typography color="text.secondary" variant="body1">
              {characterPendingDelete
                ? `You are about to permanently delete ${characterPendingDelete.name}.`
                : "You are about to permanently delete this character."}
            </Typography>
            <Typography color="#d77d6c" variant="body2">
              This action cannot be undone or restored later.
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3, pt: 0 }}>
          <Button
            color="inherit"
            onClick={() => setCharacterPendingDelete(null)}
            variant="outlined"
          >
            Cancel
          </Button>
          <Button
            color="error"
            disabled={deleteCharacterMutation.isPending}
            onClick={async () => {
              if (!characterPendingDelete) {
                return;
              }

              await deleteCharacterMutation.mutateAsync(characterPendingDelete.id);
              setCharacterPendingDelete(null);
            }}
            variant="contained"
          >
            Delete forever
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
