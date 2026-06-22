import { ValidationError } from "@core/application/errors/AppError";

export const MONSTER_SIZE = {
  TINY: "TINY",
  SMALL: "SMALL",
  MEDIUM: "MEDIUM",
  LARGE: "LARGE",
  HUGE: "HUGE",
  GARGANTUAN: "GARGANTUAN",
  UNKNOWN: "UNKNOWN",
} as const;

export type MonsterSizeValue = (typeof MONSTER_SIZE)[keyof typeof MONSTER_SIZE];

export class MonsterSize {
  public readonly value: MonsterSizeValue;

  private constructor(value: MonsterSizeValue) {
    this.value = value;
  }

  public static create(value: string): MonsterSize {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(MONSTER_SIZE).includes(normalizedValue as MonsterSizeValue)) {
      throw new ValidationError("Invalid monster size");
    }

    return new MonsterSize(normalizedValue as MonsterSizeValue);
  }
}
