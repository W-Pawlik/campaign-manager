import type { CampaignQuestListItem } from "@/features/campaigns";

import {
  questPriorityOptions,
  questStatusOptions,
  questTypeOptions,
  questVisibilityOptions,
} from "@/features/quests/model/quest.types";

export const questSortFieldOptions = [
  "UPDATED_AT",
  "CREATED_AT",
  "TITLE",
  "PRIORITY",
  "STARTED_AT",
  "COMPLETED_AT",
  "FAILED_AT",
] as const;

export const questSortDirectionOptions = ["DESC", "ASC"] as const;

export const questDatePresenceFilterOptions = ["ALL", "WITH_START", "WITHOUT_START", "FINISHED", "UNFINISHED"] as const;

export type QuestSortField = (typeof questSortFieldOptions)[number];
export type QuestSortDirection = (typeof questSortDirectionOptions)[number];
export type QuestDatePresenceFilter = (typeof questDatePresenceFilterOptions)[number];

export type QuestListFilters = {
  datePresence: QuestDatePresenceFilter;
  priority: string;
  sortDirection: QuestSortDirection;
  sortField: QuestSortField;
  status: string;
  type: string;
  visibility: string;
};

export const defaultQuestListFilters: QuestListFilters = {
  datePresence: "ALL",
  priority: "ALL",
  sortDirection: "DESC",
  sortField: "UPDATED_AT",
  status: "ALL",
  type: "ALL",
  visibility: "ALL",
};

export const questListFilterOptions = {
  priorities: ["ALL", ...questPriorityOptions] as const,
  statuses: ["ALL", ...questStatusOptions] as const,
  types: ["ALL", ...questTypeOptions] as const,
  visibilities: ["ALL", ...questVisibilityOptions] as const,
};

function toTimestamp(value: string | null): number {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  const parsed = new Date(value).getTime();

  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

function toPriorityRank(priority: string): number {
  switch (priority) {
    case "CRITICAL":
      return 4;
    case "HIGH":
      return 3;
    case "NORMAL":
      return 2;
    case "LOW":
      return 1;
    default:
      return 0;
  }
}

function compareNumbers(left: number, right: number, direction: QuestSortDirection): number {
  return direction === "ASC" ? left - right : right - left;
}

function compareStrings(left: string, right: string, direction: QuestSortDirection): number {
  return direction === "ASC" ? left.localeCompare(right) : right.localeCompare(left);
}

export function formatQuestSortFieldLabel(value: QuestSortField): string {
  switch (value) {
    case "UPDATED_AT":
      return "Recently updated";
    case "CREATED_AT":
      return "Recently created";
    case "TITLE":
      return "Title";
    case "PRIORITY":
      return "Priority";
    case "STARTED_AT":
      return "Start date";
    case "COMPLETED_AT":
      return "Completed date";
    case "FAILED_AT":
      return "Failed date";
    default:
      return value;
  }
}

export function formatQuestDatePresenceLabel(value: QuestDatePresenceFilter): string {
  switch (value) {
    case "WITH_START":
      return "With start date";
    case "WITHOUT_START":
      return "Without start date";
    case "FINISHED":
      return "Completed or failed";
    case "UNFINISHED":
      return "Still open";
    default:
      return "All timelines";
  }
}

export function matchesQuestListFilters(quest: CampaignQuestListItem, filters: QuestListFilters): boolean {
  if (filters.status !== "ALL" && quest.status !== filters.status) {
    return false;
  }

  if (filters.type !== "ALL" && quest.type !== filters.type) {
    return false;
  }

  if (filters.priority !== "ALL" && quest.priority !== filters.priority) {
    return false;
  }

  if (filters.visibility !== "ALL" && quest.visibility !== filters.visibility) {
    return false;
  }

  switch (filters.datePresence) {
    case "WITH_START":
      return Boolean(quest.startedAt);
    case "WITHOUT_START":
      return !quest.startedAt;
    case "FINISHED":
      return Boolean(quest.completedAt || quest.failedAt);
    case "UNFINISHED":
      return !quest.completedAt && !quest.failedAt;
    default:
      return true;
  }
}

export function sortQuests(
  quests: CampaignQuestListItem[],
  sortField: QuestSortField,
  sortDirection: QuestSortDirection,
): CampaignQuestListItem[] {
  return quests.slice().sort((left, right) => {
    switch (sortField) {
      case "CREATED_AT":
        return compareNumbers(toTimestamp(left.createdAt), toTimestamp(right.createdAt), sortDirection);
      case "TITLE":
        return compareStrings(left.title, right.title, sortDirection);
      case "PRIORITY":
        return compareNumbers(toPriorityRank(left.priority), toPriorityRank(right.priority), sortDirection);
      case "STARTED_AT":
        return compareNumbers(toTimestamp(left.startedAt), toTimestamp(right.startedAt), sortDirection);
      case "COMPLETED_AT":
        return compareNumbers(toTimestamp(left.completedAt), toTimestamp(right.completedAt), sortDirection);
      case "FAILED_AT":
        return compareNumbers(toTimestamp(left.failedAt), toTimestamp(right.failedAt), sortDirection);
      case "UPDATED_AT":
      default:
        return compareNumbers(toTimestamp(left.updatedAt), toTimestamp(right.updatedAt), sortDirection);
    }
  });
}
