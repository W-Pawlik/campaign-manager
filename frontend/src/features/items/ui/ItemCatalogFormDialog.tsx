import { zodResolver } from "@hookform/resolvers/zod";
import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  MenuItem,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import type { ItemTemplateDetails } from "@/features/items/model/item.types";
import {
  inventoryItemRarityOptions,
  inventoryItemTypeOptions,
  type InventoryItemRarity,
  type InventoryItemType,
} from "@/features/inventory";

const itemCatalogFormSchema = z.object({
  description: z.string().max(10000).optional(),
  isMagical: z.boolean(),
  name: z.string().trim().min(1, "Item name is required.").max(200),
  rarity: z.union([
    z.enum(["COMMON", "UNCOMMON", "RARE", "VERY_RARE", "LEGENDARY", "ARTIFACT", "UNKNOWN"]),
    z.literal(""),
    z.null(),
  ]),
  type: z.enum(["WEAPON", "ARMOR", "SHIELD", "POTION", "SCROLL", "WONDROUS_ITEM", "TOOL", "GEAR", "TREASURE", "QUEST_ITEM", "CONSUMABLE", "OTHER"]),
  valueAmount: z.number().min(0).nullable().optional(),
  valueCurrency: z.string().max(16).optional(),
  weight: z.number().min(0).nullable().optional(),
});

export type ItemCatalogFormValues = {
  description?: string;
  isMagical: boolean;
  name: string;
  rarity: InventoryItemRarity | "" | null;
  type: InventoryItemType;
  valueAmount?: number | null;
  valueCurrency?: string;
  weight?: number | null;
};

type ItemCatalogFormDialogProps = {
  initialItem?: ItemTemplateDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: ItemCatalogFormValues) => Promise<void>;
  open: boolean;
};

export function ItemCatalogFormDialog({
  initialItem,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: ItemCatalogFormDialogProps) {
  const { handleSubmit, register, reset } = useForm<ItemCatalogFormValues>({
    defaultValues: {
      description: initialItem?.description ?? "",
      isMagical: initialItem?.isMagical ?? false,
      name: initialItem?.name ?? "",
      rarity: initialItem?.rarity ?? null,
      type: initialItem?.type ?? "OTHER",
      valueAmount: initialItem?.valueAmount ?? null,
      valueCurrency: initialItem?.valueCurrency ?? "",
      weight: initialItem?.weight ?? null,
    },
    resolver: zodResolver(itemCatalogFormSchema),
  });

  useEffect(() => {
    reset({
      description: initialItem?.description ?? "",
      isMagical: initialItem?.isMagical ?? false,
      name: initialItem?.name ?? "",
      rarity: initialItem?.rarity ?? null,
      type: initialItem?.type ?? "OTHER",
      valueAmount: initialItem?.valueAmount ?? null,
      valueCurrency: initialItem?.valueCurrency ?? "",
      weight: initialItem?.weight ?? null,
    });
  }, [initialItem, reset]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialItem ? "Edit published item" : "Publish community item"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Publish reusable community items for the catalog. These entries stay independent from campaign copies.
          </Typography>

          <TextField label="Item name" {...register("name")} />
          <TextField label="Description" minRows={4} multiline {...register("description")} />

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Type" {...register("type")}>
              {inventoryItemTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Rarity" {...register("rarity")}>
              <MenuItem value="">No rarity</MenuItem>
              {inventoryItemRarityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Weight"
              type="number"
              {...register("weight", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Value"
              type="number"
              {...register("valueAmount", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
            <TextField label="Currency" {...register("valueCurrency")} />
          </Stack>

          <FormControlLabel control={<Checkbox {...register("isMagical")} />} label="Magical item" />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialItem ? "Save changes" : "Publish item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
