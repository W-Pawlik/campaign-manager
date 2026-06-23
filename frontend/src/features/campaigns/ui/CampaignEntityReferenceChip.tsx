import { Chip } from "@mui/material";

type CampaignEntityReferenceChipProps = {
  entityId: string | null;
  entityType: string | null;
  label: string | null;
};

export function CampaignEntityReferenceChip({
  entityId,
  entityType,
  label,
}: CampaignEntityReferenceChipProps) {
  if (!entityType || !entityId) {
    return null;
  }

  return (
    <Chip
      label={`${entityType.replace("_", " ")}: ${label ?? entityId}`}
      size="small"
      variant="outlined"
    />
  );
}
