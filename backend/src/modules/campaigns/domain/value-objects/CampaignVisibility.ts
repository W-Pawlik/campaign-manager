import { ValidationError } from "@core/application/errors/AppError";

export const CAMPAIGN_VISIBILITY = {
  PRIVATE: "PRIVATE",
  INVITE_ONLY: "INVITE_ONLY",
  PUBLIC_READ_ONLY: "PUBLIC_READ_ONLY",
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

    if (
      normalizedValue !== CAMPAIGN_VISIBILITY.PRIVATE &&
      normalizedValue !== CAMPAIGN_VISIBILITY.INVITE_ONLY &&
      normalizedValue !== CAMPAIGN_VISIBILITY.PUBLIC_READ_ONLY
    ) {
      throw new ValidationError("Invalid campaign visibility");
    }

    return new CampaignVisibility(normalizedValue);
  }

  public static private(): CampaignVisibility {
    return new CampaignVisibility(CAMPAIGN_VISIBILITY.PRIVATE);
  }

  public static inviteOnly(): CampaignVisibility {
    return new CampaignVisibility(CAMPAIGN_VISIBILITY.INVITE_ONLY);
  }

  public static publicReadOnly(): CampaignVisibility {
    return new CampaignVisibility(CAMPAIGN_VISIBILITY.PUBLIC_READ_ONLY);
  }
}
