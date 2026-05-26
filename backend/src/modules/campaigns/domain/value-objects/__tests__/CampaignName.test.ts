import { describe, expect, it } from "vitest";
import { ValidationError } from "@core/application/errors/AppError";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";

describe("CampaignName", () => {
  it("creates valid trimmed campaign name", () => {
    const campaignName = CampaignName.create("  Heroes of Waterdeep  ");

    expect(campaignName.value).toBe("Heroes of Waterdeep");
  });

  it("throws validation error for too short campaign name", () => {
    expect(() => CampaignName.create("ab")).toThrow(ValidationError);
  });
});