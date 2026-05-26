import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";

export async function findUniqueCampaignSlug(
  campaignRepository: CampaignRepository,
  baseSlug: string,
  excludedCampaignId?: string,
): Promise<string> {
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingCampaign = await campaignRepository.findBySlug(candidateSlug);

    if (existingCampaign === null || existingCampaign.id === excludedCampaignId) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}