import { describe, expect, it, vi } from "vitest";
import { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import { CreateCampaignHandler } from "@modules/campaigns/application/handlers/CreateCampaignHandler";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

function createCampaign(slug: string): Campaign {
  return Campaign.create({
    id: "campaign-1",
    ownerId: "user-1",
    name: CampaignName.create("Heroes of Waterdeep"),
    slug,
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
    createdAt: new Date(),
    updatedAt: new Date(),
    archivedAt: null,
    deletedAt: null,
  });
}

describe("CreateCampaignHandler", () => {
  it("creates campaign and owner membership with unique slug", async () => {
    const createdCampaigns: Campaign[] = [];
    const campaignRepository: CampaignRepository = {
      findById: vi.fn(),
      findBySlug: vi
        .fn()
        .mockResolvedValueOnce(createCampaign("heroes-of-waterdeep"))
        .mockResolvedValueOnce(null),
      findUserRole: vi.fn(),
      create: vi.fn(async (campaign: Campaign) => {
        createdCampaigns.push(campaign);
      }),
      save: vi.fn(),
    };
    const handler = new CreateCampaignHandler(campaignRepository);

    const result = await handler.execute(
      new CreateCampaignCommand({
        ownerUserId: "user-1",
        name: "Heroes of Waterdeep",
      }),
    );

    expect(campaignRepository.create).toHaveBeenCalledTimes(1);
    expect(campaignRepository.create).toHaveBeenCalledWith(expect.any(Object), "user-1");
    expect(createdCampaigns[0]?.slug).toBe("heroes-of-waterdeep-2");
    expect(result.role).toBe(CampaignRole.owner().value);
  });
});
