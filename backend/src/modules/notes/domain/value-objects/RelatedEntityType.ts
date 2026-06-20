import { ValidationError } from "@core/application/errors/AppError";

export const RELATED_ENTITY_TYPE = {
  CAMPAIGN: "CAMPAIGN",
  SESSION: "SESSION",
  CHARACTER: "CHARACTER",
  NPC: "NPC",
  QUEST: "QUEST",
  LOCATION: "LOCATION",
  ITEM: "ITEM",
  CHRONICLE_ENTRY: "CHRONICLE_ENTRY",
} as const;

export type RelatedEntityTypeValue =
  (typeof RELATED_ENTITY_TYPE)[keyof typeof RELATED_ENTITY_TYPE];

export class RelatedEntityType {
  public readonly value: RelatedEntityTypeValue;

  private constructor(value: RelatedEntityTypeValue) {
    this.value = value;
  }

  public static create(value: string): RelatedEntityType {
    if (!Object.values(RELATED_ENTITY_TYPE).includes(value as RelatedEntityTypeValue)) {
      throw new ValidationError("Invalid related entity type");
    }

    return new RelatedEntityType(value as RelatedEntityTypeValue);
  }

  public isCharacter(): boolean {
    return this.value === RELATED_ENTITY_TYPE.CHARACTER;
  }
}
