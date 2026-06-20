import { ValidationError } from "@core/application/errors/AppError";

export const CHARACTER_STATUS = {
  DRAFT: "DRAFT",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  DEAD: "DEAD",
  RETIRED: "RETIRED",
  ARCHIVED: "ARCHIVED",
} as const;

export type CharacterStatusValue = (typeof CHARACTER_STATUS)[keyof typeof CHARACTER_STATUS];

export class CharacterStatus {
  public readonly value: CharacterStatusValue;

  private constructor(value: CharacterStatusValue) {
    this.value = value;
  }

  public static create(value: string): CharacterStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (
      normalizedValue !== CHARACTER_STATUS.DRAFT &&
      normalizedValue !== CHARACTER_STATUS.ACTIVE &&
      normalizedValue !== CHARACTER_STATUS.INACTIVE &&
      normalizedValue !== CHARACTER_STATUS.DEAD &&
      normalizedValue !== CHARACTER_STATUS.RETIRED &&
      normalizedValue !== CHARACTER_STATUS.ARCHIVED
    ) {
      throw new ValidationError("Invalid character status");
    }

    return new CharacterStatus(normalizedValue);
  }

  public static draft(): CharacterStatus {
    return new CharacterStatus(CHARACTER_STATUS.DRAFT);
  }

  public static archived(): CharacterStatus {
    return new CharacterStatus(CHARACTER_STATUS.ARCHIVED);
  }

  public isArchived(): boolean {
    return this.value === CHARACTER_STATUS.ARCHIVED;
  }
}
