import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, Typography } from "@mui/material";

import { CampaignEntityReferenceChip } from "@/features/campaigns";
import type { InventoryItemDetails } from "@/features/inventory/model/inventory.types";

type InventoryDetailsDialogProps = {
  campaignId: string;
  item: InventoryItemDetails | null;
  onClose: () => void;
  open: boolean;
  ownerLabel: string | null;
};

export function InventoryDetailsDialog({
  campaignId,
  item,
  onClose,
  open,
  ownerLabel,
}: InventoryDetailsDialogProps) {
  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{item?.name ?? "Inventory item details"}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2}>
          <Typography color="text.secondary">{item?.description ?? "No description yet."}</Typography>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
            {item?.ownerType && item?.ownerType !== "CAMPAIGN_PARTY" ? (
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={item.ownerId}
                entityType={item.ownerType}
                label={ownerLabel}
              />
            ) : null}
          </Stack>
          <Typography variant="body2">Quantity: {item?.quantity ?? 0}</Typography>
          <Typography variant="body2">Visibility: {item?.visibility?.replace("_", " ")}</Typography>
          <Typography variant="body2">
            Charges: {item?.charges ?? "N/A"} / {item?.maxCharges ?? "N/A"}
          </Typography>
          <Typography variant="body2">Equipped: {item?.isEquipped ? "Yes" : "No"}</Typography>
          <Typography variant="body2">Attuned: {item?.isAttuned ? "Yes" : "No"}</Typography>
          <Typography variant="body2">Identified: {item?.isIdentified ? "Yes" : "No"}</Typography>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
