import {
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";

type CharacterDetailsDialogProps = {
  character: CampaignCharacterDetails | null;
  onClose: () => void;
  open: boolean;
};

export function CharacterDetailsDialog({
  character,
  onClose,
  open,
}: CharacterDetailsDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{character?.name ?? "Character details"}</DialogTitle>
      <DialogContent dividers>
        {character ? (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <Chip label={character.type.replace("_", " ")} size="small" variant="outlined" />
              <Chip label={character.status.replace("_", " ")} size="small" />
            </Stack>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="text.secondary">Owner</Typography>
                <Typography>{character.ownerUserId ?? "Unassigned"}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="text.secondary">Class</Typography>
                <Typography>
                  {character.characterClass ?? "No class"}
                  {character.subclass ? ` · ${character.subclass}` : ""}
                </Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="text.secondary">Race</Typography>
                <Typography>{character.race ?? "Unknown race"}</Typography>
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <Typography color="text.secondary">Background</Typography>
                <Typography>{character.background ?? "Not set"}</Typography>
              </Grid>
            </Grid>

            <Divider />

            <Stack spacing={1}>
              <Typography variant="subtitle1">Core stats</Typography>
              <Grid container spacing={2}>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">STR</Typography>
                  <Typography>{character.strength ?? "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">DEX</Typography>
                  <Typography>{character.dexterity ?? "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">CON</Typography>
                  <Typography>{character.constitution ?? "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">INT</Typography>
                  <Typography>{character.intelligence ?? "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">WIS</Typography>
                  <Typography>{character.wisdom ?? "-"}</Typography>
                </Grid>
                <Grid size={{ xs: 4, md: 2 }}>
                  <Typography color="text.secondary">CHA</Typography>
                  <Typography>{character.charisma ?? "-"}</Typography>
                </Grid>
              </Grid>
            </Stack>

            {character.backstory ? (
              <>
                <Divider />
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">Backstory</Typography>
                  <Typography color="text.secondary">{character.backstory}</Typography>
                </Stack>
              </>
            ) : null}
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
