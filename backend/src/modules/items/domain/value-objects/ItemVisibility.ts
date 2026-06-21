import { ValidationError } from "@core/application/errors/AppError";

export const ITEM_VISIBILITY = {
  PUBLIC: "PUBLIC",
  OWNER_ONLY: "OWNER_ONLY",
  GM_ONLY: "GM_ONLY",
} as const;

export type ItemVisibilityValue = (typeof ITEM_VISIBILITY)[keyof typeof ITEM_VISIBILITY];

export class ItemVisibility {
  public readonly value: ItemVisibilityValue;

  private constructor(value: ItemVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): ItemVisibility {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(ITEM_VISIBILITY).includes(normalizedValue as ItemVisibilityValue)) {
      throw new ValidationError("Invalid item visibility");
    }

    return new ItemVisibility(normalizedValue as ItemVisibilityValue);
  }

  public static public(): ItemVisibility {
    return new ItemVisibility(ITEM_VISIBILITY.PUBLIC);
  }

  public isPublic(): boolean {
    return this.value === ITEM_VISIBILITY.PUBLIC;
  }

  public isOwnerOnly(): boolean {
    return this.value === ITEM_VISIBILITY.OWNER_ONLY;
  }

  public isGmOnly(): boolean {
    return this.value === ITEM_VISIBILITY.GM_ONLY;
  }
}
