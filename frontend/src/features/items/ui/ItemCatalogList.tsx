import { Box, Button, Grid, Stack } from "@mui/material";
import { useEffect, useRef } from "react";

import type { ItemsCatalogTab } from "@/features/items/model/item.types";
import { ItemCatalogCard } from "@/features/items/ui/ItemCatalogCard";
import type { ItemCatalogListEntry } from "@/features/items/ui/itemCatalog.utils";
import { EmptyState } from "@/shared/components";

type ItemCatalogListProps = {
  canAddToCampaign: boolean;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  items: ItemCatalogListEntry[];
  onAddToCampaign: (item: ItemCatalogListEntry) => void;
  onLoadMore: () => void;
  onOpenDetails: (item: ItemCatalogListEntry) => void;
  tab: ItemsCatalogTab;
};

export function ItemCatalogList({
  canAddToCampaign,
  hasNextPage,
  isFetchingNextPage,
  items,
  onAddToCampaign,
  onLoadMore,
  onOpenDetails,
  tab,
}: ItemCatalogListProps) {
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
      { rootMargin: "320px 0px" },
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore]);

  if (items.length === 0) {
    return (
      <EmptyState
        description={
          tab === "community"
            ? "No community items match these filters yet. Try another search or publish one of your own."
            : "Adjust your Open5e filters or search for another item."
        }
        title={tab === "community" ? "No community items found" : "No Open5e items found"}
      />
    );
  }

  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        {items.map((item) => {
          const key = "key" in item ? item.key : item.id;

          return (
            <Grid key={`${tab}-${key}`} size={{ xs: 12, sm: 6, lg: 4 }}>
              <Box sx={{ height: "100%" }}>
                <ItemCatalogCard
                  canAddToCampaign={canAddToCampaign}
                  item={item}
                  onAddToCampaign={onAddToCampaign}
                  onOpenDetails={onOpenDetails}
                  tab={tab}
                />
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {hasNextPage ? (
        <Stack ref={loadMoreRef} spacing={1.25} sx={{ alignItems: "center" }}>
          <Button disabled={isFetchingNextPage} onClick={onLoadMore} sx={{ minWidth: 220 }} variant="outlined">
            {isFetchingNextPage ? "Loading more..." : "Load more items"}
          </Button>
        </Stack>
      ) : null}
    </Stack>
  );
}
