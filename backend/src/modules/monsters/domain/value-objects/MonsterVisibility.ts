import { ValidationError } from "@core/application/errors/AppError";

export const MONSTER_VISIBILITY = {
  PUBLIC: "PUBLIC",
  GM_ONLY: "GM_ONLY",
} as const;

export type MonsterVisibilityValue = (typeof MONSTER_VISIBILITY)[keyof typeof MONSTER_VISIBILITY];

export class MonsterVisibility {
  public readonly value: MonsterVisibilityValue;

  private constructor(value: MonsterVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): MonsterVisibility {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(MONSTER_VISIBILITY).includes(normalizedValue as MonsterVisibilityValue)) {
      throw new ValidationError("Invalid monster visibility");
    }

    return new MonsterVisibility(normalizedValue as MonsterVisibilityValue);
  }

  public static gmOnly(): MonsterVisibility {
    return new MonsterVisibility(MONSTER_VISIBILITY.GM_ONLY);
  }

  public isPublic(): boolean {
    return this.value === MONSTER_VISIBILITY.PUBLIC;
  }

  public isGmOnly(): boolean {
    return this.value === MONSTER_VISIBILITY.GM_ONLY;
  }
}
