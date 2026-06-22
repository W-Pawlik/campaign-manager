import { ValidationError } from "@core/application/errors/AppError";

export const EXTERNAL_RESOURCE_TYPE = {
  CREATURE: "CREATURE",
  SPELL: "SPELL",
  MAGIC_ITEM: "MAGIC_ITEM",
  WEAPON: "WEAPON",
  ARMOR: "ARMOR",
  EQUIPMENT: "EQUIPMENT",
  CLASS: "CLASS",
  SPECIES: "SPECIES",
  BACKGROUND: "BACKGROUND",
  FEAT: "FEAT",
  RULE: "RULE",
  CONDITION: "CONDITION",
  DOCUMENT: "DOCUMENT",
} as const;

export type ExternalResourceTypeValue =
  (typeof EXTERNAL_RESOURCE_TYPE)[keyof typeof EXTERNAL_RESOURCE_TYPE];

export class ExternalResourceType {
  public readonly value: ExternalResourceTypeValue;

  private constructor(value: ExternalResourceTypeValue) {
    this.value = value;
  }

  public static create(value: string): ExternalResourceType {
    const normalizedValue = value.trim().toUpperCase();

    if (
      !Object.values(EXTERNAL_RESOURCE_TYPE).includes(
        normalizedValue as ExternalResourceTypeValue,
      )
    ) {
      throw new ValidationError("Invalid external resource type");
    }

    return new ExternalResourceType(normalizedValue as ExternalResourceTypeValue);
  }

  public static creature(): ExternalResourceType {
    return new ExternalResourceType(EXTERNAL_RESOURCE_TYPE.CREATURE);
  }
}
