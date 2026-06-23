import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignLocationDetails } from "@/features/locations/model/location.types";
import {
  locationStatusOptions,
  locationTypeOptions,
  locationVisibilityOptions,
} from "@/features/locations/model/location.types";

const locationFormSchema = z.object({
  description: z.string().max(10000).optional(),
  gmNotes: z.string().max(10000).optional(),
  mapImageUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  name: z.string().trim().min(1, "Location name is required.").max(120),
  parentLocationId: z.string().optional(),
  shortDescription: z.string().max(10000).optional(),
  status: z.enum(["ACTIVE", "DESTROYED", "LOST", "HIDDEN", "ARCHIVED"]),
  type: z.enum(["WORLD", "CONTINENT", "REGION", "KINGDOM", "CITY", "DISTRICT", "BUILDING", "DUNGEON", "ROOM", "LANDMARK", "PLANE", "OTHER"]),
  visibility: z.enum(["PUBLIC", "DISCOVERED", "GM_ONLY"]),
});

type LocationFormValues = z.infer<typeof locationFormSchema>;

type LocationFormDialogProps = {
  initialLocation?: CampaignLocationDetails | null;
  isSubmitting: boolean;
  locations: Array<{ id: string; name: string }>;
  onClose: () => void;
  onSubmit: (values: LocationFormValues) => Promise<void>;
  open: boolean;
};

export function LocationFormDialog({
  initialLocation,
  isSubmitting,
  locations,
  onClose,
  onSubmit,
  open,
}: LocationFormDialogProps) {
  const { handleSubmit, register, reset } = useForm<LocationFormValues>({
    defaultValues: {
      description: initialLocation?.description ?? "",
      gmNotes: initialLocation?.gmNotes ?? "",
      mapImageUrl: initialLocation?.mapImageUrl ?? "",
      name: initialLocation?.name ?? "",
      parentLocationId: initialLocation?.parentLocationId ?? "",
      shortDescription: initialLocation?.shortDescription ?? "",
      status: (initialLocation?.status as LocationFormValues["status"] | undefined) ?? "ACTIVE",
      type: (initialLocation?.type as LocationFormValues["type"] | undefined) ?? "OTHER",
      visibility: (initialLocation?.visibility as LocationFormValues["visibility"] | undefined) ?? "DISCOVERED",
    },
    resolver: zodResolver(locationFormSchema),
  });

  useEffect(() => {
    reset({
      description: initialLocation?.description ?? "",
      gmNotes: initialLocation?.gmNotes ?? "",
      mapImageUrl: initialLocation?.mapImageUrl ?? "",
      name: initialLocation?.name ?? "",
      parentLocationId: initialLocation?.parentLocationId ?? "",
      shortDescription: initialLocation?.shortDescription ?? "",
      status: (initialLocation?.status as LocationFormValues["status"] | undefined) ?? "ACTIVE",
      type: (initialLocation?.type as LocationFormValues["type"] | undefined) ?? "OTHER",
      visibility: (initialLocation?.visibility as LocationFormValues["visibility"] | undefined) ?? "DISCOVERED",
    });
  }, [initialLocation, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialLocation ? "Edit location" : "Create location"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Name" {...register("name")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Type" select {...register("type")}>
                {locationTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Parent location" select {...register("parentLocationId")}>
                <MenuItem value="">No parent</MenuItem>
                {locations
                  .filter((location) => location.id !== initialLocation?.id)
                  .map((location) => (
                    <MenuItem key={location.id} value={location.id}>
                      {location.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Status" select {...register("status")}>
                {locationStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Visibility" select {...register("visibility")}>
                {locationVisibilityOptions.map((visibility) => (
                  <MenuItem key={visibility} value={visibility}>
                    {visibility.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Short description" minRows={2} multiline {...register("shortDescription")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" minRows={4} multiline {...register("description")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="GM notes" minRows={3} multiline {...register("gmNotes")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Map image URL" {...register("mapImageUrl")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialLocation ? "Save changes" : "Create location"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
