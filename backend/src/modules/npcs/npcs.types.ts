export const NPCS_TYPES = {
  NpcRepository: Symbol.for("npcs.NpcRepository"),
  NpcReadRepository: Symbol.for("npcs.NpcReadRepository"),
  NpcMapper: Symbol.for("npcs.NpcMapper"),
  CreateNpcHandler: Symbol.for("npcs.CreateNpcHandler"),
  UpdateNpcHandler: Symbol.for("npcs.UpdateNpcHandler"),
  DeleteNpcHandler: Symbol.for("npcs.DeleteNpcHandler"),
  ListCampaignNpcsHandler: Symbol.for("npcs.ListCampaignNpcsHandler"),
  GetNpcDetailsHandler: Symbol.for("npcs.GetNpcDetailsHandler"),
} as const;
