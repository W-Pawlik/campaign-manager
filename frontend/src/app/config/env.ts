const optionalString = (value: string | undefined) => {
  const normalized = value?.trim();

  return normalized && normalized.length > 0 ? normalized : undefined;
};

export const env = {
  appName: optionalString(import.meta.env.VITE_APP_NAME) ?? "Campaign Manager",
  apiBaseUrl: optionalString(import.meta.env.VITE_API_BASE_URL) ?? "/api/v1",
} as const;
