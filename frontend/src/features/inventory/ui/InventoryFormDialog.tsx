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
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import type { InventoryItemDetails } from "@/features/inventory/model/inventory.types";
import {
  inventoryItemRarityOptions,
  inventoryItemTypeOptions,
  inventoryOwnerTypeOptions,
  itemVisibilityOptions,
} from "@/features/inventory/model/inventory.types";
import type { InventoryFormValues } from "@/features/inventory/ui/inventoryForm.types";

const inventoryFormSchema = z.object({
  charges: z.number().min(0).nullable().optional(),
  description: z.string().max(10000).optional(),
  isMagical: z.boolean(),
  isAttuned: z.boolean(),
  isEquipped: z.boolean(),
  isIdentified: z.boolean(),
  maxCharges: z.number().min(0).nullable().optional(),
  name: z.string().trim().min(1, "Item name is required.").max(200),
  ownerId: z.string().trim().min(1, "Select an owner."),
  ownerType: z.enum(["CHARACTER", "CAMPAIGN_PARTY", "NPC", "LOCATION", "QUEST", "SESSION"]),
  quantity: z.number().int().min(0).max(9999),
  rarity: z.union([
    z.enum(["COMMON", "UNCOMMON", "RARE", "VERY_RARE", "LEGENDARY", "ARTIFACT", "UNKNOWN"]),
    z.literal(""),
    z.null(),
  ]),
  type: z.enum(["WEAPON", "ARMOR", "SHIELD", "POTION", "SCROLL", "WONDROUS_ITEM", "TOOL", "GEAR", "TREASURE", "QUEST_ITEM", "CONSUMABLE", "OTHER"]),
  valueAmount: z.number().min(0).nullable().optional(),
  valueCurrency: z.string().max(16).optional(),
  visibility: z.enum(["PUBLIC", "OWNER_ONLY", "GM_ONLY"]),
  weight: z.number().min(0).nullable().optional(),
});

type OwnerOption = {
  id: string;
  label: string;
};

type InventoryFormDialogProps = {
  availableOwnerTypes: Array<InventoryFormValues["ownerType"]>;
  getOwnerOptions: (ownerType: InventoryFormValues["ownerType"]) => OwnerOption[];
  initialItem?: InventoryItemDetails | null;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: (values: InventoryFormValues) => Promise<void>;
  open: boolean;
};

function toOptionalNumber(value?: number | null): number | null | undefined {
  return value ?? null;
}

export function InventoryFormDialog({
  availableOwnerTypes,
  getOwnerOptions,
  initialItem,
  isSubmitting,
  onClose,
  onSubmit,
  open,
}: InventoryFormDialogProps) {
  const defaultOwnerType = availableOwnerTypes[0] ?? "CHARACTER";
  const { control, getValues, handleSubmit, register, reset, setValue } = useForm<InventoryFormValues>({
    defaultValues: {
      charges: toOptionalNumber(initialItem?.charges),
      description: initialItem?.description ?? "",
      isMagical: initialItem?.isMagical ?? false,
      isAttuned: initialItem?.isAttuned ?? false,
      isEquipped: initialItem?.isEquipped ?? false,
      isIdentified: initialItem?.isIdentified ?? true,
      maxCharges: toOptionalNumber(initialItem?.maxCharges),
      name: initialItem?.name ?? "",
      ownerId: initialItem?.ownerId ?? "",
      ownerType: (initialItem?.ownerType as InventoryFormValues["ownerType"] | undefined) ?? defaultOwnerType,
      quantity: initialItem?.quantity ?? 1,
      rarity: (initialItem?.rarity as InventoryFormValues["rarity"] | undefined) ?? null,
      type: (initialItem?.type as InventoryFormValues["type"] | undefined) ?? "OTHER",
      valueAmount: initialItem?.valueAmount ?? null,
      valueCurrency: initialItem?.valueCurrency ?? "",
      visibility: (initialItem?.visibility as InventoryFormValues["visibility"] | undefined) ?? "PUBLIC",
      weight: initialItem?.weight ?? null,
    },
    resolver: zodResolver(inventoryFormSchema),
  });

  const ownerType = useWatch({ control, name: "ownerType" }) ?? defaultOwnerType;
  const ownerOptions = getOwnerOptions(ownerType);

  useEffect(() => {
    reset({
      charges: toOptionalNumber(initialItem?.charges),
      description: initialItem?.description ?? "",
      isMagical: initialItem?.isMagical ?? false,
      isAttuned: initialItem?.isAttuned ?? false,
      isEquipped: initialItem?.isEquipped ?? false,
      isIdentified: initialItem?.isIdentified ?? true,
      maxCharges: toOptionalNumber(initialItem?.maxCharges),
      name: initialItem?.name ?? "",
      ownerId: initialItem?.ownerId ?? "",
      ownerType: (initialItem?.ownerType as InventoryFormValues["ownerType"] | undefined) ?? defaultOwnerType,
      quantity: initialItem?.quantity ?? 1,
      rarity: (initialItem?.rarity as InventoryFormValues["rarity"] | undefined) ?? null,
      type: (initialItem?.type as InventoryFormValues["type"] | undefined) ?? "OTHER",
      valueAmount: initialItem?.valueAmount ?? null,
      valueCurrency: initialItem?.valueCurrency ?? "",
      visibility: (initialItem?.visibility as InventoryFormValues["visibility"] | undefined) ?? "PUBLIC",
      weight: initialItem?.weight ?? null,
    });
  }, [defaultOwnerType, initialItem, reset]);

  useEffect(() => {
    if (!availableOwnerTypes.includes(ownerType)) {
      setValue("ownerType", defaultOwnerType);
      return;
    }

    const currentOwnerId = getValues("ownerId");
    const hasCurrentOwner = ownerOptions.some((option) => option.id === currentOwnerId);

    if (!hasCurrentOwner) {
      setValue("ownerId", ownerOptions[0]?.id ?? "");
    }
  }, [availableOwnerTypes, defaultOwnerType, getValues, ownerOptions, ownerType, setValue]);

  const handleValidSubmit = handleSubmit(async (values) => {
    await onSubmit(values);
  });

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{initialItem ? "Edit inventory item" : "Create inventory item"}</DialogTitle>
      <DialogContent dividers>
        <Stack component="form" noValidate onSubmit={handleValidSubmit} spacing={2.5}>
          <Typography color="text.secondary">
            Track custom items, party stash entries, and owner-specific equipment inside this campaign.
          </Typography>

          <TextField label="Item name" {...register("name")} />
          <TextField label="Description" minRows={3} multiline {...register("description")} />

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

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField
              label="Quantity"
              type="number"
              {...register("quantity", { setValueAs: (value) => Number(value) })}
            />
            <TextField
              label="Charges"
              type="number"
              {...register("charges", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
            <TextField
              label="Max charges"
              type="number"
              {...register("maxCharges", { setValueAs: (value) => (value === "" ? null : Number(value)) })}
            />
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
            <TextField select label="Owner type" {...register("ownerType")}>
              {inventoryOwnerTypeOptions
                .filter((option) => availableOwnerTypes.includes(option))
                .map((option) => (
                  <MenuItem key={option} value={option}>
                    {option.replace("_", " ")}
                  </MenuItem>
                ))}
            </TextField>
            <TextField select label="Owner" {...register("ownerId")}>
              {ownerOptions.map((option) => (
                <MenuItem key={option.id} value={option.id}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField select label="Visibility" {...register("visibility")}>
              {itemVisibilityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replace("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
            <FormControlLabel control={<Checkbox {...register("isIdentified")} />} label="Identified" />
            <FormControlLabel control={<Checkbox {...register("isAttuned")} />} label="Attuned" />
            <FormControlLabel control={<Checkbox {...register("isEquipped")} />} label="Equipped" />
            <FormControlLabel control={<Checkbox {...register("isMagical")} />} label="Magical" />
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button disabled={isSubmitting} onClick={() => void handleValidSubmit()} variant="contained">
          {isSubmitting ? <CircularProgress color="inherit" size={20} /> : initialItem ? "Save changes" : "Create item"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
