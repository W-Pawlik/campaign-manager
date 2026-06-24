import type { SessionStatus } from "@/features/sessions/model/session.types";

export const sessionFilterOptions = [
  "ALL",
  "PLANNED",
  "CONFIRMED",
  "COMPLETED",
  "CANCELLED",
  "POSTPONED",
] as const;

export type SessionFilterValue = (typeof sessionFilterOptions)[number];

export function formatDateTime(value: string | null): string {
  if (!value) {
    return "Not scheduled";
  }

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function formatSessionStatusLabel(status: string): string {
  return status.replace("_", " ");
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
