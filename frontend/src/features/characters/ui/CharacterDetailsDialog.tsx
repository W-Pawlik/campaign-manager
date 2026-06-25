import { Dialog, DialogContent } from "@mui/material";

import type { CampaignCharacterDetails } from "@/features/characters/model/character.types";
import { CharacterRecordSheet } from "@/features/characters/ui/CharacterRecordSheet";

type CharacterDetailsDialogProps = {
  character: CampaignCharacterDetails | null;
  onClose: () => void;
  onEdit?: (() => void) | undefined;
  open: boolean;
};

export function CharacterDetailsDialog({
  character,
  onClose,
  onEdit,
  open,
}: CharacterDetailsDialogProps) {
  return (
    <Dialog
      fullWidth
      maxWidth="xl"
      onClose={onClose}
      open={open}
      slotProps={{
        paper: {
          sx: {
            background: "rgba(7, 9, 12, 0.94)",
            borderRadius: 3,
            overflow: "hidden",
          },
        },
      }}
    >
      <DialogContent sx={{ p: { xs: 1.25, md: 1.75 } }}>
        {character ? (
          <CharacterRecordSheet character={character} onClose={onClose} onEdit={onEdit} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
