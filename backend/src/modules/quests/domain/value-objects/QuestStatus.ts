import { ValidationError } from "@core/application/errors/AppError";

export const QUEST_STATUS = {
  DRAFT: "DRAFT",
  AVAILABLE: "AVAILABLE",
  ACTIVE: "ACTIVE",
  ON_HOLD: "ON_HOLD",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
  ABANDONED: "ABANDONED",
  HIDDEN: "HIDDEN",
} as const;

export type QuestStatusValue = (typeof QUEST_STATUS)[keyof typeof QUEST_STATUS];

export class QuestStatus {
  public readonly value: QuestStatusValue;

  private constructor(value: QuestStatusValue) {
    this.value = value;
  }

  public static create(value: string): QuestStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(QUEST_STATUS).includes(normalizedValue as QuestStatusValue)) {
      throw new ValidationError("Invalid quest status");
    }

    return new QuestStatus(normalizedValue as QuestStatusValue);
  }

  public static draft(): QuestStatus { return new QuestStatus(QUEST_STATUS.DRAFT); }
  public static available(): QuestStatus { return new QuestStatus(QUEST_STATUS.AVAILABLE); }
  public static active(): QuestStatus { return new QuestStatus(QUEST_STATUS.ACTIVE); }
  public static completed(): QuestStatus { return new QuestStatus(QUEST_STATUS.COMPLETED); }
  public static failed(): QuestStatus { return new QuestStatus(QUEST_STATUS.FAILED); }
  public static hidden(): QuestStatus { return new QuestStatus(QUEST_STATUS.HIDDEN); }

  public isCompleted(): boolean { return this.value === QUEST_STATUS.COMPLETED; }
  public isFailed(): boolean { return this.value === QUEST_STATUS.FAILED; }
  public isHidden(): boolean { return this.value === QUEST_STATUS.HIDDEN; }
  public isActive(): boolean { return this.value === QUEST_STATUS.ACTIVE; }
}
