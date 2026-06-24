import { Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Paper, Stack, Typography } from "@mui/material";

import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import type { CampaignQuestDetails, QuestObjective } from "@/features/quests/model/quest.types";
import { QuestPriorityIndicator } from "@/features/quests/ui/QuestPriorityIndicator";
import { QuestStatusChip } from "@/features/quests/ui/QuestStatusChip";
import { QuestTimeline } from "@/features/quests/ui/QuestTimeline";

type QuestDetailsDialogProps = {
  campaignId: string;
  canManageQuests: boolean;
  isSubmitting: boolean;
  onAddObjective: () => void;
  onClose: () => void;
  onDeleteObjective: (objective: QuestObjective) => void;
  onEditObjective: (objective: QuestObjective) => void;
  open: boolean;
  quest: CampaignQuestDetails | null;
};

export function QuestDetailsDialog({
  campaignId,
  canManageQuests,
  isSubmitting,
  onAddObjective,
  onClose,
  onDeleteObjective,
  onEditObjective,
  open,
  quest,
}: QuestDetailsDialogProps) {
  const entityTypes = (quest?.relations ?? []).map((relation) => relation.entityType as never);
  const references = useCampaignReferenceIndex(campaignId, ["NPC", "LOCATION", ...entityTypes]);

  return (
    <Dialog fullWidth maxWidth="md" onClose={onClose} open={open}>
      <DialogTitle>{quest?.title ?? "Quest details"}</DialogTitle>
      <DialogContent dividers>
        {quest ? (
          <Stack spacing={2.5}>
            <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
              <QuestStatusChip status={quest.status} />
              <Chip label={quest.type.replace("_", " ")} size="small" variant="outlined" />
              <Chip label={quest.visibility.replace("_", " ")} size="small" variant="outlined" />
            </Stack>

            <Typography color="text.secondary">{quest.description ?? "No description yet."}</Typography>

            <QuestPriorityIndicator priority={quest.priority} />

            <QuestTimeline
              completedAt={quest.completedAt}
              failedAt={quest.failedAt}
              startedAt={quest.startedAt}
              status={quest.status}
            />

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

            <Divider />

            <Stack spacing={1.25}>
              <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Typography variant="subtitle1">Objectives</Typography>
                {canManageQuests ? (
                  <Button onClick={onAddObjective} size="small" variant="contained">
                    Add objective
                  </Button>
                ) : null}
              </Stack>
              {quest.objectives.length === 0 ? (
                <Typography color="text.secondary">No objectives yet.</Typography>
              ) : (
                quest.objectives
                  .slice()
                  .sort((left, right) => left.sortOrder - right.sortOrder)
                  .map((objective) => (
                    <Paper key={objective.id} sx={{ p: 1.5 }} variant="outlined">
                      <Stack spacing={1}>
                        <Stack
                          direction={{ xs: "column", md: "row" }}
                          spacing={1}
                          sx={{ justifyContent: "space-between" }}
                        >
                          <Typography variant="body1">{objective.title}</Typography>
                          <QuestStatusChip status={objective.status} />
                        </Stack>
                        <Typography color="text.secondary" variant="body2">
                          {objective.description ?? "No description."}
                        </Typography>
                        {canManageQuests ? (
                          <Stack direction="row" spacing={1}>
                            <Button onClick={() => onEditObjective(objective)} size="small" variant="text">
                              Edit
                            </Button>
                            <Button
                              color="error"
                              disabled={isSubmitting}
                              onClick={() => onDeleteObjective(objective)}
                              size="small"
                              variant="outlined"
                            >
                              Delete
                            </Button>
                          </Stack>
                        ) : null}
                      </Stack>
                    </Paper>
                  ))
              )}
            </Stack>

            {quest.relations.length > 0 ? (
              <>
                <Divider />
                <Stack spacing={1.25}>
                  <Typography variant="subtitle1">Relations</Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                    {quest.relations.map((relation) => (
                      <CampaignEntityReferenceChip
                        campaignId={campaignId}
                        key={relation.id}
                        entityId={relation.entityId}
                        entityType={relation.entityType}
                        label={`${relation.relationType}: ${references.getReferenceLabel(
                          relation.entityType as never,
                          relation.entityId,
                        )}`}
                      />
                    ))}
                  </Stack>
                </Stack>
              </>
            ) : null}

            {"gmNotes" in quest && quest.gmNotes ? (
              <>
                <Divider />
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">GM notes</Typography>
                  <Typography color="text.secondary">{quest.gmNotes}</Typography>
                </Stack>
              </>
            ) : null}
          </Stack>
        ) : null}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}
