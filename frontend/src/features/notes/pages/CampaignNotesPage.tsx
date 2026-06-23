import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery, useCampaignReferenceIndex } from "@/features/campaigns";
import {
  useCampaignNotesQuery,
  useCreateNoteMutation,
  useDeleteNoteMutation,
  useNoteDetailsQuery,
  useUpdateNoteMutation,
} from "@/features/notes/api/notesQueries";
import { NoteFormDialog } from "@/features/notes/ui/NoteFormDialog";
import { CampaignNotesList } from "@/features/notes/ui/CampaignNotesList";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function CampaignNotesPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const notesQuery = useCampaignNotesQuery(campaignId);
  const createNoteMutation = useCreateNoteMutation(campaignId);
  const updateNoteMutation = useUpdateNoteMutation(campaignId);
  const deleteNoteMutation = useDeleteNoteMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const noteDetailsQuery = useNoteDetailsQuery(campaignId, selectedNoteId ?? editingNoteId);
  const references = useCampaignReferenceIndex(
    campaignId,
    ["CAMPAIGN", "SESSION", "CHARACTER", "NPC", "QUEST", "LOCATION", "CHRONICLE_ENTRY"],
    campaignDetailsQuery.data?.name,
  );

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (notesQuery.isError) {
      return notesQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, notesQuery.error, notesQuery.isError]);

  if (campaignDetailsQuery.isLoading || notesQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Notes could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void notesQuery.refetch();
        }}
        title="Unable to load notes"
      />
    );
  }

  const isMutating =
    createNoteMutation.isPending || updateNoteMutation.isPending || deleteNoteMutation.isPending;
  const mutationError =
    createNoteMutation.error?.message ??
    updateNoteMutation.error?.message ??
    deleteNoteMutation.error?.message ??
    null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
              Create note
            </Button>
          }
          description="Capture campaign-wide notes and attach them to sessions, characters, quests, NPCs, locations, or chronicle entries."
          title="Notes"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignNotesList
            campaignId={campaignId}
            isSubmitting={isMutating}
            notes={notesQuery.data ?? []}
            onDeleteNote={(noteId) => deleteNoteMutation.mutate(noteId)}
            onEditNote={(noteId) => setEditingNoteId(noteId)}
            onOpenDetails={(noteId) => setSelectedNoteId(noteId)}
          />
        </SectionCard>
      </Stack>

      <NoteFormDialog
        campaignId={campaignId}
        isSubmitting={createNoteMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createNoteMutation.mutateAsync({
            category: values.category,
            content: values.content.trim(),
            relatedEntityId: toNullableString(values.relatedEntityId),
            relatedEntityType: values.relatedEntityType ? values.relatedEntityType : null,
            title: toNullableString(values.title),
            visibility: values.visibility,
          });
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <NoteFormDialog
        campaignId={campaignId}
        initialNote={editingNoteId ? noteDetailsQuery.data ?? null : null}
        isSubmitting={updateNoteMutation.isPending || noteDetailsQuery.isLoading}
        onClose={() => setEditingNoteId(null)}
        onSubmit={async (values) => {
          if (!editingNoteId) {
            return;
          }

          await updateNoteMutation.mutateAsync({
            noteId: editingNoteId,
            payload: {
              category: values.category,
              content: values.content.trim(),
              relatedEntityId: toNullableString(values.relatedEntityId),
              relatedEntityType: values.relatedEntityType ? values.relatedEntityType : null,
              title: toNullableString(values.title),
              visibility: values.visibility,
            },
          });
          setEditingNoteId(null);
        }}
        open={Boolean(editingNoteId)}
      />

      <Dialog fullWidth maxWidth="md" onClose={() => setSelectedNoteId(null)} open={Boolean(selectedNoteId)}>
        <DialogTitle>{noteDetailsQuery.data?.title ?? "Note details"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">{noteDetailsQuery.data?.content}</Typography>
            <Typography variant="body2">Visibility: {noteDetailsQuery.data?.visibility}</Typography>
            <Typography variant="body2">Category: {noteDetailsQuery.data?.category}</Typography>
            {noteDetailsQuery.data?.relatedEntityId ? (
              <Typography variant="body2">
                Related:{" "}
                {references.getReferenceLabel(
                  noteDetailsQuery.data.relatedEntityType as never,
                  noteDetailsQuery.data.relatedEntityId,
                )}
              </Typography>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedNoteId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
