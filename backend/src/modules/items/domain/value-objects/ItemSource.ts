import { ValidationError } from "@core/application/errors/AppError";

export const ITEM_SOURCE = {
  CUSTOM: "CUSTOM",
  OPEN5E: "OPEN5E",
  SYSTEM: "SYSTEM",
} as const;

export type ItemSourceValue = (typeof ITEM_SOURCE)[keyof typeof ITEM_SOURCE];

export class ItemSource {
  public readonly value: ItemSourceValue;

  private constructor(value: ItemSourceValue) {
    this.value = value;
  }

  public static create(value: string): ItemSource {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(ITEM_SOURCE).includes(normalizedValue as ItemSourceValue)) {
      throw new ValidationError("Invalid item source");
    }

    return new ItemSource(normalizedValue as ItemSourceValue);
  }

  public static custom(): ItemSource {
    return new ItemSource(ITEM_SOURCE.CUSTOM);
  }
}
