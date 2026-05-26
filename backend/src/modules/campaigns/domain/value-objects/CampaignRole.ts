import { ValidationError } from "@core/application/errors/AppError";

export const CAMPAIGN_ROLE = {
  OWNER: "OWNER",
  GM: "GM",
  PLAYER: "PLAYER",
} as const;

export type CampaignRoleValue = (typeof CAMPAIGN_ROLE)[keyof typeof CAMPAIGN_ROLE];

export class CampaignRole {
  public readonly value: CampaignRoleValue;

  private constructor(value: CampaignRoleValue) {
    this.value = value;
  }

  public static create(value: string): CampaignRole {
    const normalizedValue = value.trim().toUpperCase();

    if (
      normalizedValue !== CAMPAIGN_ROLE.OWNER &&
      normalizedValue !== CAMPAIGN_ROLE.GM &&
      normalizedValue !== CAMPAIGN_ROLE.PLAYER
    ) {
      throw new ValidationError("Invalid campaign role");
    }

    return new CampaignRole(normalizedValue);
  }

  public static owner(): CampaignRole {
    return new CampaignRole(CAMPAIGN_ROLE.OWNER);
  }

  public isOwner(): boolean {
    return this.value === CAMPAIGN_ROLE.OWNER;
  }
}