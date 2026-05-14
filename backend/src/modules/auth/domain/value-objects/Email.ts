import { ValidationError } from "@core/application/errors/AppError";

export class Email {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): Email {
    const normalizedValue = value.trim().toLowerCase();

    if (normalizedValue.length === 0) {
      throw new ValidationError("Email is required");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(normalizedValue)) {
      throw new ValidationError("Email is invalid");
    }

    return new Email(normalizedValue);
  }
}
