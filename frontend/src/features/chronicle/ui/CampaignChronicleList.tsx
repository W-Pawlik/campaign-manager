import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignChronicleEntry } from "@/features/campaigns";
import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignChronicleListProps = {
  campaignId: string;
  canManageEntries: boolean;
  entries: CampaignChronicleEntry[];
  isSubmitting: boolean;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entryId: string) => void;
  onOpenDetails: (entryId: string) => void;
};

export function CampaignChronicleList({
  campaignId,
  canManageEntries,
  entries,
  isSubmitting,
  onDeleteEntry,
  onEditEntry,
  onOpenDetails,
}: CampaignChronicleListProps) {
  const references = useCampaignReferenceIndex(campaignId, ["SESSION"]);

  if (entries.length === 0) {
    return (
      <EmptyState
        description="Record session recaps, milestones, and world events as your campaign grows."
        title="No chronicle entries yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {entries.map((entry) => (
        <Paper key={entry.id} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{entry.title}</Typography>
                <Typography color="text.secondary">{entry.content}</Typography>
              </Stack>
              <Chip label={entry.visibility.replace("_", " ")} size="small" variant="outlined" />
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <CampaignEntityReferenceChip
                entityId={entry.sessionId}
                entityType={entry.sessionId ? "SESSION" : null}
                label={references.getReferenceLabel("SESSION", entry.sessionId)}
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(entry.id)} variant="outlined">
                View details
              </Button>
              {canManageEntries ? (
                <>
                  <Button onClick={() => onEditEntry(entry.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onDeleteEntry(entry.id)}
                    variant="outlined"
                  >
                    Delete
                  </Button>
                </>
              ) : null}
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
