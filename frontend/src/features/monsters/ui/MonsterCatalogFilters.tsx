import { Button, MenuItem, Stack, TextField } from "@mui/material";
import { useState } from "react";

import type { MonsterCatalogSource } from "@/features/monsters/ui/MonsterCatalogSourceTabs";

type MonsterCatalogFiltersValues = {
  documentKey: string;
  maxCr: string;
  minCr: string;
  ordering: string;
  search: string;
  type: string;
};

type MonsterCatalogFiltersProps = {
  source: MonsterCatalogSource;
  values: MonsterCatalogFiltersValues;
  onApply: (values: MonsterCatalogFiltersValues) => void;
  onReset: () => void;
};

const open5eDocumentOptions = [
  { label: "Any book", value: "" },
  { label: "SRD 2024", value: "srd-2024" },
  { label: "Monstrous Menagerie", value: "a5e-mm" },
  { label: "Tome of Beasts 3", value: "tob3" },
  { label: "Creature Codex", value: "ccdx" },
];

const open5eOrderingOptions = [
  { label: "Name A-Z", value: "name" },
  { label: "Name Z-A", value: "-name" },
  { label: "CR low-high", value: "challenge_rating" },
  { label: "CR high-low", value: "-challenge_rating" },
];

export function MonsterCatalogFilters({
  source,
  values,
  onApply,
  onReset,
}: MonsterCatalogFiltersProps) {
  const [draftValues, setDraftValues] = useState(values);

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
          label={source === "open5e" ? "Search Open5e creatures" : "Search community monsters"}
          onChange={(event) =>
            setDraftValues((current) => ({ ...current, search: event.target.value }))
          }
          placeholder={source === "open5e" ? "Goblin, dragon, lich..." : "Bog wisp, bone wolf..."}
          value={draftValues.search}
        />
        <TextField
          label="Type"
          onChange={(event) =>
            setDraftValues((current) => ({ ...current, type: event.target.value }))
          }
          placeholder="Humanoid, dragon..."
          value={draftValues.type}
        />
        <TextField
          label="Min CR"
          onChange={(event) =>
            setDraftValues((current) => ({ ...current, minCr: event.target.value }))
          }
          placeholder="0.25"
          type="number"
          value={draftValues.minCr}
        />
        <TextField
          label="Max CR"
          onChange={(event) =>
            setDraftValues((current) => ({ ...current, maxCr: event.target.value }))
          }
          placeholder="10"
          type="number"
          value={draftValues.maxCr}
        />
      </Stack>

      <Stack direction={{ xs: "column", lg: "row" }} spacing={2}>
        {source === "open5e" ? (
          <>
            <TextField
              select
              label="Source book"
              onChange={(event) =>
                setDraftValues((current) => ({ ...current, documentKey: event.target.value }))
              }
              sx={{ minWidth: { lg: 240 } }}
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
              onChange={(event) =>
                setDraftValues((current) => ({ ...current, ordering: event.target.value }))
              }
              sx={{ minWidth: { lg: 220 } }}
              value={draftValues.ordering}
            >
              {open5eOrderingOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          </>
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
