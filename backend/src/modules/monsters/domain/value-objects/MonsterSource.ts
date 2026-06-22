import { ValidationError } from "@core/application/errors/AppError";

export const MONSTER_SOURCE = {
  CUSTOM: "CUSTOM",
  OPEN5E: "OPEN5E",
  SYSTEM: "SYSTEM",
} as const;

export type MonsterSourceValue = (typeof MONSTER_SOURCE)[keyof typeof MONSTER_SOURCE];

export class MonsterSource {
  public readonly value: MonsterSourceValue;

  private constructor(value: MonsterSourceValue) {
    this.value = value;
  }

  public static create(value: string): MonsterSource {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(MONSTER_SOURCE).includes(normalizedValue as MonsterSourceValue)) {
      throw new ValidationError("Invalid monster source");
    }

    return new MonsterSource(normalizedValue as MonsterSourceValue);
  }

  public static custom(): MonsterSource {
    return new MonsterSource(MONSTER_SOURCE.CUSTOM);
  }

  public static open5e(): MonsterSource {
    return new MonsterSource(MONSTER_SOURCE.OPEN5E);
  }
}
