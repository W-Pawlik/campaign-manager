import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

type FightTrackerDeleteEncounterDialogProps = {
  encounterName: string;
  onClose: () => void;
  onConfirm: () => void;
  open: boolean;
};

export function FightTrackerDeleteEncounterDialog({
  encounterName,
  onClose,
  onConfirm,
  open,
}: FightTrackerDeleteEncounterDialogProps) {
  return (
    <Dialog fullWidth maxWidth="xs" onClose={onClose} open={open}>
      <DialogTitle>Delete encounter</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={1}>
          <Typography variant="body2">
            Delete <strong>{encounterName}</strong>?
          </Typography>
          <Typography color="text.secondary" variant="body2">
            This removes the prepared encounter from the tracker hub. Completed combat history stays available.
          </Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="error" onClick={onConfirm} variant="contained">
          Delete encounter
        </Button>
      </DialogActions>
    </Dialog>
  );
}
