import { ValidationError } from "@core/application/errors/AppError";

export const QUEST_PRIORITY = {
  LOW: "LOW",
  NORMAL: "NORMAL",
  HIGH: "HIGH",
  CRITICAL: "CRITICAL",
} as const;

export type QuestPriorityValue = (typeof QUEST_PRIORITY)[keyof typeof QUEST_PRIORITY];

export class QuestPriority {
  public readonly value: QuestPriorityValue;

  private constructor(value: QuestPriorityValue) {
    this.value = value;
  }

  public static create(value: string): QuestPriority {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(QUEST_PRIORITY).includes(normalizedValue as QuestPriorityValue)) {
      throw new ValidationError("Invalid quest priority");
    }

    return new QuestPriority(normalizedValue as QuestPriorityValue);
  }

  public static normal(): QuestPriority { return new QuestPriority(QUEST_PRIORITY.NORMAL); }
  public static high(): QuestPriority { return new QuestPriority(QUEST_PRIORITY.HIGH); }
}
