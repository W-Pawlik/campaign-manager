import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCampaignReferenceIndex } from "@/features/campaigns";
import type { CampaignNpcDetails } from "@/features/npcs/model/npc.types";
import { npcAttitudeOptions, npcImportanceOptions, npcStatusOptions } from "@/features/npcs/model/npc.types";

const npcFormSchema = z.object({
  appearance: z.string().max(10000).optional(),
  attitude: z.enum(["FRIENDLY", "NEUTRAL", "HOSTILE", "UNKNOWN"]),
  faction: z.string().max(120).optional(),
  gmNotes: z.string().max(10000).optional(),
  importance: z.enum(["MINOR", "SUPPORTING", "MAJOR", "BOSS"]),
  locationId: z.string().optional(),
  motivations: z.string().max(10000).optional(),
  name: z.string().trim().min(1, "NPC name is required.").max(120),
  occupation: z.string().max(120).optional(),
  personality: z.string().max(10000).optional(),
  publicDescription: z.string().max(10000).optional(),
  race: z.string().max(120).optional(),
  secrets: z.string().max(10000).optional(),
  status: z.enum(["ALIVE", "DEAD", "MISSING", "UNKNOWN", "ARCHIVED"]),
  title: z.string().max(120).optional(),
});

type NpcFormValues = z.infer<typeof npcFormSchema>;

type NpcFormDialogProps = {
  campaignId: string;
  initialNpc?: CampaignNpcDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: NpcFormValues) => Promise<void>;
  open: boolean;
};

export function NpcFormDialog({
  campaignId,
  initialNpc,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: NpcFormDialogProps) {
  const references = useCampaignReferenceIndex(campaignId, ["LOCATION"]);
  const { handleSubmit, register, reset } = useForm<NpcFormValues>({
    defaultValues: {
      appearance: initialNpc?.appearance ?? "",
      attitude: (initialNpc?.attitude as NpcFormValues["attitude"] | undefined) ?? "UNKNOWN",
      faction: initialNpc?.faction ?? "",
      gmNotes: initialNpc?.gmNotes ?? "",
      importance: (initialNpc?.importance as NpcFormValues["importance"] | undefined) ?? "MINOR",
      locationId: initialNpc?.locationId ?? "",
      motivations: initialNpc?.motivations ?? "",
      name: initialNpc?.name ?? "",
      occupation: initialNpc?.occupation ?? "",
      personality: initialNpc?.personality ?? "",
      publicDescription: initialNpc?.publicDescription ?? "",
      race: initialNpc?.race ?? "",
      secrets: initialNpc?.secrets ?? "",
      status: (initialNpc?.status as NpcFormValues["status"] | undefined) ?? "ALIVE",
      title: initialNpc?.title ?? "",
    },
    resolver: zodResolver(npcFormSchema),
  });

  useEffect(() => {
    reset({
      appearance: initialNpc?.appearance ?? "",
      attitude: (initialNpc?.attitude as NpcFormValues["attitude"] | undefined) ?? "UNKNOWN",
      faction: initialNpc?.faction ?? "",
      gmNotes: initialNpc?.gmNotes ?? "",
      importance: (initialNpc?.importance as NpcFormValues["importance"] | undefined) ?? "MINOR",
      locationId: initialNpc?.locationId ?? "",
      motivations: initialNpc?.motivations ?? "",
      name: initialNpc?.name ?? "",
      occupation: initialNpc?.occupation ?? "",
      personality: initialNpc?.personality ?? "",
      publicDescription: initialNpc?.publicDescription ?? "",
      race: initialNpc?.race ?? "",
      secrets: initialNpc?.secrets ?? "",
      status: (initialNpc?.status as NpcFormValues["status"] | undefined) ?? "ALIVE",
      title: initialNpc?.title ?? "",
    });
  }, [initialNpc, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialNpc ? "Edit NPC" : "Create NPC"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Name" {...register("name")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Title" {...register("title")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Race" {...register("race")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Occupation" {...register("occupation")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Faction" {...register("faction")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Attitude" select {...register("attitude")}>
                {npcAttitudeOptions.map((attitude) => (
                  <MenuItem key={attitude} value={attitude}>
                    {attitude}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Importance" select {...register("importance")}>
                {npcImportanceOptions.map((importance) => (
                  <MenuItem key={importance} value={importance}>
                    {importance}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Status" select {...register("status")}>
                {npcStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Location" select {...register("locationId")}>
                <MenuItem value="">Not linked</MenuItem>
                {references.getReferenceOptions("LOCATION").map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Public description" minRows={3} multiline {...register("publicDescription")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Appearance" minRows={3} multiline {...register("appearance")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Personality" minRows={3} multiline {...register("personality")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="GM notes" minRows={3} multiline {...register("gmNotes")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Motivations" minRows={3} multiline {...register("motivations")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Secrets" minRows={3} multiline {...register("secrets")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialNpc ? "Save changes" : "Create NPC"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
