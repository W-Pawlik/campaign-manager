import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery, useCampaignReferenceIndex } from "@/features/campaigns";
import { useCampaignNpcsQuery, useCreateNpcMutation, useDeleteNpcMutation, useNpcDetailsQuery, useUpdateNpcMutation } from "@/features/npcs/api/npcsQueries";
import { CampaignNpcsList } from "@/features/npcs/ui/CampaignNpcsList";
import { NpcFormDialog } from "@/features/npcs/ui/NpcFormDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageNpcs(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function CampaignNpcsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const npcsQuery = useCampaignNpcsQuery(campaignId);
  const createNpcMutation = useCreateNpcMutation(campaignId);
  const updateNpcMutation = useUpdateNpcMutation(campaignId);
  const deleteNpcMutation = useDeleteNpcMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNpcId, setEditingNpcId] = useState<string | null>(null);
  const [selectedNpcId, setSelectedNpcId] = useState<string | null>(null);
  const npcDetailsQuery = useNpcDetailsQuery(campaignId, selectedNpcId ?? editingNpcId);
  const references = useCampaignReferenceIndex(campaignId, ["LOCATION"]);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (npcsQuery.isError) {
      return npcsQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, npcsQuery.error, npcsQuery.isError]);

  if (campaignDetailsQuery.isLoading || npcsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "NPCs could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void npcsQuery.refetch();
        }}
        title="Unable to load NPCs"
      />
    );
  }

  const canManage = canManageNpcs(campaignDetailsQuery.data.role);
  const isMutating = createNpcMutation.isPending || updateNpcMutation.isPending || deleteNpcMutation.isPending;
  const mutationError =
    createNpcMutation.error?.message ??
    updateNpcMutation.error?.message ??
    deleteNpcMutation.error?.message ??
    null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManage ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Create NPC
              </Button>
            ) : undefined
          }
          description="Keep world actors, factions, motivations, and public versus private NPC information organized."
          title="NPCs"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignNpcsList
            campaignId={campaignId}
            canManageNpcs={canManage}
            isSubmitting={isMutating}
            npcs={npcsQuery.data ?? []}
            onDeleteNpc={(npcId) => deleteNpcMutation.mutate(npcId)}
            onEditNpc={(npcId) => setEditingNpcId(npcId)}
            onOpenDetails={(npcId) => setSelectedNpcId(npcId)}
          />
        </SectionCard>
      </Stack>

      <NpcFormDialog
        campaignId={campaignId}
        isSubmitting={createNpcMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createNpcMutation.mutateAsync({
            appearance: toNullableString(values.appearance),
            attitude: values.attitude,
            faction: toNullableString(values.faction),
            gmNotes: toNullableString(values.gmNotes),
            importance: values.importance,
            locationId: toNullableString(values.locationId),
            motivations: toNullableString(values.motivations),
            name: values.name.trim(),
            occupation: toNullableString(values.occupation),
            personality: toNullableString(values.personality),
            publicDescription: toNullableString(values.publicDescription),
            race: toNullableString(values.race),
            secrets: toNullableString(values.secrets),
            status: values.status,
            title: toNullableString(values.title),
          });
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <NpcFormDialog
        campaignId={campaignId}
        initialNpc={editingNpcId ? npcDetailsQuery.data ?? null : null}
        isSubmitting={updateNpcMutation.isPending || npcDetailsQuery.isLoading}
        onClose={() => setEditingNpcId(null)}
        onSubmit={async (values) => {
          if (!editingNpcId) {
            return;
          }

          await updateNpcMutation.mutateAsync({
            npcId: editingNpcId,
            payload: {
              appearance: toNullableString(values.appearance),
              attitude: values.attitude,
              faction: toNullableString(values.faction),
              gmNotes: toNullableString(values.gmNotes),
              importance: values.importance,
              locationId: toNullableString(values.locationId),
              motivations: toNullableString(values.motivations),
              name: values.name.trim(),
              occupation: toNullableString(values.occupation),
              personality: toNullableString(values.personality),
              publicDescription: toNullableString(values.publicDescription),
              race: toNullableString(values.race),
              secrets: toNullableString(values.secrets),
              status: values.status,
              title: toNullableString(values.title),
            },
          });
          setEditingNpcId(null);
        }}
        open={Boolean(editingNpcId)}
      />

      <Dialog fullWidth maxWidth="md" onClose={() => setSelectedNpcId(null)} open={Boolean(selectedNpcId)}>
        <DialogTitle>{npcDetailsQuery.data?.name ?? "NPC details"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">{npcDetailsQuery.data?.publicDescription}</Typography>
            {npcDetailsQuery.data?.locationId ? (
              <Typography variant="body2">
                Location: {references.getReferenceLabel("LOCATION", npcDetailsQuery.data.locationId)}
              </Typography>
            ) : null}
            {"gmNotes" in (npcDetailsQuery.data ?? {}) && npcDetailsQuery.data?.gmNotes ? (
              <Typography variant="body2">GM notes: {npcDetailsQuery.data.gmNotes}</Typography>
            ) : null}
            {"motivations" in (npcDetailsQuery.data ?? {}) && npcDetailsQuery.data?.motivations ? (
              <Typography variant="body2">Motivations: {npcDetailsQuery.data.motivations}</Typography>
            ) : null}
            {"secrets" in (npcDetailsQuery.data ?? {}) && npcDetailsQuery.data?.secrets ? (
              <Typography variant="body2">Secrets: {npcDetailsQuery.data.secrets}</Typography>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedNpcId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
