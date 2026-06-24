import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { CampaignListItem } from "@/features/campaigns";

const importItemSchema = z.object({
  campaignId: z.string().trim().min(1, "Select a campaign."),
  nameOverride: z.string().max(200).optional(),
  quantity: z.number().int().min(1).max(9999),
});

export type ItemCatalogImportValues = {
  campaignId: string;
  nameOverride?: string;
  quantity: number;
};

type ItemCatalogImportDialogProps = {
  campaigns: CampaignListItem[];
  defaultCampaignId: string | null;
  isSubmitting: boolean;
  itemName: string | null;
  onClose: () => void;
  onSubmit: (values: ItemCatalogImportValues) => Promise<void>;
  open: boolean;
  sourceLabel?: string;
};

export function ItemCatalogImportDialog({
  campaigns,
  defaultCampaignId,
  isSubmitting,
  itemName,
  onClose,
  onSubmit,
  open,
  sourceLabel,
}: ItemCatalogImportDialogProps) {
  const { handleSubmit, register, reset } = useForm<ItemCatalogImportValues>({
    defaultValues: {
      campaignId: defaultCampaignId ?? campaigns[0]?.id ?? "",
      nameOverride: "",
      quantity: 1,
    },
    resolver: zodResolver(importItemSchema),
  });

  useEffect(() => {
    reset({
      campaignId: defaultCampaignId ?? campaigns[0]?.id ?? "",
      nameOverride: "",
      quantity: 1,
    });
  }, [campaigns, defaultCampaignId, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Add item to campaign</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Add {itemName ?? "this item"} from {sourceLabel ?? "the catalog"} to a campaign. It will land in the party stash first, so you can reassign it inside the campaign items screen.
          </Typography>

          <TextField select label="Campaign" {...register("campaignId")}>
            {campaigns.map((campaign) => (
              <MenuItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Quantity"
            type="number"
            {...register("quantity", { setValueAs: (value) => Number(value) })}
          />
          <TextField label="Name override (optional)" {...register("nameOverride")} />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Add to campaign"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
