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

const monsterImportSchema = z.object({
  campaignId: z.string().trim().min(1, "Select a campaign."),
  nameOverride: z.string().max(200).optional(),
});

type MonsterImportDialogProps = {
  campaigns: CampaignListItem[];
  defaultCampaignId?: string | null;
  isSubmitting: boolean;
  monsterName: string | null;
  onClose: () => void;
  onSubmit: (values: { campaignId: string; nameOverride?: string }) => Promise<void>;
  open: boolean;
  sourceLabel?: string;
};

export function MonsterImportDialog({
  campaigns,
  defaultCampaignId,
  isSubmitting,
  monsterName,
  onClose,
  onSubmit,
  open,
  sourceLabel = "catalog",
}: MonsterImportDialogProps) {
  const { handleSubmit, register, reset } = useForm<{ campaignId: string; nameOverride?: string }>({
    defaultValues: {
      campaignId: defaultCampaignId ?? campaigns[0]?.id ?? "",
      nameOverride: "",
    },
    resolver: zodResolver(monsterImportSchema),
  });

  useEffect(() => {
    reset({
      campaignId: defaultCampaignId ?? campaigns[0]?.id ?? "",
      nameOverride: "",
    });
  }, [campaigns, defaultCampaignId, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Add monster to campaign</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Copy {monsterName ?? "this creature"} from the {sourceLabel} into one of your campaign
            bestiaries as a local snapshot.
          </Typography>
          <TextField select label="Campaign" {...register("campaignId")}>
            {campaigns.map((campaign) => (
              <MenuItem key={campaign.id} value={campaign.id}>
                {campaign.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Name override" {...register("nameOverride")} />
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
