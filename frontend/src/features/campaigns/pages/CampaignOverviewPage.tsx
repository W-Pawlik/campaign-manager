import { Grid, Stack } from "@mui/material";
import { useMemo } from "react";
import { useParams } from "react-router-dom";

import {
  useCampaignDetailsQuery,
  useCampaignOverviewQueries,
} from "@/features/campaigns/api/campaignsQueries";
import { CampaignOverviewFeedCard } from "@/features/campaigns/ui/CampaignOverviewFeedCard";
import { CampaignOverviewHeader } from "@/features/campaigns/ui/CampaignOverviewHeader";
import { CampaignOverviewStats } from "@/features/campaigns/ui/CampaignOverviewStats";
import { ErrorState, LoadingScreen, SectionCard } from "@/shared/components";

function formatDateTime(value: string | null) {
  if (!value) {
    return "No date scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function CampaignOverviewPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const overviewQueries = useCampaignOverviewQueries(campaignId);

  const upcomingSession = useMemo(() => {
    const sessions = overviewQueries.sessionsQuery.data ?? [];

    return [...sessions]
      .filter((session) => session.status !== "CANCELLED")
      .sort((left, right) => {
        const leftTime = left.scheduledStartAt ? new Date(left.scheduledStartAt).getTime() : Number.MAX_SAFE_INTEGER;
        const rightTime = right.scheduledStartAt
          ? new Date(right.scheduledStartAt).getTime()
          : Number.MAX_SAFE_INTEGER;

        return leftTime - rightTime;
      })[0] ?? null;
  }, [overviewQueries.sessionsQuery.data]);

  if (campaignDetailsQuery.isLoading || overviewQueries.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (campaignDetailsQuery.isError || overviewQueries.isError || !campaignDetailsQuery.data) {
    return (
      <ErrorState
        message="The campaign workspace could not be loaded. Try again in a moment."
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void overviewQueries.membersQuery.refetch();
        }}
        title="Unable to load campaign"
      />
    );
  }

  const stats = [
    { label: "Members", value: overviewQueries.membersQuery.data?.length ?? 0 },
    { label: "Characters", value: overviewQueries.charactersQuery.data?.length ?? 0 },
    { label: "Quests", value: overviewQueries.questsQuery.data?.length ?? 0 },
    { label: "NPCs", value: overviewQueries.npcsQuery.data?.length ?? 0 },
    { label: "Locations", value: overviewQueries.locationsQuery.data?.length ?? 0 },
    { label: "Notes", value: overviewQueries.notesQuery.data?.length ?? 0 },
  ];

  return (
    <Stack spacing={3.5}>
      <CampaignOverviewHeader campaign={campaignDetailsQuery.data} />

      <CampaignOverviewStats values={stats} />

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <SectionCard title="Next session">
            {upcomingSession ? (
              <Stack spacing={0.5}>
                <strong>{upcomingSession.title}</strong>
                <span>{formatDateTime(upcomingSession.scheduledStartAt)}</span>
                <span>{upcomingSession.summaryPublic ?? "No public summary yet."}</span>
              </Stack>
            ) : (
              <span>No upcoming session scheduled yet.</span>
            )}
          </SectionCard>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CampaignOverviewFeedCard
            emptyDescription="Create your first active quest to start tracking story progression."
            emptyTitle="No quests yet"
            items={(overviewQueries.questsQuery.data ?? []).slice(0, 3)}
            renderItem={(item) => ({
              body: item.description,
              meta: `${item.status} · ${item.priority}`,
              title: item.title,
            })}
            title="Active quests"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CampaignOverviewFeedCard
            emptyDescription="Session recaps and story milestones will appear here."
            emptyTitle="No chronicle entries yet"
            items={(overviewQueries.chronicleQuery.data ?? []).slice(0, 3)}
            renderItem={(item) => ({
              body: item.content,
              meta: item.occurredAt ? formatDateTime(item.occurredAt) : item.inWorldDate,
              title: item.title,
            })}
            title="Latest chronicle"
          />
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <CampaignOverviewFeedCard
            emptyDescription="Pinned notes, ideas, and GM reminders will appear here."
            emptyTitle="No notes yet"
            items={(overviewQueries.notesQuery.data ?? []).slice(0, 3)}
            renderItem={(item) => ({
              body: item.content,
              meta: item.category,
              title: item.title ?? "Untitled note",
            })}
            title="Recent notes"
          />
        </Grid>
      </Grid>
    </Stack>
  );
}
