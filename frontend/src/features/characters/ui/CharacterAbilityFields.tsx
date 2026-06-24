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
          placeholder="0-99"
          type="number"
          {...register("armorClass", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Max HP"
          placeholder="0-999"
          type="number"
          {...register("maxHitPoints", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Current HP"
          placeholder="0-999"
          type="number"
          {...register("currentHitPoints", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="STR"
          placeholder="1-30"
          type="number"
          {...register("strength", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="DEX"
          placeholder="1-30"
          type="number"
          {...register("dexterity", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="CON"
          placeholder="1-30"
          type="number"
          {...register("constitution", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="INT"
          placeholder="1-30"
          type="number"
          {...register("intelligence", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="WIS"
          placeholder="1-30"
          type="number"
          {...register("wisdom", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 2 }}>
        <TextField
          fullWidth
          label="CHA"
          placeholder="1-30"
          type="number"
          {...register("charisma", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
    </Grid>
  );
}
