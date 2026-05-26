import { ValidationError } from "@core/application/errors/AppError";

const MIN_CAMPAIGN_NAME_LENGTH = 3;
const MAX_CAMPAIGN_NAME_LENGTH = 120;

export class CampaignName {
  public readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  public static create(value: string): CampaignName {
    const normalizedValue = value.trim();

    if (normalizedValue.length < MIN_CAMPAIGN_NAME_LENGTH) {
      throw new ValidationError(`Campaign name must be at least ${MIN_CAMPAIGN_NAME_LENGTH} characters`);
    }

    if (normalizedValue.length > MAX_CAMPAIGN_NAME_LENGTH) {
      throw new ValidationError(`Campaign name must be at most ${MAX_CAMPAIGN_NAME_LENGTH} characters`);
    }

    return new CampaignName(normalizedValue);
  }
}