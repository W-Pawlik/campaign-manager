import { ValidationError } from "@core/application/errors/AppError";

export const EXTERNAL_PROVIDER = {
  OPEN5E: "OPEN5E",
  DND5EAPI: "DND5EAPI",
  CUSTOM: "CUSTOM",
} as const;

export type ExternalProviderValue =
  (typeof EXTERNAL_PROVIDER)[keyof typeof EXTERNAL_PROVIDER];

export class ExternalProvider {
  public readonly value: ExternalProviderValue;

  private constructor(value: ExternalProviderValue) {
    this.value = value;
  }

  public static create(value: string): ExternalProvider {
    const normalizedValue = value.trim().toUpperCase();

    if (
      normalizedValue !== EXTERNAL_PROVIDER.OPEN5E &&
      normalizedValue !== EXTERNAL_PROVIDER.DND5EAPI &&
      normalizedValue !== EXTERNAL_PROVIDER.CUSTOM
    ) {
      throw new ValidationError("Invalid external provider");
    }

    return new ExternalProvider(normalizedValue);
  }

  public static open5e(): ExternalProvider {
    return new ExternalProvider(EXTERNAL_PROVIDER.OPEN5E);
  }

  public isOpen5e(): boolean {
    return this.value === EXTERNAL_PROVIDER.OPEN5E;
  }
}
