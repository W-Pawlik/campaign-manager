import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignNote } from "@/features/campaigns";
import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignNotesListProps = {
  campaignId: string;
  isSubmitting: boolean;
  notes: CampaignNote[];
  onDeleteNote: (noteId: string) => void;
  onEditNote: (noteId: string) => void;
  onOpenDetails: (noteId: string) => void;
};

export function CampaignNotesList({
  campaignId,
  isSubmitting,
  notes,
  onDeleteNote,
  onEditNote,
  onOpenDetails,
}: CampaignNotesListProps) {
  const references = useCampaignReferenceIndex(
    campaignId,
    ["CAMPAIGN", "SESSION", "CHARACTER", "NPC", "QUEST", "LOCATION", "CHRONICLE_ENTRY"],
  );

  if (notes.length === 0) {
    return (
      <EmptyState
        description="Write player-facing notes, GM secrets, lore snippets, and linked reminders."
        title="No notes yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {notes.map((note) => (
        <Paper key={note.id} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{note.title ?? "Untitled note"}</Typography>
                <Typography color="text.secondary">{note.content}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={note.visibility.replace("_", " ")} size="small" variant="outlined" />
                <Chip label={note.category.replace("_", " ")} size="small" />
                {note.isPinned ? <Chip color="primary" label="Pinned" size="small" /> : null}
              </Stack>
            </Stack>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={note.relatedEntityId}
                entityType={note.relatedEntityType}
                label={references.getReferenceLabel(note.relatedEntityType as never, note.relatedEntityId)}
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(note.id)} variant="outlined">
                View details
              </Button>
              <Button onClick={() => onEditNote(note.id)} variant="text">
                Edit
              </Button>
              <Button
                color="error"
                disabled={isSubmitting}
                onClick={() => onDeleteNote(note.id)}
                variant="outlined"
              >
                Delete
              </Button>
            </Stack>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
