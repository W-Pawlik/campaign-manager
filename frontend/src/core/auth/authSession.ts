let accessToken: string | null = null;
let sessionClearedHandler: (() => void) | null = null;

export function getAccessToken(): string | null {
  return accessToken;
}

export function setAccessToken(nextAccessToken: string): void {
  accessToken = nextAccessToken;
}

export function clearAccessToken(): void {
  accessToken = null;
}

export function clearAuthSession(): void {
  clearAccessToken();
  sessionClearedHandler?.();
}

export function registerSessionClearedHandler(handler: () => void): () => void {
  sessionClearedHandler = handler;

  return () => {
    if (sessionClearedHandler === handler) {
      sessionClearedHandler = null;
    }
  };
}
