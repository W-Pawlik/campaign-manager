import type { CampaignSessionListItem } from "@/features/campaigns";
import type { SessionStatus } from "@/features/sessions/model/session.types";

export const sessionFilterOptions = [
  "ALL",
  "PLANNED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
] as const;

export const sessionSortOptions = ["UPCOMING", "RECENT", "TITLE"] as const;

export type SessionFilterValue = (typeof sessionFilterOptions)[number];
export type SessionSortValue = (typeof sessionSortOptions)[number];

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatSessionDate(value: string | null): string {
  if (!value) {
    return "Date TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatSessionTime(value: string | null): string {
  if (!value) {
    return "Time TBD";
  }

  return new Intl.DateTimeFormat(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function formatSessionStatusLabel(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatSessionSortLabel(sort: SessionSortValue): string {
  switch (sort) {
    case "RECENT":
      return "Recently updated";
    case "TITLE":
      return "Title";
    default:
      return "Upcoming first";
  }
}

export function getSessionLocationLabel(session: CampaignSessionListItem): string {
  if (session.locationDetails?.trim()) {
    return session.locationDetails.trim();
  }

  if (!session.locationType) {
    return "Location TBD";
  }

  switch (session.locationType) {
    case "IN_PERSON":
      return "In person";
    case "ONLINE":
      return "Online";
    case "HYBRID":
      return "Hybrid";
    default:
      return "Location TBD";
  }
}

export function getSessionChronicleLabel(session: CampaignSessionListItem): string {
  return session.summaryPublic?.trim() ? "Public recap ready" : "No public recap";
}

export function getSessionDateCardParts(value: string | null): {
  day: string;
  month: string;
  year: string;
} {
  if (!value) {
    return { day: "—", month: "TBD", year: "—" };
  }

  const date = new Date(value);

  return {
    day: new Intl.DateTimeFormat(undefined, { day: "2-digit" }).format(date),
    month: new Intl.DateTimeFormat(undefined, { month: "short" }).format(date).toUpperCase(),
    year: new Intl.DateTimeFormat(undefined, { year: "numeric" }).format(date),
  };
}

export function isSessionFilterMatch(status: string, filter: SessionFilterValue): boolean {
  return filter === "ALL" ? true : status === filter;
}

export function getEditableSessionStatusOptions(initialStatus?: string | null): SessionStatus[] {
  if (initialStatus === "CANCELLED" || initialStatus === "COMPLETED") {
    return [];
  }

  return ["PLANNED", "CONFIRMED", "POSTPONED"];
}
