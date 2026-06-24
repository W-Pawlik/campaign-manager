import { Alert, Button, Stack } from "@mui/material";
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
import { CampaignCharactersList } from "@/features/characters/ui/CampaignCharactersList";
import { CharacterDetailsDialog } from "@/features/characters/ui/CharacterDetailsDialog";
import { CharacterFormDialog } from "@/features/characters/ui/CharacterFormDialog";
import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

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
  const characterDetailsQuery = useCharacterDetailsQuery(
    campaignId,
    selectedCharacterId ?? editingCharacterId,
  );

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (charactersQuery.isError) {
      return charactersQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, charactersQuery.error, charactersQuery.isError]);

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
      <Stack spacing={3.5}>
        <PageHeader
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
              Create character
            </Button>
          }
          description="Track player characters, companions, and temporary heroes inside the active campaign workspace."
          title="Characters"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignCharactersList
            canManageAllCharacters={canManageAll}
            characters={charactersQuery.data ?? []}
            currentUserId={currentUserId}
            isSubmitting={isMutating}
            onArchiveCharacter={(characterId) => archiveCharacterMutation.mutate(characterId)}
            onDeleteCharacter={(characterId) => deleteCharacterMutation.mutate(characterId)}
            onEditCharacter={(characterId) => setEditingCharacterId(characterId)}
            onOpenDetails={(characterId) => setSelectedCharacterId(characterId)}
          />
        </SectionCard>
      </Stack>

      <CharacterFormDialog
        canAssignOwner={canManageAll}
        isSubmitting={createCharacterMutation.isPending}
        onClose={() => {
          createCharacterMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (values) => {
          await createCharacterMutation.mutateAsync(buildCreateCharacterPayload(values, canManageAll));
          createCharacterMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitError={createCharacterMutation.error?.message ?? null}
      />

      <CharacterFormDialog
        canAssignOwner={canManageAll}
        initialCharacter={editingCharacterId ? characterDetailsQuery.data ?? null : null}
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
        character={selectedCharacterId ? characterDetailsQuery.data ?? null : null}
        onClose={() => setSelectedCharacterId(null)}
        open={Boolean(selectedCharacterId)}
      />
    </>
  );
}
