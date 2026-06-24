export interface ExternalResourceDetailsDTO {
  id: string;
  provider: string;
  resourceType: string;
  key: string | null;
  slug: string | null;
  url: string | null;
  name: string;
  illustrationUrl?: string | null;
  sourceDocumentKey: string | null;
  sourceDocumentName: string | null;
  normalizedData?: unknown;
  cachedAt: string;
  expiresAt: string | null;
}
