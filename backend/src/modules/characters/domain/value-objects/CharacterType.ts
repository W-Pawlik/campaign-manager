import { ValidationError } from "@core/application/errors/AppError";

export const CHARACTER_TYPE = {
  PLAYER_CHARACTER: "PLAYER_CHARACTER",
  COMPANION: "COMPANION",
  TEMPORARY: "TEMPORARY",
} as const;

export type CharacterTypeValue = (typeof CHARACTER_TYPE)[keyof typeof CHARACTER_TYPE];

export class CharacterType {
  public readonly value: CharacterTypeValue;

  private constructor(value: CharacterTypeValue) {
    this.value = value;
  }

  public static create(value: string): CharacterType {
    const normalizedValue = value.trim().toUpperCase();

    if (
      normalizedValue !== CHARACTER_TYPE.PLAYER_CHARACTER &&
      normalizedValue !== CHARACTER_TYPE.COMPANION &&
      normalizedValue !== CHARACTER_TYPE.TEMPORARY
    ) {
      throw new ValidationError("Invalid character type");
    }

    return new CharacterType(normalizedValue);
  }

  public static playerCharacter(): CharacterType {
    return new CharacterType(CHARACTER_TYPE.PLAYER_CHARACTER);
  }

  public isPlayerCharacter(): boolean {
    return this.value === CHARACTER_TYPE.PLAYER_CHARACTER;
  }
}
