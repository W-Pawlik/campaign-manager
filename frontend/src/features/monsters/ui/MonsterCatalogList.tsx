import { Box, Button, Grid, Stack } from "@mui/material";
import { useEffect, useRef } from "react";

import { MonsterCatalogCard } from "@/features/monsters/ui/MonsterCatalogCard";
import type { MonsterCatalogSource } from "@/features/monsters/ui/MonsterCatalogSourceTabs";
import { type MonsterCatalogListEntry } from "@/features/monsters/ui/monsterCatalog.utils";
import { EmptyState } from "@/shared/components";

type MonsterCatalogListProps = {
  canAddToCampaign: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  items: MonsterCatalogListEntry[];
  onAddToCampaign: (item: MonsterCatalogListEntry) => void;
  onLoadMore: () => void;
  onOpenDetails: (item: MonsterCatalogListEntry) => void;
  source: MonsterCatalogSource;
};

export function MonsterCatalogList({
  canAddToCampaign,
  hasNextPage,
  isFetchingNextPage,
  items,
  onAddToCampaign,
  onLoadMore,
  onOpenDetails,
  source,
}: MonsterCatalogListProps) {
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = loadMoreRef.current;

    if (!node || !hasNextPage || isFetchingNextPage) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onLoadMore();
        }
      },
      {
        rootMargin: "320px 0px",
      },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (items.length === 0) {
    return (
      <EmptyState
        description={
          source === "open5e"
            ? "Adjust your Open5e filters or search for another creature."
            : "No public monsters match these filters yet. Try another search or publish one of your own."
        }
        title={source === "open5e" ? "No Open5e creatures found" : "No community monsters found"}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {items.map((item) => {
          const key = "key" in item ? item.key : item.id;

          return (
            <Grid key={`${source}-${key}`} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box sx={{ height: "100%" }}>
                <MonsterCatalogCard
                  canAddToCampaign={canAddToCampaign}
                  item={item}
                  onAddToCampaign={onAddToCampaign}
                  onOpenDetails={onOpenDetails}
                  source={source}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {hasNextPage ? (
        <Stack ref={loadMoreRef} spacing={1.25} sx={{ alignItems: "center" }}>
          <Button disabled={isFetchingNextPage} onClick={onLoadMore} sx={{ minWidth: 220 }} variant="outlined">
            {isFetchingNextPage ? "Loading more..." : "Load more monsters"}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
