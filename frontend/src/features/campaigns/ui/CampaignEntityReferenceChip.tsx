import { Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import { appPaths } from "@/app/router/paths";

type CampaignEntityReferenceChipProps = {
  campaignId?: string;
  entityId: string | null;
  entityType: string | null;
  label: string | null;
};

export function CampaignEntityReferenceChip({
  campaignId,
  entityId,
  entityType,
  label,
}: CampaignEntityReferenceChipProps) {
  if (!entityType || !entityId) {
    return null;
  }

  const href =
    !campaignId
      ? null
      : entityType === "CAMPAIGN"
        ? appPaths.campaign(campaignId)
        : entityType === "SESSION"
          ? appPaths.campaignSessions(campaignId)
          : entityType === "CHARACTER"
            ? appPaths.campaignCharacters(campaignId)
            : entityType === "NPC"
              ? appPaths.campaignNpcs(campaignId)
              : entityType === "QUEST"
                ? appPaths.campaignQuests(campaignId)
                : entityType === "LOCATION"
                  ? appPaths.campaignLocations(campaignId)
                  : entityType === "ITEM"
                    ? appPaths.campaignInventory(campaignId)
                    : entityType === "CHRONICLE_ENTRY"
                      ? appPaths.campaignChronicle(campaignId)
                      : null;

  if (href) {
    return (
      <Chip
        clickable
        component={RouterLink}
        label={`${entityType.replace("_", " ")}: ${label ?? entityId}`}
        size="small"
        to={href}
        variant="outlined"
      />
    );
  }

  return <Chip label={`${entityType.replace("_", " ")}: ${label ?? entityId}`} size="small" variant="outlined" />;
}
