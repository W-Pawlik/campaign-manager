export type CampaignListItem = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  status: string;
  visibility: string;
  coverImageUrl: string | null;
  worldName: string | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
};

export type CampaignDetails = {
  id: string;
  ownerId: string;
  name: string;
  slug: string;
  description: string | null;
  gameSystemId: string | null;
  status: string;
  visibility: string;
  coverImageUrl: string | null;
  defaultLanguage: string | null;
  currentDateInWorld: string | null;
  worldName: string | null;
  startingLevel: number | null;
  role: string;
  createdAt: string;
  updatedAt: string;
  archivedAt: string | null;
  deletedAt: string | null;
};

export type CampaignInvitation = {
  id: string;
  campaignId: string;
  userId: string;
  role: string;
  status: string;
  invitedById: string;
  respondedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignMember = {
  id: string;
  campaignId: string;
  userId: string;
  role: string;
  status: string;
  nickname: string | null;
  joinedAt: string | null;
  invitedAt: string | null;
  invitedById: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignCharacterListItem = {
  id: string;
  campaignId: string;
  ownerUserId: string | null;
  name: string;
  avatarUrl: string | null;
  type: string;
  status: string;
  race: string | null;
  characterClass: string | null;
  level: number | null;
  updatedAt: string;
};

export type CampaignSessionListItem = {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  scheduledStartAt: string | null;
  scheduledEndAt: string | null;
  actualStartAt: string | null;
  actualEndAt: string | null;
  locationType: string | null;
  locationDetails: string | null;
  meetingUrl: string | null;
  summaryPublic: string | null;
  createdById: string;
  createdAt: string;
  updatedAt: string;
  cancelledAt: string | null;
};

export type CampaignQuestListItem = {
  id: string;
  campaignId: string;
  title: string;
  description: string | null;
  status: string;
  type: string;
  visibility: string;
  priority: string;
  giverNpcId: string | null;
  relatedLocationId: string | null;
  startedAt: string | null;
  completedAt: string | null;
  failedAt: string | null;
  rewardDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignLocationListItem = {
  id: string;
  campaignId: string;
  parentLocationId: string | null;
  name: string;
  type: string;
  shortDescription: string | null;
  description: string | null;
  mapImageUrl: string | null;
  coordinates: unknown | null;
  status: string;
  visibility: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignInventoryListItem = {
  id: string;
  campaignId: string;
  itemTemplateId: string | null;
  source: string;
  externalReferenceId: string | null;
  name: string;
  type: string;
  rarity: string | null;
  isMagical: boolean;
  description: string | null;
  weight: number | null;
  valueAmount: number | null;
  valueCurrency: string | null;
  quantity: number;
  charges: number | null;
  maxCharges: number | null;
  isEquipped: boolean;
  isAttuned: boolean;
  isIdentified: boolean;
  ownerType: string;
  ownerId: string;
  visibility: string;
  customProperties: unknown | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type CampaignNpcListItem = {
  id: string;
  campaignId: string;
  name: string;
  title: string | null;
  avatarUrl: string | null;
  race: string | null;
  occupation: string | null;
  faction: string | null;
  locationId: string | null;
  attitude: string;
  importance: string;
  status: string;
  publicDescription: string | null;
  appearance: string | null;
  personality: string | null;
  statBlock: unknown | null;
  externalReferenceId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CampaignChronicleEntry = {
  id: string;
  campaignId: string;
  sessionId: string | null;
  title: string;
  content: string;
  inWorldDate: string | null;
  occurredAt: string | null;
  visibility: string;
  createdById: string;
  createdAt: string;
  updatedAt: string;
};

export type CampaignNote = {
  id: string;
  campaignId: string;
  authorId: string;
  title: string | null;
  content: string;
  visibility: string;
  category: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateCampaignPayload = {
  name: string;
  description?: string | null;
  visibility?: "PRIVATE" | "INVITE_ONLY" | "PUBLIC_READ_ONLY";
  worldName?: string | null;
};
