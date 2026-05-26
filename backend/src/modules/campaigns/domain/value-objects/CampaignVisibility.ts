import { ValidationError } from "@core/application/errors/AppError";

export const CAMPAIGN_VISIBILITY = {
  PRIVATE: "PRIVATE",
  PUBLIC: "PUBLIC",
} as const;

export type CampaignVisibilityValue =
  (typeof CAMPAIGN_VISIBILITY)[keyof typeof CAMPAIGN_VISIBILITY];

export class CampaignVisibility {
  public readonly value: CampaignVisibilityValue;

  private constructor(value: CampaignVisibilityValue) {
    this.value = value;
  }

  public static create(value: string): CampaignVisibility {
    const normalizedValue = value.trim().toUpperCase();

    if (normalizedValue !== CAMPAIGN_VISIBILITY.PRIVATE && normalizedValue !== CAMPAIGN_VISIBILITY.PUBLIC) {
      throw new ValidationError("Invalid campaign visibility");
    }

    return new CampaignVisibility(normalizedValue);
  }

  public static private(): CampaignVisibility {
    return new CampaignVisibility(CAMPAIGN_VISIBILITY.PRIVATE);
  }
}