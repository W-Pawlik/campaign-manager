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
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { inventoryOwnerTypeOptions } from "@/features/inventory/model/inventory.types";
import type { InventoryTransferFormValues } from "@/features/inventory/ui/inventoryForm.types";

const inventoryTransferSchema = z.object({
  quantity: z.number().int().min(1).nullable().optional(),
  targetOwnerId: z.string().trim().min(1, "Select a destination owner."),
  targetOwnerType: z.enum(["CHARACTER", "CAMPAIGN_PARTY", "NPC", "LOCATION", "QUEST", "SESSION"]),
});

type OwnerOption = {
  id: string;
  label: string;
};

type InventoryTransferDialogProps = {
  availableOwnerTypes: Array<InventoryTransferFormValues["targetOwnerType"]>;
  getOwnerOptions: (ownerType: InventoryTransferFormValues["targetOwnerType"]) => OwnerOption[];
  isSubmitting: boolean;
  itemName: string | null;
  onClose: () => void;
  onSubmit: (values: InventoryTransferFormValues) => Promise<void>;
  open: boolean;
};

export function InventoryTransferDialog({
  availableOwnerTypes,
  getOwnerOptions,
  isSubmitting,
  itemName,
  onClose,
  onSubmit,
  open,
}: InventoryTransferDialogProps) {
  const defaultOwnerType = availableOwnerTypes[0] ?? "CHARACTER";
  const { control, getValues, handleSubmit, register, reset, setValue } = useForm<InventoryTransferFormValues>({
    defaultValues: {
      quantity: 1,
      targetOwnerId: "",
      targetOwnerType: defaultOwnerType,
    },
    resolver: zodResolver(inventoryTransferSchema),
  });

  const targetOwnerType = useWatch({ control, name: "targetOwnerType" }) ?? defaultOwnerType;
  const ownerOptions = getOwnerOptions(targetOwnerType);

  useEffect(() => {
    reset({
      quantity: 1,
      targetOwnerId: ownerOptions[0]?.id ?? "",
      targetOwnerType: defaultOwnerType,
    });
  }, [defaultOwnerType, ownerOptions, reset]);

  useEffect(() => {
    const targetOwnerId = getValues("targetOwnerId");
    if (!ownerOptions.some((option) => option.id === targetOwnerId)) {
      setValue("targetOwnerId", ownerOptions[0]?.id ?? "");
    }
  }, [getValues, ownerOptions, setValue]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="sm" onClose={onClose} open={open}>
      <DialogTitle>Transfer item</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Move {itemName ?? "this item"} to another owner within the active campaign.
          </Typography>

          <TextField
            label="Quantity to transfer"
            type="number"
            {...register("quantity", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
          />
          <TextField select label="Target owner type" {...register("targetOwnerType")}>
            {inventoryOwnerTypeOptions
              .filter((option) => availableOwnerTypes.includes(option))
              .map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
          </TextField>
          <TextField select label="Target owner" {...register("targetOwnerId")}>
            {ownerOptions.map((option) => (
              <MenuItem key={option.id} value={option.id}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : "Transfer"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
