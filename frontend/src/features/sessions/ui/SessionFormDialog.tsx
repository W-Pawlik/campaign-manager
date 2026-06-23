import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignSessionDetails } from "@/features/sessions/model/session.types";
import {
  sessionLocationTypeOptions,
  sessionStatusOptions,
} from "@/features/sessions/model/session.types";

const sessionFormSchema = z.object({
  description: z.string().max(10000).optional(),
  locationDetails: z.string().max(10000).optional(),
  locationType: z.enum(["ONLINE", "IN_PERSON", "HYBRID", "UNKNOWN", ""]).optional(),
  meetingUrl: z.string().trim().url("Enter a valid URL.").or(z.literal("")).optional(),
  scheduledEndAt: z.string().optional(),
  scheduledStartAt: z.string().optional(),
  status: z.enum(["PLANNED", "CONFIRMED", "COMPLETED", "CANCELLED", "POSTPONED"]),
  summaryPrivate: z.string().max(10000).optional(),
  summaryPublic: z.string().max(10000).optional(),
  title: z.string().trim().min(1, "Session title is required.").max(200),
});

type SessionFormValues = z.infer<typeof sessionFormSchema>;

type SessionFormDialogProps = {
  initialSession?: CampaignSessionDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => Promise<void>;
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

export function SessionFormDialog({
  initialSession,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: SessionFormDialogProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<SessionFormValues>({
    defaultValues: {
      description: initialSession?.description ?? "",
      locationDetails: initialSession?.locationDetails ?? "",
      locationType: (initialSession?.locationType as SessionFormValues["locationType"] | undefined) ?? "",
      meetingUrl: initialSession?.meetingUrl ?? "",
      scheduledEndAt: toDateTimeLocalValue(initialSession?.scheduledEndAt),
      scheduledStartAt: toDateTimeLocalValue(initialSession?.scheduledStartAt),
      status: (initialSession?.status as SessionFormValues["status"] | undefined) ?? "PLANNED",
      summaryPrivate: "summaryPrivate" in (initialSession ?? {}) ? initialSession?.summaryPrivate ?? "" : "",
      summaryPublic: initialSession?.summaryPublic ?? "",
      title: initialSession?.title ?? "",
    },
    resolver: zodResolver(sessionFormSchema),
  });

  useEffect(() => {
    reset({
      description: initialSession?.description ?? "",
      locationDetails: initialSession?.locationDetails ?? "",
      locationType: (initialSession?.locationType as SessionFormValues["locationType"] | undefined) ?? "",
      meetingUrl: initialSession?.meetingUrl ?? "",
      scheduledEndAt: toDateTimeLocalValue(initialSession?.scheduledEndAt),
      scheduledStartAt: toDateTimeLocalValue(initialSession?.scheduledStartAt),
      status: (initialSession?.status as SessionFormValues["status"] | undefined) ?? "PLANNED",
      summaryPrivate: "summaryPrivate" in (initialSession ?? {}) ? initialSession?.summaryPrivate ?? "" : "",
      summaryPublic: initialSession?.summaryPublic ?? "",
      title: initialSession?.title ?? "",
    });
  }, [initialSession, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  const handleDialogClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog fullWidth maxWidth="md" onClose={handleDialogClose} open={open}>
      <DialogTitle>{initialSession ? "Edit session" : "Create session"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                autoFocus
                error={Boolean(errors.title)}
                fullWidth
                helperText={errors.title?.message}
                label="Title"
                {...register("title")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                error={Boolean(errors.status)}
                fullWidth
                helperText={errors.status?.message}
                label="Status"
                select
                {...register("status")}
              >
                {sessionStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" minRows={3} multiline {...register("description")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Scheduled start"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("scheduledStartAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Scheduled end"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("scheduledEndAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Location type" select {...register("locationType")}>
                <MenuItem value="">Not set</MenuItem>
                {sessionLocationTypeOptions.map((locationType) => (
                  <MenuItem key={locationType} value={locationType}>
                    {locationType.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField fullWidth label="Location details" {...register("locationDetails")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                error={Boolean(errors.meetingUrl)}
                fullWidth
                helperText={errors.meetingUrl?.message ?? "Optional video call or board URL."}
                label="Meeting URL"
                {...register("meetingUrl")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Public summary" minRows={4} multiline {...register("summaryPublic")} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Private GM summary" minRows={4} multiline {...register("summaryPrivate")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialSession ? "Save changes" : "Create session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
