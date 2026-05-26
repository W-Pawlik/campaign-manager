import { ValidationError } from "@core/application/errors/AppError";

export const CAMPAIGN_STATUS = {
  ACTIVE: "ACTIVE",
  ARCHIVED: "ARCHIVED",
} as const;

export type CampaignStatusValue = (typeof CAMPAIGN_STATUS)[keyof typeof CAMPAIGN_STATUS];

export class CampaignStatus {
  public readonly value: CampaignStatusValue;

  private constructor(value: CampaignStatusValue) {
    this.value = value;
  }

  public static create(value: string): CampaignStatus {
    const normalizedValue = value.trim().toUpperCase();

    if (normalizedValue !== CAMPAIGN_STATUS.ACTIVE && normalizedValue !== CAMPAIGN_STATUS.ARCHIVED) {
      throw new ValidationError("Invalid campaign status");
    }

    return new CampaignStatus(normalizedValue);
  }

  public static active(): CampaignStatus {
    return new CampaignStatus(CAMPAIGN_STATUS.ACTIVE);
  }

  public static archived(): CampaignStatus {
    return new CampaignStatus(CAMPAIGN_STATUS.ARCHIVED);
  }

  public isArchived(): boolean {
    return this.value === CAMPAIGN_STATUS.ARCHIVED;
  }
}