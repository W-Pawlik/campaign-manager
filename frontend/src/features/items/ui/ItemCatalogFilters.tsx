import { Button, FormControlLabel, MenuItem, Stack, Switch, TextField } from "@mui/material";
import { useState } from "react";

import type { ItemsCatalogTab } from "@/features/items/model/item.types";
import {
  inventoryItemRarityOptions,
  inventoryItemTypeOptions,
  type InventoryItemRarity,
  type InventoryItemType,
} from "@/features/inventory";

export type ItemCatalogFiltersValues = {
  documentKey: string;
  isMagicalOnly: boolean;
  ordering: string;
  rarity: InventoryItemRarity | "";
  search: string;
  type: InventoryItemType | "";
};

type ItemCatalogFiltersProps = {
  tab: ItemsCatalogTab;
  values: ItemCatalogFiltersValues;
  onApply: (values: ItemCatalogFiltersValues) => void;
  onReset: () => void;
};

const open5eDocumentOptions = [
  { label: "Any book", value: "" },
  { label: "SRD 2024", value: "srd-2024" },
  { label: "Black Flag SRD", value: "black-flag-srd" },
  { label: "Tome of Heroes", value: "toh" },
];

const orderingOptions = [
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
];

export function ItemCatalogFilters({ onApply, onReset, tab, values }: ItemCatalogFiltersProps) {
  const [draftValues, setDraftValues] = useState(values);

  const isCommunityTab = tab === "community";

  return (
    <Stack
      component="form"
      onSubmit={(event) => {
        event.preventDefault();
        onApply(draftValues);
      }}
      spacing={2}
    >
      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        <TextField
          fullWidth
          label={isCommunityTab ? "Search community items" : "Search Open5e items"}
          onChange={(event) => setDraftValues((current) => ({ ...current, search: event.target.value }))}
          placeholder={isCommunityTab ? "Phoenix ash, moon blade..." : "Acid, healer's kit, wand..."}
          value={draftValues.search}
        />
        {isCommunityTab ? (
          <>
            <TextField
              select
              label="Type"
              onChange={(event) =>
                setDraftValues((current) => ({ ...current, type: event.target.value as InventoryItemType | "" }))
              }
              sx={{ minWidth: { lg: 220 } }}
              value={draftValues.type}
            >
              <MenuItem value="">Any type</MenuItem>
              {inventoryItemTypeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Rarity"
              onChange={(event) =>
                setDraftValues((current) => ({
                  ...current,
                  rarity: event.target.value as InventoryItemRarity | "",
                }))
              }
              sx={{ minWidth: { lg: 220 } }}
              value={draftValues.rarity}
            >
              <MenuItem value="">Any rarity</MenuItem>
              {inventoryItemRarityOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option.replaceAll("_", " ")}
                </MenuItem>
              ))}
            </TextField>
          </>
        ) : (
          <>
            <TextField
              select
              label="Source book"
              onChange={(event) => setDraftValues((current) => ({ ...current, documentKey: event.target.value }))}
              sx={{ minWidth: { lg: 220 } }}
              value={draftValues.documentKey}
            >
              {open5eDocumentOptions.map((option) => (
                <MenuItem key={option.value || "all"} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              label="Sort"
              onChange={(event) => setDraftValues((current) => ({ ...current, ordering: event.target.value }))}
              sx={{ minWidth: { lg: 220 } }}
              value={draftValues.ordering}
            >
              {orderingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
        )}
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2} sx={{ alignItems: { lg: "center" } }}>
        {isCommunityTab ? (
          <FormControlLabel
            control={
              <Switch
                checked={draftValues.isMagicalOnly}
                onChange={(_event, checked) =>
                  setDraftValues((current) => ({ ...current, isMagicalOnly: checked }))
                }
              />
            }
            label="Show only magical community items"
            sx={{ m: 0 }}
          />
        ) : null}
        <Stack direction="row" spacing={1.5} sx={{ ml: { lg: "auto" } }}>
          <Button onClick={onReset} variant="text">
            Reset
          </Button>
          <Button type="submit" variant="contained">
            Apply filters
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
}
