import { ValidationError } from "@core/application/errors/AppError";

export class DisplayName {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): DisplayName {
    const normalizedValue = value.trim();

    if (normalizedValue.length < 2 || normalizedValue.length > 80) {
      throw new ValidationError("Display name must be between 2 and 80 characters");
    }

    return new DisplayName(normalizedValue);
  }
}
