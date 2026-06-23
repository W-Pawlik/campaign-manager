import { Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { useMemo } from "react";

import type { CampaignLocationListItem } from "@/features/campaigns";
import { EmptyState } from "@/shared/components";

type CampaignLocationsListProps = {
  canManageLocations: boolean;
  isSubmitting: boolean;
  locations: CampaignLocationListItem[];
  onDeleteLocation: (locationId: string) => void;
  onEditLocation: (locationId: string) => void;
  onOpenDetails: (locationId: string) => void;
};

type TreeNode = CampaignLocationListItem & { depth: number };

function buildLocationTree(locations: CampaignLocationListItem[]): TreeNode[] {
  const byParent = new Map<string | null, CampaignLocationListItem[]>();

  for (const location of locations) {
    const siblings = byParent.get(location.parentLocationId) ?? [];
    siblings.push(location);
    byParent.set(location.parentLocationId, siblings);
  }

  const walk = (parentId: string | null, depth: number): TreeNode[] => {
    const children = byParent.get(parentId) ?? [];

    return children
      .slice()
      .sort((left, right) => left.name.localeCompare(right.name))
      .flatMap((child) => [{ ...child, depth }, ...walk(child.id, depth + 1)]);
  };

  return walk(null, 0);
}

export function CampaignLocationsList({
  canManageLocations,
  isSubmitting,
  locations,
  onDeleteLocation,
  onEditLocation,
  onOpenDetails,
}: CampaignLocationsListProps) {
  const tree = useMemo(() => buildLocationTree(locations), [locations]);

  if (locations.length === 0) {
    return (
      <EmptyState
        description="Build the campaign world hierarchy from continents to rooms and landmarks."
        title="No locations yet"
      />
    );
  }

  return (
    <Stack spacing={1.5}>
      {tree.map((location) => (
        <Paper key={location.id} sx={{ p: 2.25, ml: location.depth * 2 }} variant="outlined">
          <Stack spacing={1.5}>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
              <Stack spacing={0.5}>
                <Typography variant="h6">{location.name}</Typography>
                <Typography color="text.secondary">
                  {location.shortDescription ?? location.description ?? "No description yet."}
                </Typography>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ alignItems: "center", flexWrap: "wrap" }}>
                <Chip label={location.type.replace("_", " ")} size="small" variant="outlined" />
                <Chip label={location.visibility.replace("_", " ")} size="small" />
                <Chip label={location.status.replace("_", " ")} size="small" variant="outlined" />
              </Stack>
            </Stack>
            <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
              <Button onClick={() => onOpenDetails(location.id)} variant="outlined">
                View details
              </Button>
              {canManageLocations ? (
                <>
                  <Button onClick={() => onEditLocation(location.id)} variant="text">
                    Edit
                  </Button>
                  <Button
                    color="error"
                    disabled={isSubmitting}
                    onClick={() => onDeleteLocation(location.id)}
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
