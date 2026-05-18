import type { UserCampaignOwnershipChecker } from "@modules/users/application/ports/UserCampaignOwnershipChecker";

export class NoopUserCampaignOwnershipChecker implements UserCampaignOwnershipChecker {
  public async hasActiveOwnedCampaigns(userId: string): Promise<boolean> {
    void userId;
    // TODO: Replace with real campaigns module integration once campaigns ownership model is implemented.
    return false;
  }
}
