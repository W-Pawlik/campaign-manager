import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { useCreateCampaignMutation } from "@/features/campaigns/api/campaignsQueries";

const createCampaignSchema = z.object({
  description: z.string().trim().max(5000).optional().or(z.literal("")),
  name: z.string().trim().min(3, "Campaign name must contain at least 3 characters."),
  visibility: z.enum(["PRIVATE", "INVITE_ONLY", "PUBLIC_READ_ONLY"]),
  worldName: z.string().trim().max(120).optional().or(z.literal("")),
});

type CreateCampaignFormValues = z.infer<typeof createCampaignSchema>;

type CreateCampaignDialogProps = {
  onCampaignCreated?: (campaignId: string) => void;
  onClose: () => void;
  open: boolean;
};

export function CreateCampaignDialog({
  onCampaignCreated,
  onClose,
  open,
}: CreateCampaignDialogProps) {
  const createCampaignMutation = useCreateCampaignMutation();

  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CreateCampaignFormValues>({
    defaultValues: {
      description: "",
      name: "",
      visibility: "PRIVATE",
      worldName: "",
    },
    resolver: zodResolver(createCampaignSchema),
  });

  const onSubmit = handleSubmit(async (values) => {
    const campaign = await createCampaignMutation.mutateAsync({
      description: values.description || null,
      name: values.name,
      visibility: values.visibility,
      worldName: values.worldName || null,
    });

    reset();
    onClose();
    onCampaignCreated?.(campaign.id);
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Create campaign</DialogTitle>
      <DialogContent>
        <Stack component="form" noValidate onSubmit={onSubmit} spacing={2.5} sx={{ pt: 1 }}>
          <TextField
            autoFocus
            error={Boolean(errors.name)}
            helperText={errors.name?.message}
            label="Campaign name"
            {...register("name")}
          />
          <TextField
            error={Boolean(errors.description)}
            helperText={errors.description?.message}
            label="Description"
            minRows={3}
            multiline
            {...register("description")}
          />
          <TextField
            error={Boolean(errors.worldName)}
            helperText={errors.worldName?.message}
            label="World name"
            {...register("worldName")}
          />
          <TextField
            defaultValue="PRIVATE"
            label="Visibility"
            select
            {...register("visibility")}
          >
            <MenuItem value="PRIVATE">Private</MenuItem>
            <MenuItem value="INVITE_ONLY">Invite only</MenuItem>
            <MenuItem value="PUBLIC_READ_ONLY">Public read only</MenuItem>
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} variant="text">
          Cancel
        </Button>
        <Button
          disabled={createCampaignMutation.isPending}
          onClick={() => void onSubmit()}
          variant="contained"
        >
          Create campaign
        </Button>
      </DialogActions>
    </Dialog>
  );
}
