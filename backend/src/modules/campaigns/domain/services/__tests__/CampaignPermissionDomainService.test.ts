import { describe, expect, it } from "vitest";
import {
  CAMPAIGN_PERMISSION_ACTION,
  CampaignPermissionDomainService,
} from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

describe("CampaignPermissionDomainService", () => {
  const service = new CampaignPermissionDomainService();

  it("allows every active member role to read a campaign", () => {
    expect(service.can(CampaignRole.owner(), CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_READ)).toBe(true);
    expect(service.can(CampaignRole.player(), CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_READ)).toBe(true);
  });

  it("keeps campaign updates owner-only", () => {
    expect(service.can(CampaignRole.owner(), CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_UPDATE)).toBe(true);
    expect(service.can(CampaignRole.player(), CAMPAIGN_PERMISSION_ACTION.CAMPAIGN_UPDATE)).toBe(
      false,
    );
  });

  it("allows campaign staff to see secret content", () => {
    expect(service.canSeeSecretContent(CampaignRole.create("GM"))).toBe(true);
    expect(service.canSeeSecretContent(CampaignRole.player())).toBe(false);
  });

  it("keeps monster management staff-only", () => {
    expect(service.can(CampaignRole.create("GM"), CAMPAIGN_PERMISSION_ACTION.MONSTER_CREATE)).toBe(
      true,
    );
    expect(service.can(CampaignRole.player(), CAMPAIGN_PERMISSION_ACTION.MONSTER_READ)).toBe(false);
    expect(service.can(CampaignRole.player(), CAMPAIGN_PERMISSION_ACTION.MONSTER_UPDATE)).toBe(
      false,
    );
  });

  it("allows only owner to invite full-access roles", () => {
    expect(service.canInviteRole(CampaignRole.owner(), CampaignRole.create("GM"))).toBe(true);
    expect(service.canInviteRole(CampaignRole.create("GM"), CampaignRole.create("CO_GM"))).toBe(
      false,
    );
    expect(service.canInviteRole(CampaignRole.create("GM"), CampaignRole.player())).toBe(true);
  });
});
