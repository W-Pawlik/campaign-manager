function normalizeWhitespace(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function buildCampaignSlugBaseFromName(name: string): string {
  const normalized = normalizeWhitespace(name).toLowerCase();
  const slug = normalized
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return slug.length > 0 ? slug : "campaign";
}