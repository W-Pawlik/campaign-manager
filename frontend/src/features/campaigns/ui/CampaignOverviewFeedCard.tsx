import { Box, Stack, Typography } from "@mui/material";

import {
  CampaignWorkspaceIcon,
  type CampaignWorkspaceIconKey,
} from "@/features/campaigns/ui/CampaignWorkspaceIcon";
import { EmptyState, SectionCard } from "@/shared/components";

type CampaignOverviewFeedCardProps<TItem> = {
  accent?: string;
  items: TItem[];
  emptyDescription: string;
  emptyTitle: string;
  icon: CampaignWorkspaceIconKey;
  title: string;
  renderItem: (item: TItem) => {
    body?: string | null;
    meta?: string | null;
    title: string;
  };
};

export function CampaignOverviewFeedCard<TItem>({
  accent = "#d29956",
  emptyDescription,
  emptyTitle,
  icon,
  items,
  renderItem,
  title,
}: CampaignOverviewFeedCardProps<TItem>) {
  return (
    <SectionCard>
      <Stack direction="row" spacing={1.25} sx={{ alignItems: "center" }}>
        <Box
          sx={{
            alignItems: "center",
            bgcolor: `${accent}1f`,
            border: `1px solid ${accent}40`,
            borderRadius: 2,
            color: accent,
            display: "inline-flex",
            justifyContent: "center",
            p: 0.85,
          }}
        >
          <CampaignWorkspaceIcon icon={icon} size={18} />
        </Box>
        <Typography component="h2" variant="h6">
          {title}
        </Typography>
      </Stack>

      {items.length === 0 ? (
        <EmptyState description={emptyDescription} title={emptyTitle} />
      ) : (
        <Stack spacing={2}>
          {items.map((item, index) => {
            const view = renderItem(item);

            return (
              <Box
                key={index}
                sx={{
                  bgcolor: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: 2.5,
                  p: 1.5,
                }}
              >
                <Stack spacing={0.75}>
                  <Typography variant="subtitle1">{view.title}</Typography>
                  {view.meta ? (
                    <Typography color="text.secondary" variant="caption">
                      {view.meta}
                    </Typography>
                  ) : null}
                  {view.body ? (
                    <Typography
                      color="text.secondary"
                      sx={{
                        display: "-webkit-box",
                        overflow: "hidden",
                        WebkitBoxOrient: "vertical",
                        WebkitLineClamp: 2,
                      }}
                      variant="body2"
                    >
                      {view.body}
                    </Typography>
                  ) : null}
                </Stack>
              </Box>
            );
          })}
        </Stack>
      )}
    </SectionCard>
  );
}
