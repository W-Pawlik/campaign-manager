export const CHRONICLE_TYPES = {
  ChronicleEntryRepository: Symbol.for("chronicle.ChronicleEntryRepository"),
  ChronicleEntryReadRepository: Symbol.for("chronicle.ChronicleEntryReadRepository"),
  ChronicleEntryMapper: Symbol.for("chronicle.ChronicleEntryMapper"),
  ChroniclePermissionDomainService: Symbol.for("chronicle.ChroniclePermissionDomainService"),
  ChronicleVisibilityApplicationService: Symbol.for("chronicle.ChronicleVisibilityApplicationService"),
  CreateChronicleEntryHandler: Symbol.for("chronicle.CreateChronicleEntryHandler"),
  UpdateChronicleEntryHandler: Symbol.for("chronicle.UpdateChronicleEntryHandler"),
  DeleteChronicleEntryHandler: Symbol.for("chronicle.DeleteChronicleEntryHandler"),
  PublishChronicleEntryHandler: Symbol.for("chronicle.PublishChronicleEntryHandler"),
  CreateChronicleEntryFromSessionHandler: Symbol.for("chronicle.CreateChronicleEntryFromSessionHandler"),
  ListCampaignChronicleHandler: Symbol.for("chronicle.ListCampaignChronicleHandler"),
  GetChronicleEntryDetailsHandler: Symbol.for("chronicle.GetChronicleEntryDetailsHandler"),
} as const;
