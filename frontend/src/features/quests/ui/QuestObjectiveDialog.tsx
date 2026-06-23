import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { QuestObjective } from "@/features/quests/model/quest.types";
import { objectiveStatusOptions } from "@/features/quests/model/quest.types";

const objectiveFormSchema = z.object({
  description: z.string().max(10000).optional(),
  sortOrder: z.number().int().min(0),
  status: z.enum(["TODO", "IN_PROGRESS", "DONE", "FAILED", "OPTIONAL_SKIPPED"]),
  title: z.string().trim().min(1, "Objective title is required.").max(200),
});

type ObjectiveFormValues = z.infer<typeof objectiveFormSchema>;

type QuestObjectiveDialogProps = {
  initialObjective?: QuestObjective | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ObjectiveFormValues) => Promise<void>;
  open: boolean;
};

export function QuestObjectiveDialog({
  initialObjective,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: QuestObjectiveDialogProps) {
  const { handleSubmit, register, reset } = useForm<ObjectiveFormValues>({
    defaultValues: {
      description: initialObjective?.description ?? "",
      sortOrder: initialObjective?.sortOrder ?? 0,
      status: (initialObjective?.status as ObjectiveFormValues["status"] | undefined) ?? "TODO",
      title: initialObjective?.title ?? "",
    },
    resolver: zodResolver(objectiveFormSchema),
  });

  useEffect(() => {
    reset({
      description: initialObjective?.description ?? "",
      sortOrder: initialObjective?.sortOrder ?? 0,
      status: (initialObjective?.status as ObjectiveFormValues["status"] | undefined) ?? "TODO",
      title: initialObjective?.title ?? "",
    });
  }, [initialObjective, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{initialObjective ? "Edit objective" : "Add objective"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <TextField fullWidth label="Title" {...register("title")} />
          <TextField fullWidth label="Description" minRows={3} multiline {...register("description")} />
          <TextField fullWidth label="Status" select {...register("status")}>
            {objectiveStatusOptions.map((status) => (
              <MenuItem key={status} value={status}>
                {status.replace("_", " ")}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label="Sort order"
            type="number"
            {...register("sortOrder", { setValueAs: (value) => Number(value) })}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialObjective ? "Save objective" : "Add objective"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
