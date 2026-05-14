export interface ShutdownHook {
  readonly name: string;
  shutdown(): Promise<void>;
}