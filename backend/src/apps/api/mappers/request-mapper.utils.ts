export function omitUndefinedProperties<T extends Record<string, unknown>>(input: T): Partial<T> {
  const entries = Object.entries(input).filter(([, value]) => value !== undefined);

  return Object.fromEntries(entries) as Partial<T>;
}
