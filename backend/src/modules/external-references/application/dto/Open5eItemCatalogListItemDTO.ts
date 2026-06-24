export interface Open5eItemCatalogListItemDTO {
  provider: "OPEN5E";
  resourceType: "EQUIPMENT" | "MAGIC_ITEM";
  key: string;
  name: string;
  sourceDocumentKey: string | null;
  sourceDocumentName: string | null;
  metadata?: Record<string, unknown>;
}
