import { Stack, Typography } from "@mui/material";

import { EmptyState, SectionCard } from "@/shared/components";

type CampaignOverviewFeedCardProps<TItem> = {
  items: TItem[];
  emptyDescription: string;
  emptyTitle: string;
  title: string;
  renderItem: (item: TItem) => {
    body?: string | null;
    meta?: string | null;
    title: string;
  };
};

export function CampaignOverviewFeedCard<TItem>({
  emptyDescription,
  emptyTitle,
  items,
  renderItem,
  title,
}: CampaignOverviewFeedCardProps<TItem>) {
  return (
    <SectionCard title={title}>
      {items.length === 0 ? (
        <EmptyState description={emptyDescription} title={emptyTitle} />
      ) : (
        <Stack spacing={2}>
          {items.map((item, index) => {
            const view = renderItem(item);

            return (
              <Stack key={index} spacing={0.5}>
                <Typography variant="subtitle1">{view.title}</Typography>
                {view.meta ? (
                  <Typography color="text.secondary" variant="caption">
                    {view.meta}
                  </Typography>
                ) : null}
                {view.body ? (
                  <Typography color="text.secondary" variant="body2">
                    {view.body}
                  </Typography>
                ) : null}
              </Stack>
            );
          })}
        </Stack>
      )}
    </SectionCard>
  );
}
