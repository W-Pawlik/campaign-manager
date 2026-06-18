export function readLocalStorage<TValue>(key: string): TValue | null {
  const value = window.localStorage.getItem(key);

  if (!value) {
    return null;
  }

  return JSON.parse(value) as TValue;
}

export function writeLocalStorage<TValue>(key: string, value: TValue) {
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeLocalStorage(key: string) {
  window.localStorage.removeItem(key);
}
