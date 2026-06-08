import { describe, expect, it } from "vitest";
import { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";
import { CampaignPermissionDomainService } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";

describe("CampaignVisibilityApplicationService", () => {
  const service = new CampaignVisibilityApplicationService(new CampaignPermissionDomainService());

  it("keeps secret values for campaign staff", () => {
    expect(service.filterSecretValue("dragon is disguised", CampaignRole.create("GM"))).toBe(
      "dragon is disguised",
    );
  });

  it("removes secret values for players", () => {
    expect(service.filterSecretValue("dragon is disguised", CampaignRole.player())).toBeNull();
  });
});
