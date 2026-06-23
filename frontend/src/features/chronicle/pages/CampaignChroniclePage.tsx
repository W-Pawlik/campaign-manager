import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery } from "@/features/campaigns";
import {
  useCampaignChronicleQuery,
  useChronicleEntryDetailsQuery,
  useCreateChronicleEntryMutation,
  useDeleteChronicleEntryMutation,
  useUpdateChronicleEntryMutation,
} from "@/features/chronicle/api/chronicleQueries";
import { CampaignChronicleList } from "@/features/chronicle/ui/CampaignChronicleList";
import { ChronicleEntryFormDialog } from "@/features/chronicle/ui/ChronicleEntryFormDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function toNullableIsoDateTime(value?: string): string | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return new Date(value).toISOString();
}

export function CampaignChroniclePage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const chronicleQuery = useCampaignChronicleQuery(campaignId);
  const createEntryMutation = useCreateChronicleEntryMutation(campaignId);
  const updateEntryMutation = useUpdateChronicleEntryMutation(campaignId);
  const deleteEntryMutation = useDeleteChronicleEntryMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);
  const entryDetailsQuery = useChronicleEntryDetailsQuery(campaignId, selectedEntryId ?? editingEntryId);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (chronicleQuery.isError) {
      return chronicleQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, chronicleQuery.error, chronicleQuery.isError]);

  if (campaignDetailsQuery.isLoading || chronicleQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Chronicle could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void chronicleQuery.refetch();
        }}
        title="Unable to load chronicle"
      />
    );
  }

  const canManageEntries =
    campaignDetailsQuery.data.role === "OWNER" ||
    campaignDetailsQuery.data.role === "GM" ||
    campaignDetailsQuery.data.role === "CO_GM";
  const isMutating =
    createEntryMutation.isPending || updateEntryMutation.isPending || deleteEntryMutation.isPending;
  const mutationError =
    createEntryMutation.error?.message ??
    updateEntryMutation.error?.message ??
    deleteEntryMutation.error?.message ??
    null;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManageEntries ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Create entry
              </Button>
            ) : undefined
          }
          description="Capture campaign history, recaps, and major world events for the whole table."
          title="Chronicle"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignChronicleList
            campaignId={campaignId}
            canManageEntries={canManageEntries}
            entries={chronicleQuery.data ?? []}
            isSubmitting={isMutating}
            onDeleteEntry={(entryId) => deleteEntryMutation.mutate(entryId)}
            onEditEntry={(entryId) => setEditingEntryId(entryId)}
            onOpenDetails={(entryId) => setSelectedEntryId(entryId)}
          />
        </SectionCard>
      </Stack>

      <ChronicleEntryFormDialog
        campaignId={campaignId}
        isSubmitting={createEntryMutation.isPending}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createEntryMutation.mutateAsync({
            content: values.content.trim(),
            inWorldDate: toNullableString(values.inWorldDate),
            occurredAt: toNullableIsoDateTime(values.occurredAt),
            sessionId: toNullableString(values.sessionId),
            title: values.title.trim(),
            visibility: values.visibility,
          });
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <ChronicleEntryFormDialog
        campaignId={campaignId}
        initialEntry={editingEntryId ? entryDetailsQuery.data ?? null : null}
        isSubmitting={updateEntryMutation.isPending || entryDetailsQuery.isLoading}
        onClose={() => setEditingEntryId(null)}
        onSubmit={async (values) => {
          if (!editingEntryId) {
            return;
          }

          await updateEntryMutation.mutateAsync({
            entryId: editingEntryId,
            payload: {
              content: values.content.trim(),
              inWorldDate: toNullableString(values.inWorldDate),
              occurredAt: toNullableIsoDateTime(values.occurredAt),
              sessionId: toNullableString(values.sessionId),
              title: values.title.trim(),
              visibility: values.visibility,
            },
          });
          setEditingEntryId(null);
        }}
        open={Boolean(editingEntryId)}
      />

      <Dialog fullWidth maxWidth="md" onClose={() => setSelectedEntryId(null)} open={Boolean(selectedEntryId)}>
        <DialogTitle>{entryDetailsQuery.data?.title ?? "Chronicle entry"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">{entryDetailsQuery.data?.content}</Typography>
            <Typography variant="body2">Visibility: {entryDetailsQuery.data?.visibility}</Typography>
            <Typography variant="body2">
              In-world date: {entryDetailsQuery.data?.inWorldDate ?? "Not set"}
            </Typography>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedEntryId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
