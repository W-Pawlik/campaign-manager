export interface DatabaseHealthChecker {
  checkConnection(): Promise<void>;
}