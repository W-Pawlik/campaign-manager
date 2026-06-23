import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery, useCampaignLocationsQuery, useCampaignReferenceIndex } from "@/features/campaigns";
import { useCreateLocationMutation, useDeleteLocationMutation, useLocationDetailsQuery, useUpdateLocationMutation } from "@/features/locations/api/locationsQueries";
import { CampaignLocationsList } from "@/features/locations/ui/CampaignLocationsList";
import { LocationFormDialog } from "@/features/locations/ui/LocationFormDialog";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageLocations(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

export function CampaignLocationsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const locationsQuery = useCampaignLocationsQuery(campaignId);
  const createLocationMutation = useCreateLocationMutation(campaignId);
  const updateLocationMutation = useUpdateLocationMutation(campaignId);
  const deleteLocationMutation = useDeleteLocationMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingLocationId, setEditingLocationId] = useState<string | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
  const locationDetailsQuery = useLocationDetailsQuery(campaignId, selectedLocationId ?? editingLocationId);
  const references = useCampaignReferenceIndex(campaignId, ["LOCATION"]);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (locationsQuery.isError) {
      return locationsQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, locationsQuery.error, locationsQuery.isError]);

  if (campaignDetailsQuery.isLoading || locationsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Locations could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void locationsQuery.refetch();
        }}
        title="Unable to load locations"
      />
    );
  }

  const canManage = canManageLocations(campaignDetailsQuery.data.role);
  const isMutating =
    createLocationMutation.isPending || updateLocationMutation.isPending || deleteLocationMutation.isPending;
  const mutationError =
    createLocationMutation.error?.message ??
    updateLocationMutation.error?.message ??
    deleteLocationMutation.error?.message ??
    null;

  const locationOptions = (locationsQuery.data ?? []).map((location) => ({ id: location.id, name: location.name }));

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManage ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Create location
              </Button>
            ) : undefined
          }
          description="Organize the world map into a navigable hierarchy with public and GM-only world knowledge."
          title="Locations"
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <SectionCard>
          <CampaignLocationsList
            canManageLocations={canManage}
            isSubmitting={isMutating}
            locations={locationsQuery.data ?? []}
            onDeleteLocation={(locationId) => deleteLocationMutation.mutate(locationId)}
            onEditLocation={(locationId) => setEditingLocationId(locationId)}
            onOpenDetails={(locationId) => setSelectedLocationId(locationId)}
          />
        </SectionCard>
      </Stack>

      <LocationFormDialog
        isSubmitting={createLocationMutation.isPending}
        locations={locationOptions}
        onClose={() => setIsCreateDialogOpen(false)}
        onSubmit={async (values) => {
          await createLocationMutation.mutateAsync({
            description: toNullableString(values.description),
            gmNotes: toNullableString(values.gmNotes),
            mapImageUrl: toNullableString(values.mapImageUrl),
            name: values.name.trim(),
            parentLocationId: toNullableString(values.parentLocationId),
            shortDescription: toNullableString(values.shortDescription),
            status: values.status,
            type: values.type,
            visibility: values.visibility,
          });
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
      />

      <LocationFormDialog
        initialLocation={editingLocationId ? locationDetailsQuery.data ?? null : null}
        isSubmitting={updateLocationMutation.isPending || locationDetailsQuery.isLoading}
        locations={locationOptions}
        onClose={() => setEditingLocationId(null)}
        onSubmit={async (values) => {
          if (!editingLocationId) {
            return;
          }

          await updateLocationMutation.mutateAsync({
            locationId: editingLocationId,
            payload: {
              description: toNullableString(values.description),
              gmNotes: toNullableString(values.gmNotes),
              mapImageUrl: toNullableString(values.mapImageUrl),
              name: values.name.trim(),
              parentLocationId: toNullableString(values.parentLocationId),
              shortDescription: toNullableString(values.shortDescription),
              status: values.status,
              type: values.type,
              visibility: values.visibility,
            },
          });
          setEditingLocationId(null);
        }}
        open={Boolean(editingLocationId)}
      />

      <Dialog fullWidth maxWidth="md" onClose={() => setSelectedLocationId(null)} open={Boolean(selectedLocationId)}>
        <DialogTitle>{locationDetailsQuery.data?.name ?? "Location details"}</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <Typography color="text.secondary">
              {locationDetailsQuery.data?.description ?? locationDetailsQuery.data?.shortDescription}
            </Typography>
            {locationDetailsQuery.data?.parentLocationId ? (
              <Typography variant="body2">
                Parent: {references.getReferenceLabel("LOCATION", locationDetailsQuery.data.parentLocationId)}
              </Typography>
            ) : null}
            {"gmNotes" in (locationDetailsQuery.data ?? {}) && locationDetailsQuery.data?.gmNotes ? (
              <Typography variant="body2">GM notes: {locationDetailsQuery.data.gmNotes}</Typography>
            ) : null}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, py: 2 }}>
          <Button onClick={() => setSelectedLocationId(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
