import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import type { FightCombatant } from "@/features/fight-tracker/model/fightTracker.types";
import { FightTrackerSpotlightCard } from "@/features/fight-tracker/ui/FightTrackerSpotlightCard";

type FightTrackerCombatantDialogProps = {
  combatant: FightCombatant | null;
  onClose: () => void;
  open: boolean;
};

export function FightTrackerCombatantDialog({
  combatant,
  onClose,
  open,
}: FightTrackerCombatantDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>Combatant details</DialogTitle>
      <DialogContent dividers>
        <FightTrackerSpotlightCard combatant={combatant} />
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
