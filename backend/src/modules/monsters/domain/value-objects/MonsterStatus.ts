import { ValidationError } from "@core/application/errors/AppError";

export const MONSTER_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type MonsterStatusValue = (typeof MONSTER_STATUS)[keyof typeof MONSTER_STATUS];

export class MonsterStatus {
  public readonly value: MonsterStatusValue;

  private constructor(value: MonsterStatusValue) {
    this.value = value;
  }

  public static create(value: string): MonsterStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(MONSTER_STATUS).includes(normalizedValue as MonsterStatusValue)) {
      throw new ValidationError("Invalid monster status");
    }

    return new MonsterStatus(normalizedValue as MonsterStatusValue);
  }

  public static active(): MonsterStatus {
    return new MonsterStatus(MONSTER_STATUS.ACTIVE);
  }

  public static archived(): MonsterStatus {
    return new MonsterStatus(MONSTER_STATUS.ARCHIVED);
  }

  public isArchived(): boolean {
    return this.value === MONSTER_STATUS.ARCHIVED;
  }
}
