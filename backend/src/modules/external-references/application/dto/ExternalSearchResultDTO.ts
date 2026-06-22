export interface ExternalSearchResultDTO {
  provider: string;
  resourceType: string;
  key: string;
  name: string;
  summary?: string | null;
  highlighted?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
}
