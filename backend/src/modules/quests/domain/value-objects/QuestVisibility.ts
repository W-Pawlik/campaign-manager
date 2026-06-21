import { ValidationError } from "@core/application/errors/AppError";

export const QUEST_VISIBILITY = {
  PUBLIC: "PUBLIC",
  GM_ONLY: "GM_ONLY",
  DISCOVERED: "DISCOVERED",
} as const;

export type QuestVisibilityValue = (typeof QUEST_VISIBILITY)[keyof typeof QUEST_VISIBILITY];

export class QuestVisibility {
  public readonly value: QuestVisibilityValue;

  private constructor(value: QuestVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): QuestVisibility {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(QUEST_VISIBILITY).includes(normalizedValue as QuestVisibilityValue)) {
      throw new ValidationError("Invalid quest visibility");
    }

    return new QuestVisibility(normalizedValue as QuestVisibilityValue);
  }

  public static public(): QuestVisibility { return new QuestVisibility(QUEST_VISIBILITY.PUBLIC); }
  public static discovered(): QuestVisibility { return new QuestVisibility(QUEST_VISIBILITY.DISCOVERED); }
  public static gmOnly(): QuestVisibility { return new QuestVisibility(QUEST_VISIBILITY.GM_ONLY); }

  public isPublic(): boolean { return this.value === QUEST_VISIBILITY.PUBLIC; }
  public isDiscovered(): boolean { return this.value === QUEST_VISIBILITY.DISCOVERED; }
  public isGmOnly(): boolean { return this.value === QUEST_VISIBILITY.GM_ONLY; }
}
