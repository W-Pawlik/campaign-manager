import type { MonsterRepository } from "@modules/monsters/application/ports/MonsterRepository";

export async function findUniqueMonsterSlug(
  monsterRepository: MonsterRepository,
  campaignId: string | null,
  baseSlug: string,
  excludedMonsterId?: string,
): Promise<string> {
  let candidateSlug = baseSlug;
  let suffix = 2;

  while (true) {
    const existingMonster = await monsterRepository.findByCampaignIdAndSlug(campaignId, candidateSlug);

    if (existingMonster === null || existingMonster.id === excludedMonsterId) {
      return candidateSlug;
    }

    candidateSlug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }
}
