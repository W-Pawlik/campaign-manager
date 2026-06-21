import { randomUUID } from "node:crypto";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import { ForbiddenError } from "@core/application/errors/AppError";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateChronicleEntryCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryCommand";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import type { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";

export class CreateChronicleEntryHandler
  implements CommandHandler<CreateChronicleEntryCommand, ChronicleEntryDTO>
{
  public constructor(
    private readonly chronicleRepository: ChronicleEntryRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: ChroniclePermissionDomainService,
  ) {}

  public async execute(command: CreateChronicleEntryCommand): Promise<ChronicleEntryDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHRONICLE_CREATE,
    );
    const visibility =
      command.input.visibility === undefined
        ? ChronicleVisibility.draft()
        : ChronicleVisibility.create(command.input.visibility);

    if (!this.permissionService.canSetVisibility(access.role, command.input.actorUserId, visibility)) {
      throw new ForbiddenError("Insufficient chronicle visibility permissions");
    }

    const createdAt = new Date();
    const entry = ChronicleEntry.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      sessionId: command.input.sessionId ?? null,
      title: command.input.title.trim(),
      content: command.input.content.trim(),
      inWorldDate: command.input.inWorldDate ?? null,
      occurredAt: command.input.occurredAt ?? null,
      visibility,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
    });

    await this.chronicleRepository.create(entry);

    return mapChronicleEntryDtoFromDomain(entry);
  }
}
