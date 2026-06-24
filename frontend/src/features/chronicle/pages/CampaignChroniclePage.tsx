import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
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
import { ChronicleListControls } from "@/features/chronicle/ui/ChronicleListControls";
import { ChronicleEntryFormDialog } from "@/features/chronicle/ui/ChronicleEntryFormDialog";
import { ChronicleTimelinePanel } from "@/features/chronicle/ui/ChronicleTimelinePanel";
import {
  buildChronicleTimelineEntries,
  defaultChronicleListFilters,
  matchesChronicleListFilters,
  sortChronicleEntries,
  type ChronicleListFilters,
} from "@/features/chronicle/ui/chronicleListUi.utils";
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
  const [highlightedEntryId, setHighlightedEntryId] = useState<string | null>(null);
  const [listFilters, setListFilters] = useState<ChronicleListFilters>(defaultChronicleListFilters);
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
  const visibleEntries = useMemo(
    () =>
      sortChronicleEntries(
        (chronicleQuery.data ?? []).filter((entry) => matchesChronicleListFilters(entry, listFilters)),
        listFilters.sortField,
        listFilters.sortDirection,
      ),
    [chronicleQuery.data, listFilters],
  );
  const inWorldTimelineEntries = useMemo(
    () => buildChronicleTimelineEntries(visibleEntries, "IN_WORLD_DATE"),
    [visibleEntries],
  );
  const occurredAtTimelineEntries = useMemo(
    () => buildChronicleTimelineEntries(visibleEntries, "OCCURRED_AT"),
    [visibleEntries],
  );

  useEffect(() => {
    if (!highlightedEntryId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedEntryId(null);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedEntryId]);

  const handleTimelineEntrySelect = (entryId: string) => {
    setHighlightedEntryId(entryId);

    window.setTimeout(() => {
      const element = document.getElementById(`chronicle-entry-${entryId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 10);
  };

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
          <Stack spacing={2.5}>
            <ChronicleListControls onChange={setListFilters} value={listFilters} />
            <Stack direction={{ xs: "column", xl: "row" }} spacing={2}>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <ChronicleTimelinePanel
                  campaignId={campaignId}
                  entries={inWorldTimelineEntries}
                  mode="IN_WORLD_DATE"
                  onSelectEntry={handleTimelineEntrySelect}
                />
              </Stack>
              <Stack sx={{ flex: 1, minWidth: 0 }}>
                <ChronicleTimelinePanel
                  campaignId={campaignId}
                  entries={occurredAtTimelineEntries}
                  mode="OCCURRED_AT"
                  onSelectEntry={handleTimelineEntrySelect}
                />
              </Stack>
            </Stack>
            <CampaignChronicleList
              campaignId={campaignId}
              canManageEntries={canManageEntries}
              entries={visibleEntries}
              highlightedEntryId={highlightedEntryId}
              isSubmitting={isMutating}
              onDeleteEntry={(entryId) => deleteEntryMutation.mutate(entryId)}
              onEditEntry={(entryId) => setEditingEntryId(entryId)}
              onOpenDetails={(entryId) => setSelectedEntryId(entryId)}
            />
          </Stack>
        </SectionCard>
      </Stack>

      <ChronicleEntryFormDialog
        campaignId={campaignId}
        isSubmitting={createEntryMutation.isPending}
        onClose={() => {
          createEntryMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (values) => {
          await createEntryMutation.mutateAsync({
            content: values.content.trim(),
            inWorldDate: toNullableString(values.inWorldDate),
            occurredAt: toNullableIsoDateTime(values.occurredAt),
            sessionId: toNullableString(values.sessionId),
            title: values.title.trim(),
            visibility: values.visibility,
          });
          createEntryMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitError={createEntryMutation.error?.message ?? null}
      />

      <ChronicleEntryFormDialog
        campaignId={campaignId}
        initialEntry={editingEntryId ? entryDetailsQuery.data ?? null : null}
        isSubmitting={updateEntryMutation.isPending || entryDetailsQuery.isLoading}
        onClose={() => {
          updateEntryMutation.reset();
          setEditingEntryId(null);
        }}
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
          updateEntryMutation.reset();
          setEditingEntryId(null);
        }}
        open={Boolean(editingEntryId)}
        submitError={updateEntryMutation.error?.message ?? null}
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
            <Typography variant="body2">
              Occurred at: {entryDetailsQuery.data?.occurredAt ?? "Not set"}
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
