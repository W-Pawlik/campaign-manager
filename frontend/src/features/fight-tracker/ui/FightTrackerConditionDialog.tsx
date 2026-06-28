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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type {
  FightCombatant,
  FightConditionFormValues,
  FightConditionTone,
  FightConditionUnit,
} from "@/features/fight-tracker/model/fightTracker.types";

const schema = z.object({
  targetCombatantId: z.string().nullable(),
  name: z.string().trim().min(1, "Name is required.").max(60),
  details: z.string().trim().min(1, "Add a short effect summary.").max(180),
  duration: z.number().int().min(1).max(99).nullable(),
  unit: z.enum(["ROUNDS", "TURNS", "PERMANENT"]),
  tone: z.enum(["violet", "emerald", "amber", "blue", "red", "slate"]),
});

type Props = {
  combatants: FightCombatant[];
  initialTargetCombatantId?: string | null;
  mode: "combatant" | "global";
  onClose: () => void;
  onSubmit: (values: FightConditionFormValues) => void;
  open: boolean;
};

const toneOptions: FightConditionTone[] = ["violet", "emerald", "amber", "blue", "red", "slate"];
const unitOptions: FightConditionUnit[] = ["ROUNDS", "TURNS", "PERMANENT"];

export function FightTrackerConditionDialog({
  combatants,
  initialTargetCombatantId = null,
  mode,
  onClose,
  onSubmit,
  open,
}: Props) {
  const [unitValue, setUnitValue] = useState<FightConditionUnit>("ROUNDS");
  const { getValues, handleSubmit, register, reset, setValue } = useForm<FightConditionFormValues>({
    defaultValues: {
      targetCombatantId:
        mode === "combatant"
          ? initialTargetCombatantId ?? combatants[0]?.id ?? null
          : null,
      name: "",
      details: "",
      duration: 2,
      unit: "ROUNDS",
      tone: "violet",
    },
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    reset({
      targetCombatantId:
        mode === "combatant"
          ? initialTargetCombatantId ?? combatants[0]?.id ?? null
          : null,
      name: "",
      details: "",
      duration: 2,
      unit: "ROUNDS",
      tone: "violet",
    });
  }, [combatants, initialTargetCombatantId, mode, reset, open]);

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>{mode === "combatant" ? "Add combatant state" : "Add battlefield effect"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleSubmit(onSubmit)} spacing={2}>
          {mode === "combatant" ? (
            <TextField fullWidth label="Target" select {...register("targetCombatantId")}>
              {combatants.map((combatant) => (
                <MenuItem key={combatant.id} value={combatant.id}>
                  {combatant.name}
                </MenuItem>
              ))}
            </TextField>
          ) : null}

          <TextField fullWidth label="Name" {...register("name")} />
          <TextField fullWidth label="Effect summary" minRows={3} multiline {...register("details")} />

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
            <TextField
              fullWidth
              label="Duration unit"
              select
              {...register("unit")}
              onChange={(event) => {
                const value = event.target.value as FightConditionUnit;
                setUnitValue(value);
                setValue("unit", value);
                if (value === "PERMANENT") {
                  setValue("duration", null);
                } else if (getValues("duration") === null) {
                  setValue("duration", 2);
                }
              }}
            >
              {unitOptions.map((unit) => (
                <MenuItem key={unit} value={unit}>
                  {unit}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              disabled={unitValue === "PERMANENT"}
              fullWidth
              label="Duration"
              type="number"
              {...register("duration", {
                setValueAs: (value) =>
                  value === "" || value === null || value === undefined ? null : Number(value),
              })}
            />
          </Stack>

          <TextField fullWidth label="Color tone" select {...register("tone")}>
            {toneOptions.map((tone) => (
              <MenuItem key={tone} value={tone}>
                {tone}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={() => void handleSubmit(onSubmit)()} variant="contained">
          Add condition
        </Button>
      </DialogActions>
    </Dialog>
  );
}
