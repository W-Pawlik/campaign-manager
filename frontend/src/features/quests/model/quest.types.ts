import type { CampaignQuestListItem } from "@/features/campaigns";

export type QuestStatus =
  | "DRAFT"
  | "AVAILABLE"
  | "ACTIVE"
  | "ON_HOLD"
  | "COMPLETED"
  | "FAILED"
  | "ABANDONED"
  | "HIDDEN";

export type QuestType = "MAIN" | "SIDE" | "PERSONAL" | "FACTION" | "WORLD_EVENT";
export type QuestVisibility = "PUBLIC" | "GM_ONLY" | "DISCOVERED";
export type QuestPriority = "LOW" | "NORMAL" | "HIGH" | "CRITICAL";
export type ObjectiveStatus = "TODO" | "IN_PROGRESS" | "DONE" | "FAILED" | "OPTIONAL_SKIPPED";

export type QuestObjective = {
  id: string;
  questId: string;
  title: string;
  description: string | null;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
};

export type QuestRelation = {
  id: string;
  questId: string;
  entityType: string;
  entityId: string;
  relationType: string;
  createdAt: string;
};

export type CampaignQuestDetails = CampaignQuestListItem & {
  objectives: QuestObjective[];
  relations: QuestRelation[];
  gmNotes?: string | null;
  createdById?: string;
};

export type CreateQuestPayload = {
  title: string;
  description?: string | null;
  status?: QuestStatus;
  type?: QuestType;
  visibility?: QuestVisibility;
  priority?: QuestPriority;
  giverNpcId?: string | null;
  relatedLocationId?: string | null;
  startedAt?: string | null;
  completedAt?: string | null;
  failedAt?: string | null;
  rewardDescription?: string | null;
  gmNotes?: string | null;
};

export type UpdateQuestPayload = Partial<CreateQuestPayload>;

export type CreateQuestObjectivePayload = {
  title: string;
  description?: string | null;
  status?: ObjectiveStatus;
  sortOrder?: number;
};

export type UpdateQuestObjectivePayload = Partial<CreateQuestObjectivePayload>;

export const questStatusOptions: QuestStatus[] = [
  "DRAFT",
  "AVAILABLE",
  "ACTIVE",
  "ON_HOLD",
  "COMPLETED",
  "FAILED",
  "ABANDONED",
  "HIDDEN",
];

export const questTypeOptions: QuestType[] = [
  "MAIN",
  "SIDE",
  "PERSONAL",
  "FACTION",
  "WORLD_EVENT",
];

export const questVisibilityOptions: QuestVisibility[] = ["PUBLIC", "GM_ONLY", "DISCOVERED"];
export const questPriorityOptions: QuestPriority[] = ["LOW", "NORMAL", "HIGH", "CRITICAL"];
export const objectiveStatusOptions: ObjectiveStatus[] = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "FAILED",
  "OPTIONAL_SKIPPED",
];
