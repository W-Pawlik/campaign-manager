import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import type { ChronicleEntryView } from "@/features/chronicle/model/chronicle.types";
import { EmptyState } from "@/shared/components";

type CampaignChronicleListProps = {
  campaignId: string;
  canManageEntries: boolean;
  entries: ChronicleEntryView[];
  highlightedEntryId?: string | null;
  isSubmitting: boolean;
  onKeepLocalConflict: (entryId: string) => void;
  onDeleteEntry: (entryId: string) => void;
  onEditEntry: (entryId: string) => void;
  onOpenDetails: (entryId: string) => void;
  onUseServerConflict: (entryId: string) => void;
};

export function CampaignChronicleList({
  campaignId,
  canManageEntries,
  entries,
  highlightedEntryId = null,
  isSubmitting,
  onKeepLocalConflict,
  onDeleteEntry,
  onEditEntry,
  onOpenDetails,
  onUseServerConflict,
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
        <Paper
          id={`chronicle-entry-${entry.id}`}
          key={entry.id}
          sx={(theme) => ({
            p: 2.25,
            scrollMarginTop: 96,
            transition: theme.transitions.create(["border-color", "box-shadow", "background-color"], {
              duration: theme.transitions.duration.shorter,
            }),
            ...(highlightedEntryId === entry.id
              ? {
                  borderColor: theme.palette.error.main,
                  boxShadow: `0 0 0 1px ${theme.palette.error.main}`,
                  backgroundColor: theme.palette.action.hover,
                }
              : {}),
          })}
          variant="outlined"
        >
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{entry.title}</Typography>
                <Typography color="text.secondary">
                  {entry.content.length > 280 ? `${entry.content.slice(0, 280).trimEnd()}...` : entry.content}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={entry.visibility.replace("_", " ")} size="small" variant="outlined" />
                {entry.offlineMeta?.syncState === "PENDING_CREATE" ? (
                  <Chip color="warning" label="Offline create pending" size="small" variant="outlined" />
                ) : null}
                {entry.offlineMeta?.syncState === "PENDING_UPDATE" ? (
                  <Chip color="warning" label="Offline update pending" size="small" variant="outlined" />
                ) : null}
                {entry.offlineMeta?.syncState === "CONFLICT" ? (
                  <Chip color="error" label="Sync conflict" size="small" variant="outlined" />
                ) : null}
                {entry.inWorldDate ? <Chip label={`In-world: ${entry.inWorldDate}`} size="small" variant="outlined" /> : null}
                {entry.occurredAt ? <Chip label="Occurred at set" size="small" variant="outlined" /> : null}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={entry.sessionId}
                entityType={entry.sessionId ? "SESSION" : null}
                label={references.getReferenceLabel("SESSION", entry.sessionId)}
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(entry.id)} variant="outlined">
                View details
              </Button>
              {entry.offlineMeta?.syncState === "CONFLICT" ? (
                <>
                  <Button color="warning" onClick={() => onKeepLocalConflict(entry.id)} variant="text">
                    Keep local
                  </Button>
                  <Button color="error" onClick={() => onUseServerConflict(entry.id)} variant="text">
                    Use server
                  </Button>
                </>
              ) : null}
              {canManageEntries ? (
                <>
                  <Button onClick={() => onEditEntry(entry.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting || entry.offlineMeta?.syncState === "CONFLICT"}
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
