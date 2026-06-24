import {
  Alert,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

import type { ItemTemplateDetails, Open5eItemDetails } from "@/features/items/model/item.types";
import {
  formatLabel,
  getIsMagical,
  getItemDescription,
  getItemRarityLabel,
  getItemSourceLabel,
  getItemTypeLabel,
  getItemValueLabel,
  getItemWeight,
  isOpen5eItemDetails,
} from "@/features/items/ui/itemCatalog.utils";

type ItemCatalogDetailsDialogProps = {
  canEdit: boolean;
  errorMessage?: string | null;
  isLoading?: boolean;
  item: ItemTemplateDetails | Open5eItemDetails | null;
  onAddToCampaign?: () => void;
  onClose: () => void;
  onEdit?: () => void;
  open: boolean;
};

export function ItemCatalogDetailsDialog({
  canEdit,
  errorMessage,
  isLoading = false,
  item,
  onAddToCampaign,
  onClose,
  onEdit,
  open,
}: ItemCatalogDetailsDialogProps) {
  const isOpen5eItem = item !== null && isOpen5eItemDetails(item);
  const typeLabel = formatLabel(item ? getItemTypeLabel(item) : null);
  const rarityLabel = formatLabel(item ? getItemRarityLabel(item) : null);
  const weight = item ? getItemWeight(item) : null;
  const valueLabel = item ? getItemValueLabel(item) : null;
  const sourceLabel = item ? getItemSourceLabel(item) : null;
  const description = item ? getItemDescription(item) : null;
  const magical = item ? getIsMagical(item) : false;

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{item?.name ?? "Item details"}</DialogTitle>
      <DialogContent dividers>
        {isLoading ? (
          <Stack sx={{ alignItems: "center", minHeight: 180, justifyContent: "center" }} spacing={2}>
            <CircularProgress size={28} />
            <Typography color="text.secondary">Loading item details...</Typography>
          </Stack>
        ) : errorMessage ? (
          <Alert severity="error">{errorMessage}</Alert>
        ) : (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              {typeLabel ? <Chip label={typeLabel} size="small" variant="outlined" /> : null}
              {rarityLabel ? <Chip label={rarityLabel} size="small" variant="outlined" /> : null}
              {magical ? <Chip color="primary" label="Magical" size="small" /> : null}
              {weight !== null ? <Chip label={`${weight} lb`} size="small" variant="outlined" /> : null}
              {valueLabel ? <Chip label={valueLabel} size="small" variant="outlined" /> : null}
              {isOpen5eItem && item.normalizedData?.requiresAttunement ? (
                <Chip label="Requires attunement" size="small" variant="outlined" />
              ) : null}
            </Stack>

            <Typography color="text.secondary">
              {description ?? "No description is available for this item yet."}
            </Typography>

            {sourceLabel ? (
              <Typography variant="body2">
                <strong>Source:</strong> {sourceLabel}
              </Typography>
            ) : null}

            {isOpen5eItem && item.normalizedData?.attunementDetail ? (
              <Typography variant="body2">
                <strong>Attunement:</strong> {item.normalizedData.attunementDetail}
              </Typography>
            ) : null}
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        {canEdit && onEdit ? <Button onClick={onEdit}>Edit item</Button> : null}
        {onAddToCampaign ? <Button onClick={onAddToCampaign} variant="contained">Add to campaign</Button> : null}
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
