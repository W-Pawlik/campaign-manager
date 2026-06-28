import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CreateEncounterValues } from "@/features/fight-tracker/model/fightTracker.types";

const schema = z.object({
  encounterName: z.string().trim().min(1, "Encounter name is required.").max(80),
  environmentName: z.string().trim().min(1, "Environment name is required.").max(80),
  environmentDetails: z.string().trim().min(1, "Environment details are required.").max(220),
});

type FightTrackerCreateEncounterDialogProps = {
  onClose: () => void;
  onSubmit: (values: CreateEncounterValues) => void;
  open: boolean;
};

export function FightTrackerCreateEncounterDialog({
  onClose,
  onSubmit,
  open,
}: FightTrackerCreateEncounterDialogProps) {
  const { handleSubmit, register, reset } = useForm<CreateEncounterValues>({
    defaultValues: {
      encounterName: "",
      environmentName: "",
      environmentDetails: "",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      encounterName: "",
      environmentName: "",
      environmentDetails: "",
    });
  }, [open, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Create encounter</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <TextField fullWidth label="Encounter name" {...register("encounterName")} />
          <TextField fullWidth label="Environment name" {...register("environmentName")} />
          <TextField
            fullWidth
            label="Environment details"
            minRows={4}
            multiline
            {...register("environmentDetails")}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => void handleSubmit(onSubmit)()} variant="contained">
          Create and open
        </Button>
      </DialogActions>
    </Dialog>
  );
}
