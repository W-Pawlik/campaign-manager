import { Grid, MenuItem, TextField } from "@mui/material";
import type { UseFormRegister } from "react-hook-form";

import {
  characterStatusOptions,
  characterTypeOptions,
} from "@/features/characters/model/character.types";
import type { CharacterFormValues } from "@/features/characters/ui/characterForm.types";
import type { UserLookupItem } from "@/features/users";
import { UserLookupAutocomplete } from "@/features/users";

type CharacterIdentityFieldsProps = {
  canAssignOwner: boolean;
  ownerErrorMessage?: string;
  ownerOption: UserLookupItem | null;
  onOwnerChange: (value: UserLookupItem | null) => void;
  register: UseFormRegister<CharacterFormValues>;
};

export function CharacterIdentityFields({
  canAssignOwner,
  ownerErrorMessage,
  ownerOption,
  onOwnerChange,
  register,
}: CharacterIdentityFieldsProps) {
  return (
    <Grid container spacing={2}>
      {canAssignOwner ? (
        <Grid size={{ xs: 12, md: 6 }}>
          <UserLookupAutocomplete
            error={Boolean(ownerErrorMessage)}
            helperText={ownerErrorMessage ?? "Search by username or display name."}
            label="Owner"
            onChange={onOwnerChange}
            placeholder="Search for a player"
            value={ownerOption}
          />
        </Grid>
      ) : null}
      <Grid size={{ xs: 12, md: canAssignOwner ? 6 : 12 }}>
        <TextField fullWidth label="Name" {...register("name")} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <TextField fullWidth label="Avatar URL" {...register("avatarUrl")} />
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField fullWidth label="Type" select {...register("type")}>
          {characterTypeOptions.map((type) => (
            <MenuItem key={type} value={type}>
              {type.replace("_", " ")}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 3 }}>
        <TextField fullWidth label="Status" select {...register("status")}>
          {characterStatusOptions.map((status) => (
            <MenuItem key={status} value={status}>
              {status.replace("_", " ")}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Race" {...register("race")} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Class" {...register("characterClass")} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Subclass" {...register("subclass")} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField
          fullWidth
          label="Level"
          type="number"
          {...register("level", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Background" {...register("background")} />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <TextField fullWidth label="Alignment" {...register("alignment")} />
      </Grid>
    </Grid>
  );
}
