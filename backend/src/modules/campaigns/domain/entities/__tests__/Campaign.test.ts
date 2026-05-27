import { describe, expect, it } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

function createActiveCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "user-1",
    name: CampaignName.create("Heroes of Waterdeep"),
    slug: "heroes-of-waterdeep",
    description: null,
    gameSystemId: null,
    status: CampaignStatus.active(),
    visibility: CampaignVisibility.private(),
    coverImageUrl: null,
    coverImageKey: null,
    defaultLanguage: null,
    currentDateInWorld: null,
    worldName: null,
    startingLevel: null,
    createdAt: new Date("2026-01-01T10:00:00.000Z"),
    updatedAt: new Date("2026-01-01T10:00:00.000Z"),
    archivedAt: null,
    deletedAt: null,
  });
}

describe("Campaign", () => {
  it("blocks updates when campaign is archived", () => {
    const archivedCampaign = createActiveCampaign().archive(new Date("2026-01-02T10:00:00.000Z"));

    expect(() =>
      archivedCampaign.withUpdates({
        name: CampaignName.create("New Name"),
      }),
    ).toThrow(ForbiddenError);
  });

  it("soft deletes campaign and archives it", () => {
    const deletedAt = new Date("2026-01-03T10:00:00.000Z");
    const deletedCampaign = createActiveCampaign().softDelete(deletedAt);

    expect(deletedCampaign.deletedAt?.toISOString()).toBe(deletedAt.toISOString());
    expect(deletedCampaign.archivedAt?.toISOString()).toBe(deletedAt.toISOString());
    expect(deletedCampaign.status.value).toBe("ARCHIVED");
  });
});
