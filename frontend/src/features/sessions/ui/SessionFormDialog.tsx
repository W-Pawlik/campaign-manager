import { zodResolver } from "@hookform/resolvers/zod";
import {
  Alert,
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
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignSessionDetails } from "@/features/sessions/model/session.types";
import {
  sessionLocationTypeOptions,
} from "@/features/sessions/model/session.types";
import { formatSessionStatusLabel, getEditableSessionStatusOptions } from "@/features/sessions/ui/sessionUi.utils";

const sessionFormSchema = z
  .object({
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
  })
  .superRefine((values, context) => {
    if (
      values.scheduledStartAt &&
      values.scheduledEndAt &&
      new Date(values.scheduledEndAt).getTime() < new Date(values.scheduledStartAt).getTime()
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Scheduled end must be after scheduled start.",
        path: ["scheduledEndAt"],
      });
    }
  });

type SessionFormValues = z.infer<typeof sessionFormSchema>;

type SessionFormDialogProps = {
  disableSubmitReason?: string | null;
  initialSession?: CampaignSessionDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: SessionFormValues) => Promise<void>;
  open: boolean;
  submitError?: string | null;
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
  disableSubmitReason = null,
  initialSession,
  isSubmitting,
  onClose,
  onSubmit,
  open,
  submitError = null,
}: SessionFormDialogProps) {
  const initialStatus = initialSession?.status;
  const statusOptions = useMemo(
    () => getEditableSessionStatusOptions(initialStatus),
    [initialStatus],
  );
  const isReadOnly = Boolean(disableSubmitReason);
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
      status:
        (initialStatus as SessionFormValues["status"] | undefined) &&
        statusOptions.includes(initialStatus as (typeof statusOptions)[number])
          ? (initialStatus as SessionFormValues["status"])
          : "PLANNED",
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
      status:
        (initialStatus as SessionFormValues["status"] | undefined) &&
        statusOptions.includes(initialStatus as (typeof statusOptions)[number])
          ? (initialStatus as SessionFormValues["status"])
          : "PLANNED",
      summaryPrivate: "summaryPrivate" in (initialSession ?? {}) ? initialSession?.summaryPrivate ?? "" : "",
      summaryPublic: initialSession?.summaryPublic ?? "",
      title: initialSession?.title ?? "",
    });
  }, [initialSession, initialStatus, reset, statusOptions]);

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
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          {disableSubmitReason ? <Alert severity="info">{disableSubmitReason}</Alert> : null}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                autoFocus
                error={Boolean(errors.title)}
                fullWidth
                helperText={errors.title?.message}
                label="Title"
                disabled={isReadOnly}
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
                disabled={isReadOnly || statusOptions.length === 0}
                {...register("status")}
              >
                {statusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {formatSessionStatusLabel(status)}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                disabled={isReadOnly}
                fullWidth
                label="Description"
                minRows={3}
                multiline
                {...register("description")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                disabled={isReadOnly}
                error={Boolean(errors.scheduledStartAt)}
                fullWidth
                helperText={errors.scheduledStartAt?.message}
                label="Scheduled start"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& input::-webkit-calendar-picker-indicator": {
                    cursor: "pointer",
                    filter:
                      "invert(16%) sepia(88%) saturate(3238%) hue-rotate(349deg) brightness(86%) contrast(106%)",
                  },
                }}
                type="datetime-local"
                {...register("scheduledStartAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                disabled={isReadOnly}
                error={Boolean(errors.scheduledEndAt)}
                fullWidth
                helperText={errors.scheduledEndAt?.message}
                label="Scheduled end"
                slotProps={{
                  inputLabel: { shrink: true },
                }}
                sx={{
                  "& input::-webkit-calendar-picker-indicator": {
                    cursor: "pointer",
                    filter:
                      "invert(16%) sepia(88%) saturate(3238%) hue-rotate(349deg) brightness(86%) contrast(106%)",
                  },
                }}
                type="datetime-local"
                {...register("scheduledEndAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField disabled={isReadOnly} fullWidth label="Location type" select {...register("locationType")}>
                <MenuItem value="">Not set</MenuItem>
                {sessionLocationTypeOptions.map((locationType) => (
                  <MenuItem key={locationType} value={locationType}>
                    {locationType.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField disabled={isReadOnly} fullWidth label="Location details" {...register("locationDetails")} />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                disabled={isReadOnly}
                error={Boolean(errors.meetingUrl)}
                fullWidth
                helperText={errors.meetingUrl?.message ?? "Optional video call or board URL."}
                label="Meeting URL"
                {...register("meetingUrl")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                disabled={isReadOnly}
                fullWidth
                label="Public summary"
                minRows={4}
                multiline
                {...register("summaryPublic")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                disabled={isReadOnly}
                fullWidth
                label="Private GM summary"
                minRows={4}
                multiline
                {...register("summaryPrivate")}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={handleDialogClose}>Cancel</Button>
        <Button
          disabled={isSubmitting || isReadOnly}
          onClick={() => void handleValidSubmit()}
          variant="contained"
        >
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialSession ? "Save changes" : "Create session"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
