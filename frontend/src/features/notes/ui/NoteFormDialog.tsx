import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useCampaignDetailsQuery, useCampaignReferenceIndex } from "@/features/campaigns";
import type { NoteDetails } from "@/features/notes/model/note.types";
import {
  noteCategoryOptions,
  noteVisibilityOptions,
  relatedEntityTypeOptions,
} from "@/features/notes/model/note.types";

const noteFormSchema = z.object({
  category: z.enum(["GENERAL", "SESSION", "CHARACTER", "QUEST", "LOCATION", "NPC", "ITEM", "LORE", "GM_SECRET", "PLAYER_NOTE"]),
  content: z.string().trim().min(1, "Note content is required.").max(20000),
  relatedEntityId: z.string().optional(),
  relatedEntityType: z.enum(["CAMPAIGN", "SESSION", "CHARACTER", "NPC", "QUEST", "LOCATION", "ITEM", "CHRONICLE_ENTRY", ""]).optional(),
  title: z.string().max(200).optional(),
  visibility: z.enum(["PRIVATE_AUTHOR", "PRIVATE_GM", "CAMPAIGN_PUBLIC", "SESSION_PUBLIC", "CHARACTER_OWNER"]),
});

type NoteFormValues = z.infer<typeof noteFormSchema>;

type NoteFormDialogProps = {
  campaignId: string;
  initialNote?: NoteDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: NoteFormValues) => Promise<void>;
  open: boolean;
};

export function NoteFormDialog({
  campaignId,
  initialNote,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: NoteFormDialogProps) {
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const references = useCampaignReferenceIndex(campaignId, [
    "SESSION",
    "CHARACTER",
    "NPC",
    "QUEST",
    "LOCATION",
    "CHRONICLE_ENTRY",
    "CAMPAIGN",
  ], campaignDetailsQuery.data?.name);
  const { control, handleSubmit, register, reset } = useForm<NoteFormValues>({
    defaultValues: {
      category: (initialNote?.category as NoteFormValues["category"] | undefined) ?? "GENERAL",
      content: initialNote?.content ?? "",
      relatedEntityId: initialNote?.relatedEntityId ?? "",
      relatedEntityType: (initialNote?.relatedEntityType as NoteFormValues["relatedEntityType"] | undefined) ?? "",
      title: initialNote?.title ?? "",
      visibility: (initialNote?.visibility as NoteFormValues["visibility"] | undefined) ?? "CAMPAIGN_PUBLIC",
    },
    resolver: zodResolver(noteFormSchema),
  });
  const selectedEntityType = useWatch({ control, name: "relatedEntityType" });

  useEffect(() => {
    reset({
      category: (initialNote?.category as NoteFormValues["category"] | undefined) ?? "GENERAL",
      content: initialNote?.content ?? "",
      relatedEntityId: initialNote?.relatedEntityId ?? "",
      relatedEntityType: (initialNote?.relatedEntityType as NoteFormValues["relatedEntityType"] | undefined) ?? "",
      title: initialNote?.title ?? "",
      visibility: (initialNote?.visibility as NoteFormValues["visibility"] | undefined) ?? "CAMPAIGN_PUBLIC",
    });
  }, [initialNote, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialNote ? "Edit note" : "Create note"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 7 }}>
              <TextField fullWidth label="Title" {...register("title")} />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField fullWidth label="Visibility" select {...register("visibility")}>
                {noteVisibilityOptions.map((visibility) => (
                  <MenuItem key={visibility} value={visibility}>
                    {visibility.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Category" select {...register("category")}>
                {noteCategoryOptions.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Related entity type" select {...register("relatedEntityType")}>
                <MenuItem value="">No relation</MenuItem>
                {relatedEntityTypeOptions.map((entityType) => (
                  <MenuItem key={entityType} value={entityType}>
                    {entityType.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Related entity" select {...register("relatedEntityId")}>
                <MenuItem value="">Not linked</MenuItem>
                {references.getReferenceOptions((selectedEntityType || undefined) as never).map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Content" minRows={6} multiline {...register("content")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialNote ? "Save changes" : "Create note"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
