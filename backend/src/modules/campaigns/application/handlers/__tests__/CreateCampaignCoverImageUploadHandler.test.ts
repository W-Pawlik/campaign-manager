import { describe, expect, it, vi } from "vitest";
import type { FileStorage } from "@core/application/storage/FileStorage";
import { CreateCampaignCoverImageUploadCommand } from "@modules/campaigns/application/commands/CreateCampaignCoverImageUploadCommand";
import { CreateCampaignCoverImageUploadHandler } from "@modules/campaigns/application/handlers/CreateCampaignCoverImageUploadHandler";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

function createCampaign(): Campaign {
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

describe("CreateCampaignCoverImageUploadHandler", () => {
  it("creates a presigned upload URL and stores the cover image reference", async () => {
    const savedCampaigns: Campaign[] = [];
    const campaignRepository: CampaignRepository = {
      findById: vi.fn().mockResolvedValue(createCampaign()),
      findBySlug: vi.fn(),
      findUserRole: vi.fn().mockResolvedValue(CampaignRole.owner()),
      create: vi.fn(),
      save: vi.fn(async (campaign: Campaign) => {
        savedCampaigns.push(campaign);
      }),
    };
    const fileStorage: FileStorage = {
      createPresignedUploadUrl: vi.fn().mockResolvedValue({
        uploadUrl: "https://upload.example.test",
        publicUrl: "https://cdn.example.test/cover.webp",
      }),
    };
    const handler = new CreateCampaignCoverImageUploadHandler(campaignRepository, fileStorage);

    const result = await handler.execute(
      new CreateCampaignCoverImageUploadCommand({
        campaignId: "campaign-1",
        actorUserId: "user-1",
        fileName: "Cover Art.webp",
        contentType: "image/webp",
      }),
    );

    expect(fileStorage.createPresignedUploadUrl).toHaveBeenCalledWith({
      key: expect.stringMatching(/^campaigns\/campaign-1\/cover-images\/.+-cover-art\.webp$/),
      contentType: "image/webp",
      expiresInSeconds: 900,
    });
    expect(savedCampaigns[0]?.coverImageUrl).toBe("https://cdn.example.test/cover.webp");
    expect(savedCampaigns[0]?.coverImageKey).toBe(result.coverImageKey);
    expect(result.uploadUrl).toBe("https://upload.example.test");
  });
});
