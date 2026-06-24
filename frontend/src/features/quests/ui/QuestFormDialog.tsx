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
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCampaignReferenceIndex } from "@/features/campaigns";
import type { CampaignQuestDetails } from "@/features/quests/model/quest.types";
import {
  questPriorityOptions,
  questStatusOptions,
  questTypeOptions,
  questVisibilityOptions,
} from "@/features/quests/model/quest.types";

function toComparableTimestamp(value?: string): number | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return new Date(value).getTime();
}

function isCompletedStatus(status: QuestFormValues["status"]): boolean {
  return status === "COMPLETED";
}

function isFailedStatus(status: QuestFormValues["status"]): boolean {
  return status === "FAILED" || status === "ABANDONED";
}

const questFormSchema = z
  .object({
    completedAt: z.string().optional(),
    description: z.string().max(10000).optional(),
    failedAt: z.string().optional(),
    giverNpcId: z.string().optional(),
    gmNotes: z.string().max(10000).optional(),
    priority: z.enum(["LOW", "NORMAL", "HIGH", "CRITICAL"]),
    relatedLocationId: z.string().optional(),
    rewardDescription: z.string().max(10000).optional(),
    startedAt: z.string().optional(),
    status: z.enum(["DRAFT", "AVAILABLE", "ACTIVE", "ON_HOLD", "COMPLETED", "FAILED", "ABANDONED", "HIDDEN"]),
    title: z.string().trim().min(1, "Quest title is required.").max(200),
    type: z.enum(["MAIN", "SIDE", "PERSONAL", "FACTION", "WORLD_EVENT"]),
    visibility: z.enum(["PUBLIC", "GM_ONLY", "DISCOVERED"]),
  })
  .superRefine((values, context) => {
    const startedAt = toComparableTimestamp(values.startedAt);
    const completedAt = toComparableTimestamp(values.completedAt);
    const failedAt = toComparableTimestamp(values.failedAt);

    if (startedAt !== null && completedAt !== null && completedAt < startedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Completed date cannot be earlier than the start date.",
        path: ["completedAt"],
      });
    }

    if (startedAt !== null && failedAt !== null && failedAt < startedAt) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Failed date cannot be earlier than the start date.",
        path: ["failedAt"],
      });
    }

    if (completedAt !== null && failedAt !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A quest cannot be both completed and failed. Clear one of these dates.",
        path: ["completedAt"],
      });
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "A quest cannot be both failed and completed. Clear one of these dates.",
        path: ["failedAt"],
      });
    }

    if (isFailedStatus(values.status) && completedAt !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Failed or abandoned quests cannot have a completed date.",
        path: ["completedAt"],
      });
    }

    if (isCompletedStatus(values.status) && failedAt !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Completed quests cannot have a failed date.",
        path: ["failedAt"],
      });
    }

    if (!isCompletedStatus(values.status) && !isFailedStatus(values.status) && completedAt !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only completed quests can have a completed date.",
        path: ["completedAt"],
      });
    }

    if (!isFailedStatus(values.status) && failedAt !== null) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Only failed or abandoned quests can have a failed date.",
        path: ["failedAt"],
      });
    }
  });

type QuestFormValues = z.infer<typeof questFormSchema>;

type QuestFormDialogProps = {
  campaignId: string;
  initialQuest?: CampaignQuestDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: QuestFormValues) => Promise<void>;
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

export function QuestFormDialog({
  campaignId,
  initialQuest,
  isSubmitting,
  onClose,
  onSubmit,
  open,
  submitError = null,
}: QuestFormDialogProps) {
  const references = useCampaignReferenceIndex(campaignId, ["NPC", "LOCATION"]);
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<QuestFormValues>({
    defaultValues: {
      completedAt: toDateTimeLocalValue(initialQuest?.completedAt),
      description: initialQuest?.description ?? "",
      failedAt: toDateTimeLocalValue(initialQuest?.failedAt),
      giverNpcId: initialQuest?.giverNpcId ?? "",
      gmNotes: initialQuest?.gmNotes ?? "",
      priority: (initialQuest?.priority as QuestFormValues["priority"] | undefined) ?? "NORMAL",
      relatedLocationId: initialQuest?.relatedLocationId ?? "",
      rewardDescription: initialQuest?.rewardDescription ?? "",
      startedAt: toDateTimeLocalValue(initialQuest?.startedAt),
      status: (initialQuest?.status as QuestFormValues["status"] | undefined) ?? "DRAFT",
      title: initialQuest?.title ?? "",
      type: (initialQuest?.type as QuestFormValues["type"] | undefined) ?? "SIDE",
      visibility: (initialQuest?.visibility as QuestFormValues["visibility"] | undefined) ?? "DISCOVERED",
    },
    resolver: zodResolver(questFormSchema),
  });

  useEffect(() => {
    reset({
      completedAt: toDateTimeLocalValue(initialQuest?.completedAt),
      description: initialQuest?.description ?? "",
      failedAt: toDateTimeLocalValue(initialQuest?.failedAt),
      giverNpcId: initialQuest?.giverNpcId ?? "",
      gmNotes: initialQuest?.gmNotes ?? "",
      priority: (initialQuest?.priority as QuestFormValues["priority"] | undefined) ?? "NORMAL",
      relatedLocationId: initialQuest?.relatedLocationId ?? "",
      rewardDescription: initialQuest?.rewardDescription ?? "",
      startedAt: toDateTimeLocalValue(initialQuest?.startedAt),
      status: (initialQuest?.status as QuestFormValues["status"] | undefined) ?? "DRAFT",
      title: initialQuest?.title ?? "",
      type: (initialQuest?.type as QuestFormValues["type"] | undefined) ?? "SIDE",
      visibility: (initialQuest?.visibility as QuestFormValues["visibility"] | undefined) ?? "DISCOVERED",
    });
  }, [initialQuest, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialQuest ? "Edit quest" : "Create quest"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          {submitError ? <Alert severity="error">{submitError}</Alert> : null}
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
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
                {questStatusOptions.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="Description" minRows={3} multiline {...register("description")} />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Type" select {...register("type")}>
                {questTypeOptions.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Visibility" select {...register("visibility")}>
                {questVisibilityOptions.map((visibility) => (
                  <MenuItem key={visibility} value={visibility}>
                    {visibility.replace("_", " ")}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField fullWidth label="Priority" select {...register("priority")}>
                {questPriorityOptions.map((priority) => (
                  <MenuItem key={priority} value={priority}>
                    {priority}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Quest giver" select {...register("giverNpcId")}>
                <MenuItem value="">Not set</MenuItem>
                {references.getReferenceOptions("NPC").map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField fullWidth label="Related location" select {...register("relatedLocationId")}>
                <MenuItem value="">Not set</MenuItem>
                {references.getReferenceOptions("LOCATION").map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                error={Boolean(errors.startedAt)}
                fullWidth
                helperText={errors.startedAt?.message}
                label="Started at"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("startedAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                error={Boolean(errors.completedAt)}
                fullWidth
                helperText={errors.completedAt?.message}
                label="Completed at"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("completedAt")}
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField
                error={Boolean(errors.failedAt)}
                fullWidth
                helperText={errors.failedAt?.message}
                label="Failed at"
                slotProps={{ inputLabel: { shrink: true } }}
                type="datetime-local"
                {...register("failedAt")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Reward description"
                minRows={2}
                multiline
                {...register("rewardDescription")}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField fullWidth label="GM notes" minRows={3} multiline {...register("gmNotes")} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialQuest ? "Save changes" : "Create quest"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
