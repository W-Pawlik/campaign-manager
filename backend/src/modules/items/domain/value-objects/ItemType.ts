import { ValidationError } from "@core/application/errors/AppError";

export const ITEM_TYPE = {
  WEAPON: "WEAPON",
  ARMOR: "ARMOR",
  SHIELD: "SHIELD",
  POTION: "POTION",
  SCROLL: "SCROLL",
  WONDROUS_ITEM: "WONDROUS_ITEM",
  TOOL: "TOOL",
  GEAR: "GEAR",
  TREASURE: "TREASURE",
  QUEST_ITEM: "QUEST_ITEM",
  CONSUMABLE: "CONSUMABLE",
  OTHER: "OTHER",
} as const;

export type ItemTypeValue = (typeof ITEM_TYPE)[keyof typeof ITEM_TYPE];

export class ItemType {
  public readonly value: ItemTypeValue;

  private constructor(value: ItemTypeValue) {
    this.value = value;
  }

  public static create(value: string): ItemType {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(ITEM_TYPE).includes(normalizedValue as ItemTypeValue)) {
      throw new ValidationError("Invalid item type");
    }

    return new ItemType(normalizedValue as ItemTypeValue);
  }

  public static other(): ItemType {
    return new ItemType(ITEM_TYPE.OTHER);
  }

  public isQuestItem(): boolean {
    return this.value === ITEM_TYPE.QUEST_ITEM;
  }
}
