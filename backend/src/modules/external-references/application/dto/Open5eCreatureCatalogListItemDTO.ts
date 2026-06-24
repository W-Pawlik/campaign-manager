export interface Open5eCreatureCatalogListItemDTO {
  provider: "OPEN5E";
  resourceType: "CREATURE";
  key: string;
  name: string;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
}
