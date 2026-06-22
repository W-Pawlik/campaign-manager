export interface Open5eSearchInput {
  query: string;
  resourceTypes?: string[];
  limit?: number;
  page?: number;
}

export interface Open5eSearchResult {
  provider: "OPEN5E";
  resourceType: string;
  key: string;
  name: string;
  summary?: string | null;
  highlighted?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
  rawData?: unknown;
}

export interface Open5eGetResourceInput {
  resourceType: string;
  key: string;
}

export interface Open5eResourceDetails {
  provider: "OPEN5E";
  resourceType: string;
  key: string;
  name: string;
  slug?: string | null;
  url?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  rawData: unknown;
  normalizedData?: Record<string, unknown> | null;
}

export interface Open5eClient {
  search(input: Open5eSearchInput): Promise<Open5eSearchResult[]>;
  getResource(input: Open5eGetResourceInput): Promise<Open5eResourceDetails>;
}
