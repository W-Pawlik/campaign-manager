import { Grid, TextField } from "@mui/material";
import type { UseFormRegister } from "react-hook-form";

import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";

type CharacterAbilityFieldsProps = {
  register: UseFormRegister<CharacterFormValues>;
};

export function CharacterAbilityFields({ register }: CharacterAbilityFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Armor class"
          type="number"
          {...register("armorClass", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Max HP"
          type="number"
          {...register("maxHitPoints", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Current HP"
          type="number"
          {...register("currentHitPoints", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="STR"
          type="number"
          {...register("strength", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="DEX"
          type="number"
          {...register("dexterity", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="CON"
          type="number"
          {...register("constitution", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="INT"
          type="number"
          {...register("intelligence", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="WIS"
          type="number"
          {...register("wisdom", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="CHA"
          type="number"
          {...register("charisma", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
    </Grid>
  );
}
