import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignQuestListItem } from "@/features/campaigns";
import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignQuestsListProps = {
  campaignId: string;
  canManageQuests: boolean;
  isSubmitting: boolean;
  onDeleteQuest: (questId: string) => void;
  onEditQuest: (questId: string) => void;
  onOpenDetails: (questId: string) => void;
  quests: CampaignQuestListItem[];
};

export function CampaignQuestsList({
  campaignId,
  canManageQuests,
  isSubmitting,
  onDeleteQuest,
  onEditQuest,
  onOpenDetails,
  quests,
}: CampaignQuestsListProps) {
  const references = useCampaignReferenceIndex(campaignId, ["NPC", "LOCATION"]);

  if (quests.length === 0) {
    return (
      <EmptyState
        description="Track main arcs, side missions, and personal hooks in one place."
        title="No quests yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {quests.map((quest) => (
        <Paper key={quest.id} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              spacing={1.5}
              sx={{ justifyContent: "space-between" }}
            >
              <Stack spacing={0.5}>
                <Typography variant="h6">{quest.title}</Typography>
                <Typography color="text.secondary">{quest.description ?? "No description yet."}</Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={quest.status.replace("_", " ")} size="small" />
                <Chip label={quest.type.replace("_", " ")} size="small" variant="outlined" />
                <Chip label={quest.priority} size="small" variant="outlined" />
              </Stack>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={quest.giverNpcId}
                entityType={quest.giverNpcId ? "NPC" : null}
                label={references.getReferenceLabel("NPC", quest.giverNpcId)}
              />
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={quest.relatedLocationId}
                entityType={quest.relatedLocationId ? "LOCATION" : null}
                label={references.getReferenceLabel("LOCATION", quest.relatedLocationId)}
              />
            </Stack>

            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(quest.id)} variant="outlined">
                View details
              </Button>
              {canManageQuests ? (
                <>
                  <Button onClick={() => onEditQuest(quest.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onDeleteQuest(quest.id)}
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
