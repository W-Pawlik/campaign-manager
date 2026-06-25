import type { CampaignInventoryListItem, CampaignNote, CampaignQuestListItem } from "@/features/campaigns";
import type { CampaignQuestDetails } from "@/features/quests/model/quest.types";

export function formatQuestTypeLabel(value: string): string {
  switch (value) {
    case "MAIN":
      return "Main quest";
    case "SIDE":
      return "Side quest";
    case "PERSONAL":
      return "Personal";
    case "FACTION":
      return "Faction";
    case "WORLD_EVENT":
      return "World event";
    default:
      return value.replaceAll("_", " ");
  }
}

export function formatQuestVisibilityLabel(value: string): string {
  switch (value) {
    case "PUBLIC":
      return "Public";
    case "DISCOVERED":
      return "Discovered";
    case "GM_ONLY":
      return "GM only";
    default:
      return value.replaceAll("_", " ");
  }
}

export function formatQuestPriorityLabel(value: string): string {
  switch (value) {
    case "CRITICAL":
      return "Critical";
    case "HIGH":
      return "High";
    case "NORMAL":
      return "Normal";
    case "LOW":
      return "Low";
    default:
      return value.replaceAll("_", " ");
  }
}

export function formatShortDate(value: string | null): string {
  if (!value) {
    return "No date";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function getQuestStatusRank(status: string): number {
  switch (status) {
    case "ACTIVE":
      return 6;
    case "AVAILABLE":
      return 5;
    case "ON_HOLD":
      return 4;
    case "DRAFT":
      return 3;
    case "COMPLETED":
      return 2;
    case "FAILED":
    case "ABANDONED":
      return 1;
    default:
      return 0;
  }
}

export function pickFeaturedQuest(quests: CampaignQuestListItem[]): CampaignQuestListItem | null {
  if (quests.length === 0) {
    return null;
  }

  return quests
    .slice()
    .sort((left, right) => {
      const statusDiff = getQuestStatusRank(right.status) - getQuestStatusRank(left.status);

      if (statusDiff !== 0) {
        return statusDiff;
      }

      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    })[0];
}

export function getQuestObjectiveStats(quest: CampaignQuestDetails | null) {
  const objectives = quest?.objectives ?? [];
  const done = objectives.filter((objective) => objective.status === "DONE").length;

  return {
    done,
    total: objectives.length,
  };
}

export function pickQuestRewards(
  items: CampaignInventoryListItem[],
  questId: string | null | undefined,
): CampaignInventoryListItem[] {
  if (!questId) {
    return [];
  }

  return items.filter((item) => item.ownerType === "QUEST" && item.ownerId === questId);
}

export function pickQuestQuickNotes(
  notes: CampaignNote[],
  questId: string | null | undefined,
): CampaignNote[] {
  return notes
    .filter((note) => {
      if (note.relatedEntityType === "QUEST" && note.relatedEntityId === questId) {
        return true;
      }

      return note.category === "GM_SECRET";
    })
    .sort((left, right) => new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime())
    .slice(0, 4);
}

export function matchesQuestSearch(quest: CampaignQuestListItem, searchValue: string): boolean {
  const search = searchValue.trim().toLowerCase();

  if (search.length === 0) {
    return true;
  }

  return [quest.title, quest.description ?? "", quest.rewardDescription ?? ""]
    .join(" ")
    .toLowerCase()
    .includes(search);
}
