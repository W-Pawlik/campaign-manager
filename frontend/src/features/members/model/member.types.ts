export type CampaignMemberRole = "OWNER" | "GM" | "CO_GM" | "PLAYER" | "OBSERVER";

export type InviteCampaignMemberPayload = {
  userId: string;
  role: Exclude<CampaignMemberRole, "OWNER">;
};

export type UpdateCampaignMemberPayload = {
  role: CampaignMemberRole;
};

export const invitedMemberRoleOptions: Array<Exclude<CampaignMemberRole, "OWNER">> = [
  "GM",
  "CO_GM",
  "PLAYER",
  "OBSERVER",
];
