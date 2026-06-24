export interface Open5eSearchInput {
  query: string;
  resourceTypes?: string[];
  limit?: number;
  page?: number;
}

export interface Open5eListCreaturesInput {
  search?: string;
  type?: string;
  documentKey?: string;
  minChallengeRating?: number;
  maxChallengeRating?: number;
  ordering?: string;
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

export interface Open5eCreatureListItem {
  provider: "OPEN5E";
  resourceType: "CREATURE";
  key: string;
  name: string;
  illustrationUrl?: string | null;
  sourceDocumentKey?: string | null;
  sourceDocumentName?: string | null;
  metadata?: Record<string, unknown>;
}

export interface Open5eListPage<TItem> {
  items: TItem[];
  limit: number;
  page: number;
  total: number;
  hasNext: boolean;
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
  listCreatures(
    input: Open5eListCreaturesInput,
  ): Promise<Open5eListPage<Open5eCreatureListItem>>;
  getResource(input: Open5eGetResourceInput): Promise<Open5eResourceDetails>;
}
