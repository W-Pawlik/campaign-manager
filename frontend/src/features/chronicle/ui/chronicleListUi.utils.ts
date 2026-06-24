import type { CampaignChronicleEntry } from "@/features/campaigns";

import { chronicleVisibilityOptions } from "@/features/chronicle/model/chronicle.types";

export const chronicleSortFieldOptions = [
  "UPDATED_AT",
  "CREATED_AT",
  "TITLE",
  "IN_WORLD_DATE",
  "OCCURRED_AT",
  "VISIBILITY",
] as const;

export const chronicleSortDirectionOptions = ["DESC", "ASC"] as const;
export const chronicleTimelineModeOptions = ["IN_WORLD_DATE", "OCCURRED_AT"] as const;
export const chronicleDatePresenceOptions = ["ALL", "WITH_IN_WORLD_DATE", "WITH_OCCURRED_AT", "LINKED_TO_SESSION", "UNLINKED"] as const;

export type ChronicleSortField = (typeof chronicleSortFieldOptions)[number];
export type ChronicleSortDirection = (typeof chronicleSortDirectionOptions)[number];
export type ChronicleTimelineMode = (typeof chronicleTimelineModeOptions)[number];
export type ChronicleDatePresenceFilter = (typeof chronicleDatePresenceOptions)[number];

export type ChronicleListFilters = {
  datePresence: ChronicleDatePresenceFilter;
  sortDirection: ChronicleSortDirection;
  sortField: ChronicleSortField;
  visibility: string;
};

export const defaultChronicleListFilters: ChronicleListFilters = {
  datePresence: "ALL",
  sortDirection: "DESC",
  sortField: "UPDATED_AT",
  visibility: "ALL",
};

export const chronicleListFilterOptions = {
  visibilities: ["ALL", ...chronicleVisibilityOptions] as const,
};

function compareStrings(left: string, right: string, direction: ChronicleSortDirection): number {
  return direction === "ASC" ? left.localeCompare(right) : right.localeCompare(left);
}

function parseDateLikeValue(value: string | null): number {
  if (!value) {
    return Number.NEGATIVE_INFINITY;
  }

  const parsed = new Date(value).getTime();

  return Number.isNaN(parsed) ? Number.NEGATIVE_INFINITY : parsed;
}

function compareNumbers(left: number, right: number, direction: ChronicleSortDirection): number {
  return direction === "ASC" ? left - right : right - left;
}

export function formatChronicleSortFieldLabel(value: ChronicleSortField): string {
  switch (value) {
    case "UPDATED_AT":
      return "Recently updated";
    case "CREATED_AT":
      return "Recently created";
    case "TITLE":
      return "Title";
    case "IN_WORLD_DATE":
      return "In-world date";
    case "OCCURRED_AT":
      return "Occurred at";
    case "VISIBILITY":
      return "Visibility";
    default:
      return value;
  }
}

export function formatChronicleTimelineModeLabel(value: ChronicleTimelineMode): string {
  return value === "IN_WORLD_DATE" ? "In-world date timeline" : "Occurred at timeline";
}

export function formatChronicleDatePresenceLabel(value: ChronicleDatePresenceFilter): string {
  switch (value) {
    case "WITH_IN_WORLD_DATE":
      return "With in-world date";
    case "WITH_OCCURRED_AT":
      return "With occurred at";
    case "LINKED_TO_SESSION":
      return "Linked to session";
    case "UNLINKED":
      return "Not linked to session";
    default:
      return "All entries";
  }
}

export function matchesChronicleListFilters(
  entry: CampaignChronicleEntry,
  filters: ChronicleListFilters,
): boolean {
  if (filters.visibility !== "ALL" && entry.visibility !== filters.visibility) {
    return false;
  }

  switch (filters.datePresence) {
    case "WITH_IN_WORLD_DATE":
      return Boolean(entry.inWorldDate);
    case "WITH_OCCURRED_AT":
      return Boolean(entry.occurredAt);
    case "LINKED_TO_SESSION":
      return Boolean(entry.sessionId);
    case "UNLINKED":
      return !entry.sessionId;
    default:
      return true;
  }
}

export function sortChronicleEntries(
  entries: CampaignChronicleEntry[],
  sortField: ChronicleSortField,
  sortDirection: ChronicleSortDirection,
): CampaignChronicleEntry[] {
  return entries.slice().sort((left, right) => {
    switch (sortField) {
      case "CREATED_AT":
        return compareNumbers(parseDateLikeValue(left.createdAt), parseDateLikeValue(right.createdAt), sortDirection);
      case "TITLE":
        return compareStrings(left.title, right.title, sortDirection);
      case "IN_WORLD_DATE":
        return compareNumbers(parseDateLikeValue(left.inWorldDate), parseDateLikeValue(right.inWorldDate), sortDirection);
      case "OCCURRED_AT":
        return compareNumbers(parseDateLikeValue(left.occurredAt), parseDateLikeValue(right.occurredAt), sortDirection);
      case "VISIBILITY":
        return compareStrings(left.visibility, right.visibility, sortDirection);
      case "UPDATED_AT":
      default:
        return compareNumbers(parseDateLikeValue(left.updatedAt), parseDateLikeValue(right.updatedAt), sortDirection);
    }
  });
}

export function buildChronicleTimelineEntries(
  entries: CampaignChronicleEntry[],
  mode: ChronicleTimelineMode,
): CampaignChronicleEntry[] {
  const keyed = entries.filter((entry) => (mode === "IN_WORLD_DATE" ? entry.inWorldDate : entry.occurredAt));
  return sortChronicleEntries(keyed, mode === "IN_WORLD_DATE" ? "IN_WORLD_DATE" : "OCCURRED_AT", "ASC");
}
