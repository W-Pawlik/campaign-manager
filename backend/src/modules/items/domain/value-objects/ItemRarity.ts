import { ValidationError } from "@core/application/errors/AppError";

export const ITEM_RARITY = {
  COMMON: "COMMON",
  UNCOMMON: "UNCOMMON",
  RARE: "RARE",
  VERY_RARE: "VERY_RARE",
  LEGENDARY: "LEGENDARY",
  ARTIFACT: "ARTIFACT",
  UNKNOWN: "UNKNOWN",
} as const;

export type ItemRarityValue = (typeof ITEM_RARITY)[keyof typeof ITEM_RARITY];

export class ItemRarity {
  public readonly value: ItemRarityValue;

  private constructor(value: ItemRarityValue) {
    this.value = value;
  }

  public static create(value: string): ItemRarity {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(ITEM_RARITY).includes(normalizedValue as ItemRarityValue)) {
      throw new ValidationError("Invalid item rarity");
    }

    return new ItemRarity(normalizedValue as ItemRarityValue);
  }
}
