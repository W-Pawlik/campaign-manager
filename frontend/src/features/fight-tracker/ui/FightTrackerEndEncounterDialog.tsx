import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

type FightTrackerEndEncounterDialogProps = {
  encounterName: string | null;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function FightTrackerEndEncounterDialog({
  encounterName,
  onClose,
  onConfirm,
  open,
}: FightTrackerEndEncounterDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>End combat</DialogTitle>
      <DialogContent dividers>
        <Typography color="text.secondary" variant="body2">
          {encounterName
            ? `Are you sure you want to finish "${encounterName}" and save it to combat history?`
            : "Are you sure you want to finish this combat and save it to combat history?"}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm} variant="contained">
          End combat
        </Button>
      </DialogActions>
    </Dialog>
  );
}
