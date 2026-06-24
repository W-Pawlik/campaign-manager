import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Stack, Typography } from "@mui/material";

import type { CampaignMonsterDetails } from "@/features/monsters/model/monster.types";

type MonsterDetailsDialogProps = {
  monster: CampaignMonsterDetails | null;
  onClose: () => void;
  open: boolean;
};

function renderJson(value: unknown): string {
  if (value === null || value === undefined) {
    return "None";
  }

  return JSON.stringify(value, null, 2);
}

export function MonsterDetailsDialog({ monster, onClose, open }: MonsterDetailsDialogProps) {
  return (
    <Dialog fullWidth maxWidth="lg" onClose={onClose} open={open}>
      <DialogTitle>{monster?.name ?? "Monster details"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2.5}>
          <Typography color="text.secondary">{monster?.description ?? "No description yet."}</Typography>
          <Grid container spacing={2}>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">AC</Typography>
              <Typography>{monster?.armorClass ?? "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">HP</Typography>
              <Typography>{monster?.hitPoints ?? "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">CR</Typography>
              <Typography>{monster?.challengeRating ?? "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">Type</Typography>
              <Typography>{monster?.type ?? "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">Size</Typography>
              <Typography>{monster?.size ?? "N/A"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, md: 2 }}>
              <Typography variant="body2">Visibility</Typography>
              <Typography>{monster?.visibility.replace("_", " ") ?? "N/A"}</Typography>
            </Grid>
          </Grid>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Abilities</Typography>
            <Typography variant="body2">
              STR {monster?.abilities.strength ?? "N/A"} · DEX {monster?.abilities.dexterity ?? "N/A"} · CON {monster?.abilities.constitution ?? "N/A"} · INT {monster?.abilities.intelligence ?? "N/A"} · WIS {monster?.abilities.wisdom ?? "N/A"} · CHA {monster?.abilities.charisma ?? "N/A"}
            </Typography>
          </Stack>
          <Stack spacing={1}>
            <Typography variant="subtitle1">Actions snapshot</Typography>
            <Typography
              component="pre"
              sx={{ bgcolor: "background.default", borderRadius: 2, overflowX: "auto", p: 2, whiteSpace: "pre-wrap" }}
              variant="body2"
            >
              {renderJson(monster?.actions)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
