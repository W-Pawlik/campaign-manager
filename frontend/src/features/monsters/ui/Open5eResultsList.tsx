import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { Open5eSearchResult } from "@/features/monsters/model/monster.types";
import { EmptyState } from "@/shared/components";

type Open5eResultsListProps = {
  onImport?: (result: Open5eSearchResult) => void;
  onOpenDetails: (result: Open5eSearchResult) => void;
  results: Open5eSearchResult[];
};

export function Open5eResultsList({ onImport, onOpenDetails, results }: Open5eResultsListProps) {
  if (results.length === 0) {
    return (
      <EmptyState
        description="Search Open5e creatures to inspect their statblocks and import snapshots into your campaigns."
        title="No search results yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {results.map((result) => (
        <Paper key={`${result.resourceType}-${result.key}`} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{result.name}</Typography>
                <Typography color="text.secondary">
                  {result.summary ?? result.sourceDocumentName ?? "Open5e creature record"}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={result.resourceType} size="small" variant="outlined" />
                {result.metadata?.challengeRating ? (
                  <Chip label={`CR ${String(result.metadata.challengeRating)}`} size="small" />
                ) : null}
              </Stack>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(result)} variant="outlined">
                View details
              </Button>
              {onImport ? (
                <Button onClick={() => onImport(result)} variant="contained">
                  Import to campaign
                </Button>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
