import { randomUUID } from "node:crypto";
import { ForbiddenError, NotFoundError, ValidationError } from "@core/application/errors/AppError";
import type { CommandHandler } from "@core/application/cqrs/CommandHandler";
import type { CampaignAccessApplicationService } from "@modules/campaigns/application/services/CampaignAccessApplicationService";
import { CAMPAIGN_PERMISSION_ACTION } from "@modules/campaigns/domain/services/CampaignPermissionDomainService";
import type { CreateChronicleEntryFromSessionCommand } from "@modules/chronicle/application/commands/CreateChronicleEntryFromSessionCommand";
import type { ChronicleEntryDTO } from "@modules/chronicle/application/dto/ChronicleEntryDTO";
import type { ChronicleEntryRepository } from "@modules/chronicle/application/ports/ChronicleEntryRepository";
import { mapChronicleEntryDtoFromDomain } from "@modules/chronicle/application/services/ChronicleDtoMapper";
import { ChronicleEntry } from "@modules/chronicle/domain/entities/ChronicleEntry";
import type { ChroniclePermissionDomainService } from "@modules/chronicle/domain/services/ChroniclePermissionDomainService";
import { ChronicleVisibility } from "@modules/chronicle/domain/value-objects/ChronicleVisibility";
import type { GameSessionRepository } from "@modules/sessions/application/ports/GameSessionRepository";

export class CreateChronicleEntryFromSessionHandler
  implements CommandHandler<CreateChronicleEntryFromSessionCommand, ChronicleEntryDTO>
{
  public constructor(
    private readonly chronicleRepository: ChronicleEntryRepository,
    private readonly sessionRepository: GameSessionRepository,
    private readonly accessService: CampaignAccessApplicationService,
    private readonly permissionService: ChroniclePermissionDomainService,
  ) {}

  public async execute(command: CreateChronicleEntryFromSessionCommand): Promise<ChronicleEntryDTO> {
    const access = await this.accessService.requirePermission(
      command.input.campaignId,
      command.input.actorUserId,
      CAMPAIGN_PERMISSION_ACTION.CHRONICLE_CREATE_FROM_SESSION,
    );
    const session = await this.sessionRepository.findById(command.input.campaignId, command.input.sessionId);

    if (session === null) {
      throw new NotFoundError("Session not found");
    }

    if (!session.status.isCompleted()) {
      throw new ValidationError("Chronicle entry can be generated only from completed session");
    }

    const visibility =
      command.input.visibility === undefined
        ? ChronicleVisibility.public()
        : ChronicleVisibility.create(command.input.visibility);

    if (!this.permissionService.canSetVisibility(access.role, command.input.actorUserId, visibility)) {
      throw new ForbiddenError("Insufficient chronicle visibility permissions");
    }

    const derivedContent = command.input.content ?? session.summaryPublic ?? session.description;

    if (derivedContent === null || derivedContent.trim().length === 0) {
      throw new ValidationError("Completed session must provide public summary or explicit chronicle content");
    }

    const createdAt = new Date();
    const entry = ChronicleEntry.create({
      id: randomUUID(),
      campaignId: command.input.campaignId,
      sessionId: command.input.sessionId,
      title: (command.input.title ?? session.title).trim(),
      content: derivedContent.trim(),
      inWorldDate: command.input.inWorldDate ?? null,
      occurredAt:
        command.input.occurredAt ??
        session.actualEndAt ??
        session.scheduledEndAt ??
        session.actualStartAt ??
        session.scheduledStartAt,
      visibility,
      createdById: command.input.actorUserId,
      createdAt,
      updatedAt: createdAt,
    });

    await this.chronicleRepository.create(entry);

    return mapChronicleEntryDtoFromDomain(entry);
  }
}
