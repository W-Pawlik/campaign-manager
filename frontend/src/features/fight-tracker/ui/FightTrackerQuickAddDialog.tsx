import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
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

import type { QuickAddCombatantValues } from "@/features/fight-tracker/model/fightTracker.types";

const schema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(80),
  subtitle: z.string().trim().max(80),
  kind: z.enum(["HERO", "NPC", "MONSTER", "QUICK"]),
  initiative: z.number().int().min(0).max(99),
  armorClass: z.number().int().min(0).max(40),
  speed: z.string().trim().min(1).max(32),
  hitPoints: z.number().int().min(1).max(999),
  tempHitPoints: z.number().int().min(0).max(999),
});

type Props = {
  onClose: () => void;
  onSubmit: (values: QuickAddCombatantValues) => void;
  open: boolean;
};

export function FightTrackerQuickAddDialog({ onClose, onSubmit, open }: Props) {
  const { handleSubmit, register, reset } = useForm<QuickAddCombatantValues>({
    defaultValues: {
      name: "",
      subtitle: "",
      kind: "MONSTER",
      initiative: 10,
      armorClass: 13,
      speed: "30 ft",
      hitPoints: 24,
      tempHitPoints: 0,
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (open) {
      reset({
        name: "",
        subtitle: "",
        kind: "MONSTER",
        initiative: 10,
        armorClass: 13,
        speed: "30 ft",
        hitPoints: 24,
        tempHitPoints: 0,
      });
    }
  }, [open, reset]);

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Quick add combatant</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing={2}>
          <TextField fullWidth label="Name" {...register("name")} />
          <TextField fullWidth label="Subtitle" {...register("subtitle")} />
          <TextField fullWidth label="Type" select {...register("kind")}>
            <MenuItem value="HERO">Hero</MenuItem>
            <MenuItem value="NPC">NPC</MenuItem>
            <MenuItem value="MONSTER">Monster</MenuItem>
            <MenuItem value="QUICK">Quick add</MenuItem>
          </TextField>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField fullWidth label="Initiative" type="number" {...register("initiative", { setValueAs: Number })} />
            <TextField fullWidth label="Armor class" type="number" {...register("armorClass", { setValueAs: Number })} />
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField fullWidth label="HP" type="number" {...register("hitPoints", { setValueAs: Number })} />
            <TextField fullWidth label="Temp HP" type="number" {...register("tempHitPoints", { setValueAs: Number })} />
          </Stack>

          <TextField fullWidth label="Speed" {...register("speed")} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => void handleSubmit(onSubmit)()} variant="contained">
          Add combatant
        </Button>
      </DialogActions>
    </Dialog>
  );
}
