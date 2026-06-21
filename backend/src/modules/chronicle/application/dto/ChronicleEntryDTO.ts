import type { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export interface ChronicleEntryDTO {
  id: string;
  campaignId: string;
  sessionId: string | null;
  title: string;
  content: string;
  inWorldDate: string | null;
  occurredAt: string | null;
  visibility: ChronicleVisibility["value"];
  createdById: string;
  createdAt: string;
  updatedAt: string;
}
