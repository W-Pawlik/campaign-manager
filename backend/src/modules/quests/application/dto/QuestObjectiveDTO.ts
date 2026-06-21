export interface QuestObjectiveDTO {
  id: string;
  questId: string;
  title: string;
  description: string | null;
  status: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}
