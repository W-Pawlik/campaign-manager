import { describe, expect, it, vi } from "vitest";
import { ForbiddenError } from "@core/application/errors/AppError";
import { UpdateCampaignCommand } from "@modules/campaigns/application/commands/UpdateCampaignCommand";
import { UpdateCampaignHandler } from "@modules/campaigns/application/handlers/UpdateCampaignHandler";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

function createArchivedCampaign(): Campaign {
  return Campaign.create({
    id: "campaign-1",
    name: CampaignName.create("Old Name"),
    slug: "old-name",
    status: CampaignStatus.archived(),
    visibility: CampaignVisibility.private(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  });
}

describe("UpdateCampaignHandler", () => {
  it("blocks updates for archived campaigns", async () => {
    const campaignRepository: CampaignRepository = {
      findById: vi.fn().mockResolvedValue(createArchivedCampaign()),
      findBySlug: vi.fn().mockResolvedValue(null),
      findUserRole: vi.fn().mockResolvedValue(CampaignRole.owner()),
      create: vi.fn(),
      save: vi.fn(),
    };
    const handler = new UpdateCampaignHandler(campaignRepository);

    await expect(
      handler.execute(
        new UpdateCampaignCommand({
          campaignId: "campaign-1",
          actorUserId: "user-1",
          name: "New Name",
        }),
      ),
    ).rejects.toBeInstanceOf(ForbiddenError);
    expect(campaignRepository.save).not.toHaveBeenCalled();
  });
});
