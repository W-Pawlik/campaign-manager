export interface CacheSetOptions {
  ttlSeconds?: number;
}

export interface Cache {
  get<TValue>(key: string): Promise<TValue | null>;
  set<TValue>(key: string, value: TValue, options?: CacheSetOptions): Promise<void>;
  delete(key: string): Promise<void>;
}
