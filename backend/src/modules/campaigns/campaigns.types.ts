export const CAMPAIGNS_TYPES = {
  CampaignRepository: Symbol.for("campaigns.CampaignRepository"),
  CampaignReadRepository: Symbol.for("campaigns.CampaignReadRepository"),
  CampaignMapper: Symbol.for("campaigns.CampaignMapper"),
  CreateCampaignHandler: Symbol.for("campaigns.CreateCampaignHandler"),
  UpdateCampaignHandler: Symbol.for("campaigns.UpdateCampaignHandler"),
  CreateCampaignCoverImageUploadHandler: Symbol.for(
    "campaigns.CreateCampaignCoverImageUploadHandler",
  ),
  ArchiveCampaignHandler: Symbol.for("campaigns.ArchiveCampaignHandler"),
  RestoreCampaignHandler: Symbol.for("campaigns.RestoreCampaignHandler"),
  DeleteCampaignHandler: Symbol.for("campaigns.DeleteCampaignHandler"),
  ListUserCampaignsHandler: Symbol.for("campaigns.ListUserCampaignsHandler"),
  GetCampaignDetailsHandler: Symbol.for("campaigns.GetCampaignDetailsHandler"),
} as const;
