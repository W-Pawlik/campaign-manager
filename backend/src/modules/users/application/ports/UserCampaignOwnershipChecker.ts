export interface UserCampaignOwnershipChecker {
  hasActiveOwnedCampaigns(userId: string): Promise<boolean>;
}
