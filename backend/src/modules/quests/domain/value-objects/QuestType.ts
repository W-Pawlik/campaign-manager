import { ValidationError } from "@core/application/errors/AppError";

export const QUEST_TYPE = {
  MAIN: "MAIN",
  SIDE: "SIDE",
  PERSONAL: "PERSONAL",
  FACTION: "FACTION",
  WORLD_EVENT: "WORLD_EVENT",
} as const;

export type QuestTypeValue = (typeof QUEST_TYPE)[keyof typeof QUEST_TYPE];

export class QuestType {
  public readonly value: QuestTypeValue;

  private constructor(value: QuestTypeValue) {
    this.value = value;
  }

  public static create(value: string): QuestType {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(QUEST_TYPE).includes(normalizedValue as QuestTypeValue)) {
      throw new ValidationError("Invalid quest type");
    }

    return new QuestType(normalizedValue as QuestTypeValue);
  }

  public static side(): QuestType { return new QuestType(QUEST_TYPE.SIDE); }
}
