export interface Open5eCreatureCatalogListItemDTO {
  provider: "OPEN5E";
  resourceType: "CREATURE";
  key: string;
  name: string;
  illustrationUrl?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
}
