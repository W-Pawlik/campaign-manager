import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CreateCampaignCommand } from "@modules/campaigns/application/commands/CreateCampaignCommand";
import type { CampaignDetailsDTO } from "@modules/campaigns/application/dto/CampaignDetailsDTO";
import type { CampaignRepository } from "@modules/campaigns/application/ports/CampaignRepository";
import { mapCampaignDetailsFromDomain } from "@modules/campaigns/application/services/CampaignDtoMapper";
import { buildCampaignSlugBaseFromName } from "@modules/campaigns/application/services/CampaignSlugService";
import { findUniqueCampaignSlug } from "@modules/campaigns/application/services/UniqueCampaignSlugFinder";
import { Campaign } from "@modules/campaigns/domain/entities/Campaign";
import { CampaignName } from "@modules/campaigns/domain/value-objects/CampaignName";
import { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import { CampaignStatus } from "@modules/campaigns/domain/value-objects/CampaignStatus";
import { CampaignVisibility } from "@modules/campaigns/domain/value-objects/CampaignVisibility";

export class CreateCampaignHandler
  implements CommandHandler<CreateCampaignCommand, CampaignDetailsDTO>
{
  public constructor(private readonly campaignRepository: CampaignRepository) {}

  public async execute(command: CreateCampaignCommand): Promise<CampaignDetailsDTO> {
    const name = CampaignName.create(command.input.name);
    const visibility =
      command.input.visibility === undefined
        ? CampaignVisibility.private()
        : CampaignVisibility.create(command.input.visibility);
    const baseSlug = buildCampaignSlugBaseFromName(name.value);
    const slug = await findUniqueCampaignSlug(this.campaignRepository, baseSlug);
    const createdAt = new Date();
    const campaign = Campaign.create({
      id: randomUUID(),
      ownerId: command.input.ownerUserId,
      name,
      slug,
      description: command.input.description ?? null,
      gameSystemId: command.input.gameSystemId ?? null,
      status: CampaignStatus.active(),
      visibility,
      coverImageUrl: null,
      coverImageKey: null,
      defaultLanguage: command.input.defaultLanguage ?? null,
      currentDateInWorld: command.input.currentDateInWorld ?? null,
      worldName: command.input.worldName ?? null,
      startingLevel: command.input.startingLevel ?? null,
      createdAt,
      updatedAt: createdAt,
      archivedAt: null,
      deletedAt: null,
    });

    await this.campaignRepository.create(campaign, command.input.ownerUserId);

    return mapCampaignDetailsFromDomain(campaign, CampaignRole.owner());
  }
}
