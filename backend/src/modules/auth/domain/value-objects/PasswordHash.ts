import { ValidationError } from "@core/application/errors/AppError";

export class PasswordHash {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): PasswordHash {
    const normalizedValue = value.trim();

    if (normalizedValue.length === 0) {
      throw new ValidationError("Password hash is required");
    }

    return new PasswordHash(normalizedValue);
  }
}
