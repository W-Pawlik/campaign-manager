import { Alert, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import {
  useCampaignDetailsQuery,
  useCampaignInventoryQuery,
  useCampaignNotesQuery,
} from "@/features/campaigns";
import {
  useAddQuestObjectiveMutation,
  useCampaignQuestsQuery,
  useCreateQuestMutation,
  useDeleteQuestMutation,
  useDeleteQuestObjectiveMutation,
  useQuestDetailsQuery,
  useUpdateQuestMutation,
  useUpdateQuestObjectiveMutation,
} from "@/features/quests/api/questsQueries";
import { CampaignQuestsBoard } from "@/features/quests/ui/CampaignQuestsBoard";
import { QuestDetailsDialog } from "@/features/quests/ui/QuestDetailsDialog";
import { QuestFormDialog } from "@/features/quests/ui/QuestFormDialog";
import { QuestObjectiveDialog } from "@/features/quests/ui/QuestObjectiveDialog";
import { CampaignQuestsFeaturedSection } from "@/features/quests/ui/CampaignQuestsFeaturedSection";
import { CampaignQuestsFilterBar } from "@/features/quests/ui/CampaignQuestsFilterBar";
import { CampaignQuestsHeader } from "@/features/quests/ui/CampaignQuestsHeader";
import { CampaignQuestsSidebar } from "@/features/quests/ui/CampaignQuestsSidebar";
import type { QuestObjective } from "@/features/quests/model/quest.types";
import {
  defaultQuestListFilters,
  matchesQuestListFilters,
  sortQuests,
  type QuestListFilters,
} from "@/features/quests/ui/questListUi.utils";
import {
  matchesQuestSearch,
  pickFeaturedQuest,
  pickQuestQuickNotes,
  pickQuestRewards,
} from "@/features/quests/ui/questPageUi.utils";
import { ErrorState, LoadingScreen } from "@/shared/components";

function canManageQuests(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null {
  if (!value) {
    return null;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function toNullableIsoDateTime(value?: string): string | null {
  if (!value || value.trim().length === 0) {
    return null;
  }

  return new Date(value).toISOString();
}

export function CampaignQuestsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const questsQuery = useCampaignQuestsQuery(campaignId);
  const notesQuery = useCampaignNotesQuery(campaignId);
  const inventoryQuery = useCampaignInventoryQuery(campaignId);
  const createQuestMutation = useCreateQuestMutation(campaignId);
  const updateQuestMutation = useUpdateQuestMutation(campaignId);
  const deleteQuestMutation = useDeleteQuestMutation(campaignId);
  const addObjectiveMutation = useAddQuestObjectiveMutation(campaignId);
  const updateObjectiveMutation = useUpdateQuestObjectiveMutation(campaignId);
  const deleteObjectiveMutation = useDeleteQuestObjectiveMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingQuestId, setEditingQuestId] = useState<string | null>(null);
  const [selectedQuestId, setSelectedQuestId] = useState<string | null>(null);
  const [editingObjective, setEditingObjective] = useState<QuestObjective | null>(null);
  const [isObjectiveDialogOpen, setIsObjectiveDialogOpen] = useState(false);
  const [listFilters, setListFilters] = useState<QuestListFilters>(defaultQuestListFilters);
  const [searchValue, setSearchValue] = useState("");
  const questDetailsQuery = useQuestDetailsQuery(campaignId, selectedQuestId ?? editingQuestId);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (questsQuery.isError) {
      return questsQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, questsQuery.error, questsQuery.isError]);
  const canManage = canManageQuests(campaignDetailsQuery.data?.role);
  const isMutating =
    createQuestMutation.isPending ||
    updateQuestMutation.isPending ||
    deleteQuestMutation.isPending ||
    addObjectiveMutation.isPending ||
    updateObjectiveMutation.isPending ||
    deleteObjectiveMutation.isPending;
  const mutationError =
    createQuestMutation.error?.message ??
    updateQuestMutation.error?.message ??
    deleteQuestMutation.error?.message ??
    addObjectiveMutation.error?.message ??
    updateObjectiveMutation.error?.message ??
    deleteObjectiveMutation.error?.message ??
    null;
  const visibleQuests = useMemo(() => {
    return sortQuests(
      (questsQuery.data ?? []).filter(
        (quest) => matchesQuestListFilters(quest, listFilters) && matchesQuestSearch(quest, searchValue),
      ),
      listFilters.sortField,
      listFilters.sortDirection,
    );
  }, [listFilters, questsQuery.data, searchValue]);
  const featuredQuest = useMemo(() => pickFeaturedQuest(visibleQuests), [visibleQuests]);
  const featuredQuestDetailsQuery = useQuestDetailsQuery(campaignId, featuredQuest?.id ?? null);
  const featuredQuestNotes = useMemo(
    () => pickQuestQuickNotes(notesQuery.data ?? [], featuredQuest?.id),
    [featuredQuest?.id, notesQuery.data],
  );
  const featuredQuestRewards = useMemo(
    () => pickQuestRewards(inventoryQuery.data ?? [], featuredQuest?.id),
    [featuredQuest?.id, inventoryQuery.data],
  );

  if (campaignDetailsQuery.isLoading || questsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Quests could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void questsQuery.refetch();
        }}
        title="Unable to load quests"
      />
    );
  }

  return (
    <>
      <Stack spacing={3.5}>
        <CampaignQuestsHeader
          canManageQuests={canManage}
          onCreateQuest={() => setIsCreateDialogOpen(true)}
        />

        {mutationError ? <Alert severity="error">{mutationError}</Alert> : null}

        <CampaignQuestsFilterBar
          onChange={setListFilters}
          onSearchChange={setSearchValue}
          searchValue={searchValue}
          value={listFilters}
        />

        <Stack direction={{ xs: "column", xl: "row" }} spacing={2}>
          <Stack spacing={2} sx={{ flex: 1, minWidth: 0 }}>
            <CampaignQuestsFeaturedSection
              canManageQuests={canManage}
              isSubmitting={isMutating}
              onDeleteQuest={(questId) => deleteQuestMutation.mutate(questId)}
              onEditQuest={(questId) => setEditingQuestId(questId)}
              onOpenDetails={(questId) => setSelectedQuestId(questId)}
              quest={featuredQuest?.id ? featuredQuestDetailsQuery.data ?? null : null}
            />

            <CampaignQuestsBoard
              canManageQuests={canManage}
              isSubmitting={isMutating}
              onDeleteQuest={(questId) => deleteQuestMutation.mutate(questId)}
              onEditQuest={(questId) => setEditingQuestId(questId)}
              onOpenDetails={(questId) => setSelectedQuestId(questId)}
              quests={visibleQuests}
            />
          </Stack>

          <Stack sx={{ minWidth: { xl: 340 }, width: { xs: "100%", xl: 340 } }}>
            <CampaignQuestsSidebar
              notes={featuredQuestNotes}
              rewardQuestTitle={featuredQuest?.title ?? null}
              rewards={featuredQuestRewards}
            />
          </Stack>
        </Stack>
      </Stack>

      <QuestFormDialog
        campaignId={campaignId}
        isSubmitting={createQuestMutation.isPending}
        onClose={() => {
          createQuestMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (values) => {
          await createQuestMutation.mutateAsync({
            completedAt: toNullableIsoDateTime(values.completedAt),
            description: toNullableString(values.description),
            failedAt: toNullableIsoDateTime(values.failedAt),
            giverNpcId: toNullableString(values.giverNpcId),
            gmNotes: toNullableString(values.gmNotes),
            priority: values.priority,
            relatedLocationId: toNullableString(values.relatedLocationId),
            rewardDescription: toNullableString(values.rewardDescription),
            startedAt: toNullableIsoDateTime(values.startedAt),
            status: values.status,
            title: values.title.trim(),
            type: values.type,
            visibility: values.visibility,
          });
          createQuestMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitError={createQuestMutation.error?.message ?? null}
      />

      <QuestFormDialog
        campaignId={campaignId}
        initialQuest={editingQuestId ? questDetailsQuery.data ?? null : null}
        isSubmitting={updateQuestMutation.isPending || questDetailsQuery.isLoading}
        onClose={() => {
          updateQuestMutation.reset();
          setEditingQuestId(null);
        }}
        onSubmit={async (values) => {
          if (!editingQuestId) {
            return;
          }

          await updateQuestMutation.mutateAsync({
            payload: {
              completedAt: toNullableIsoDateTime(values.completedAt),
              description: toNullableString(values.description),
              failedAt: toNullableIsoDateTime(values.failedAt),
              giverNpcId: toNullableString(values.giverNpcId),
              gmNotes: toNullableString(values.gmNotes),
              priority: values.priority,
              relatedLocationId: toNullableString(values.relatedLocationId),
              rewardDescription: toNullableString(values.rewardDescription),
              startedAt: toNullableIsoDateTime(values.startedAt),
              status: values.status,
              title: values.title.trim(),
              type: values.type,
              visibility: values.visibility,
            },
            questId: editingQuestId,
          });
          updateQuestMutation.reset();
          setEditingQuestId(null);
        }}
        open={Boolean(editingQuestId)}
        submitError={updateQuestMutation.error?.message ?? null}
      />

      <QuestDetailsDialog
        campaignId={campaignId}
        canManageQuests={canManage}
        isSubmitting={isMutating}
        onAddObjective={() => {
          setEditingObjective(null);
          setIsObjectiveDialogOpen(true);
        }}
        onClose={() => setSelectedQuestId(null)}
        onDeleteObjective={(objective) =>
          selectedQuestId
            ? deleteObjectiveMutation.mutate({ objectiveId: objective.id, questId: selectedQuestId })
            : undefined
        }
        onEditObjective={(objective) => {
          setEditingObjective(objective);
          setIsObjectiveDialogOpen(true);
        }}
        open={Boolean(selectedQuestId)}
        quest={selectedQuestId ? questDetailsQuery.data ?? null : null}
      />

      <QuestObjectiveDialog
        initialObjective={editingObjective}
        isSubmitting={addObjectiveMutation.isPending || updateObjectiveMutation.isPending}
        onClose={() => {
          setEditingObjective(null);
          setIsObjectiveDialogOpen(false);
        }}
        onSubmit={async (values) => {
          if (!selectedQuestId) {
            return;
          }

          if (editingObjective) {
            await updateObjectiveMutation.mutateAsync({
              objectiveId: editingObjective.id,
              payload: {
                description: toNullableString(values.description),
                sortOrder: values.sortOrder,
                status: values.status,
                title: values.title.trim(),
              },
              questId: selectedQuestId,
            });
          } else {
            await addObjectiveMutation.mutateAsync({
              payload: {
                description: toNullableString(values.description),
                sortOrder: values.sortOrder,
                status: values.status,
                title: values.title.trim(),
              },
              questId: selectedQuestId,
            });
          }

          setEditingObjective(null);
          setIsObjectiveDialogOpen(false);
        }}
        open={isObjectiveDialogOpen}
      />
    </>
  );
}
