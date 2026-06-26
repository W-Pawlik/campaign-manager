import { describe, expect, it, vi } from "vitest";

import { ListCurrentUserCampaignInvitationsHandler } from "@modules/campaigns/application/handlers/ListCurrentUserCampaignInvitationsHandler";
import type { CampaignReadRepository } from "@modules/campaigns/application/ports/CampaignReadRepository";
import { ListCurrentUserCampaignInvitationsQuery } from "@modules/campaigns/application/queries/ListCurrentUserCampaignInvitationsQuery";

describe("ListCurrentUserCampaignInvitationsHandler", () => {
  it("returns pending invitations for the current user", async () => {
    const campaignReadRepository: CampaignReadRepository = {
      listForUser: vi.fn(),
      getDetailsForUser: vi.fn(),
      listMembers: vi.fn(),
      listInvitations: vi.fn(),
      listInvitationsForUser: vi.fn().mockResolvedValue([
        {
          id: "invitation-1",
          campaignId: "campaign-1",
          campaignName: "Heroes of Waterdeep",
          userId: "user-1",
          username: null,
          avatarUrl: null,
          role: "PLAYER",
          status: "INVITED",
          invitedById: "owner-1",
          invitedByUsername: "owner_user",
          respondedAt: null,
          createdAt: "2026-06-26T10:00:00.000Z",
          updatedAt: "2026-06-26T10:00:00.000Z",
        },
      ]),
    };
    const handler = new ListCurrentUserCampaignInvitationsHandler(campaignReadRepository);

    const result = await handler.execute(
      new ListCurrentUserCampaignInvitationsQuery({ userId: "user-1" }),
    );

    expect(campaignReadRepository.listInvitationsForUser).toHaveBeenCalledWith("user-1");
    expect(result).toHaveLength(1);
    expect(result[0]?.campaignName).toBe("Heroes of Waterdeep");
  });
});
