import { Button, Chip, Paper, Stack, Typography } from "@mui/material";

import type { CampaignNpcListItem } from "@/features/campaigns";
import { CampaignEntityReferenceChip, useCampaignReferenceIndex } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignNpcsListProps = {
  campaignId: string;
  canManageNpcs: boolean;
  isSubmitting: boolean;
  npcs: CampaignNpcListItem[];
  onDeleteNpc: (npcId: string) => void;
  onEditNpc: (npcId: string) => void;
  onOpenDetails: (npcId: string) => void;
};

export function CampaignNpcsList({
  campaignId,
  canManageNpcs,
  isSubmitting,
  npcs,
  onDeleteNpc,
  onEditNpc,
  onOpenDetails,
}: CampaignNpcsListProps) {
  const references = useCampaignReferenceIndex(campaignId, ["LOCATION"]);

  if (npcs.length === 0) {
    return (
      <EmptyState
        description="Track story actors, their public profile, and their private GM knowledge."
        title="No NPCs yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {npcs.map((npc) => (
        <Paper key={npc.id} sx={{ p: 2.25 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">
                  {npc.name}
                  {npc.title ? `, ${npc.title}` : ""}
                </Typography>
                <Typography color="text.secondary">
                  {npc.occupation ?? "Unknown occupation"}
                  {npc.faction ? ` · ${npc.faction}` : ""}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={npc.attitude} size="small" variant="outlined" />
                <Chip label={npc.importance} size="small" />
                <Chip label={npc.status} size="small" variant="outlined" />
              </Stack>
            </Stack>
            <Typography color="text.secondary">{npc.publicDescription ?? "No public description yet."}</Typography>
            <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
              <CampaignEntityReferenceChip
                campaignId={campaignId}
                entityId={npc.locationId}
                entityType={npc.locationId ? "LOCATION" : null}
                label={references.getReferenceLabel("LOCATION", npc.locationId)}
              />
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(npc.id)} variant="outlined">
                View details
              </Button>
              {canManageNpcs ? (
                <>
                  <Button onClick={() => onEditNpc(npc.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onDeleteNpc(npc.id)}
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
