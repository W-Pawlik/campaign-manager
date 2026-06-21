import { ValidationError } from "@core/application/errors/AppError";

export const INVENTORY_OWNER_TYPE = {
  CHARACTER: "CHARACTER",
  CAMPAIGN_PARTY: "CAMPAIGN_PARTY",
  NPC: "NPC",
  LOCATION: "LOCATION",
  QUEST: "QUEST",
} as const;

export type InventoryOwnerTypeValue =
  (typeof INVENTORY_OWNER_TYPE)[keyof typeof INVENTORY_OWNER_TYPE];

export class InventoryOwnerType {
  public readonly value: InventoryOwnerTypeValue;

  private constructor(value: InventoryOwnerTypeValue) {
    this.value = value;
  }

  public static create(value: string): InventoryOwnerType {
    const normalizedValue = value.trim().toUpperCase();

    if (!Object.values(INVENTORY_OWNER_TYPE).includes(normalizedValue as InventoryOwnerTypeValue)) {
      throw new ValidationError("Invalid inventory owner type");
    }

    return new InventoryOwnerType(normalizedValue as InventoryOwnerTypeValue);
  }

  public isCharacter(): boolean {
    return this.value === INVENTORY_OWNER_TYPE.CHARACTER;
  }

  public isCampaignParty(): boolean {
    return this.value === INVENTORY_OWNER_TYPE.CAMPAIGN_PARTY;
  }

  public isNpc(): boolean {
    return this.value === INVENTORY_OWNER_TYPE.NPC;
  }

  public isLocation(): boolean {
    return this.value === INVENTORY_OWNER_TYPE.LOCATION;
  }

  public isQuest(): boolean {
    return this.value === INVENTORY_OWNER_TYPE.QUEST;
  }
}
