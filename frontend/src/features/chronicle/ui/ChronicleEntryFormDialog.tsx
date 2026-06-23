import { zodResolver } from "@hookform/resolvers/zod";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCampaignReferenceIndex } from "@/features/campaigns";
import type { ChronicleEntryDetails } from "@/features/chronicle/model/chronicle.types";
import { chronicleVisibilityOptions } from "@/features/chronicle/model/chronicle.types";

const chronicleFormSchema = z.object({
  content: z.string().trim().min(1, "Entry content is required.").max(20000),
  inWorldDate: z.string().max(120).optional(),
  occurredAt: z.string().optional(),
  sessionId: z.string().optional(),
  title: z.string().trim().min(1, "Entry title is required.").max(200),
  visibility: z.enum(["PUBLIC", "GM_ONLY", "DRAFT"]),
});

type ChronicleFormValues = z.infer<typeof chronicleFormSchema>;

type ChronicleEntryFormDialogProps = {
  campaignId: string;
  initialEntry?: ChronicleEntryDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ChronicleFormValues) => Promise<void>;
  open: boolean;
};

function toDateTimeLocalValue(value: string | null | undefined): string {
  if (!value) {
    return "";
  }

  const date = new Date(value);
  const offsetDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);

  return offsetDate.toISOString().slice(0, 16);
}

export function ChronicleEntryFormDialog({
  campaignId,
  initialEntry,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: ChronicleEntryFormDialogProps) {
  const references = useCampaignReferenceIndex(campaignId, ["SESSION"]);
  const { handleSubmit, register, reset } = useForm<ChronicleFormValues>({
    defaultValues: {
      content: initialEntry?.content ?? "",
      inWorldDate: initialEntry?.inWorldDate ?? "",
      occurredAt: toDateTimeLocalValue(initialEntry?.occurredAt),
      sessionId: initialEntry?.sessionId ?? "",
      title: initialEntry?.title ?? "",
      visibility: (initialEntry?.visibility as ChronicleFormValues["visibility"] | undefined) ?? "PUBLIC",
    },
    resolver: zodResolver(chronicleFormSchema),
  });

  useEffect(() => {
    reset({
      content: initialEntry?.content ?? "",
      inWorldDate: initialEntry?.inWorldDate ?? "",
      occurredAt: toDateTimeLocalValue(initialEntry?.occurredAt),
      sessionId: initialEntry?.sessionId ?? "",
      title: initialEntry?.title ?? "",
      visibility: (initialEntry?.visibility as ChronicleFormValues["visibility"] | undefined) ?? "PUBLIC",
    });
  }, [initialEntry, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialEntry ? "Edit chronicle entry" : "Create chronicle entry"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Title" {...register("title")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Visibility" select {...register("visibility")}>
                {chronicleVisibilityOptions.map((visibility) => (
                  <MenuItem key={visibility} value={visibility}>
                    {visibility.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Linked session" select {...register("sessionId")}>
                <MenuItem value="">Not linked</MenuItem>
                {references.getReferenceOptions("SESSION").map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="In-world date" {...register("inWorldDate")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Occurred at"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("occurredAt")}
              />
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
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialEntry ? "Save changes" : "Create entry"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
