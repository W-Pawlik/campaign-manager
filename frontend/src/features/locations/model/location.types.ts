import type { CampaignLocationListItem } from "@/features/campaigns";

export type LocationType =
  | "WORLD"
  | "CONTINENT"
  | "REGION"
  | "KINGDOM"
  | "CITY"
  | "DISTRICT"
  | "BUILDING"
  | "DUNGEON"
  | "ROOM"
  | "LANDMARK"
  | "PLANE"
  | "OTHER";

export type LocationStatus = "ACTIVE" | "DESTROYED" | "LOST" | "HIDDEN" | "ARCHIVED";
export type LocationVisibility = "PUBLIC" | "DISCOVERED" | "GM_ONLY";

export type CampaignLocationDetails = CampaignLocationListItem & {
  gmNotes?: string | null;
  createdById?: string;
};

export type CreateLocationPayload = {
  parentLocationId?: string | null;
  name: string;
  type?: LocationType;
  shortDescription?: string | null;
  description?: string | null;
  gmNotes?: string | null;
  mapImageUrl?: string | null;
  coordinates?: unknown | null;
  status?: LocationStatus;
  visibility?: LocationVisibility;
};

export type UpdateLocationPayload = Partial<CreateLocationPayload>;

export const locationTypeOptions: LocationType[] = [
  "WORLD",
  "CONTINENT",
  "REGION",
  "KINGDOM",
  "CITY",
  "DISTRICT",
  "BUILDING",
  "DUNGEON",
  "ROOM",
  "LANDMARK",
  "PLANE",
  "OTHER",
];

export const locationStatusOptions: LocationStatus[] = ["ACTIVE", "DESTROYED", "LOST", "HIDDEN", "ARCHIVED"];
export const locationVisibilityOptions: LocationVisibility[] = ["PUBLIC", "DISCOVERED", "GM_ONLY"];
