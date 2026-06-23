import { Grid, TextField } from "@mui/material";
import type { UseFormRegister } from "react-hook-form";

import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";

type CharacterNarrativeFieldsProps = {
  register: UseFormRegister<CharacterFormValues>;
};

export function CharacterNarrativeFields({ register }: CharacterNarrativeFieldsProps) {
  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Backstory" minRows={4} multiline {...register("backstory")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Appearance" minRows={4} multiline {...register("appearance")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField
          fullWidth
          label="Personality traits"
          minRows={3}
          multiline
          {...register("personalityTraits")}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Ideals" minRows={3} multiline {...register("ideals")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Bonds" minRows={3} multiline {...register("bonds")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Flaws" minRows={3} multiline {...register("flaws")} />
      </Grid>
    </Grid>
  );
}
