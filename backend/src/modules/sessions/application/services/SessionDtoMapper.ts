import type { CampaignRole } from "@modules/campaigns/domain/value-objects/CampaignRole";
import type { GameSession } from "@modules/sessions/domain/entities/GameSession";
import type { SessionDetailsDTO, SessionGmViewDTO, SessionListItemDTO, SessionPlayerViewDTO } from "@modules/sessions/application/dto/SessionDetailsDTO";
import type { SessionParticipant } from "@modules/sessions/domain/entities/SessionParticipant";
import type { SessionParticipantDTO } from "@modules/sessions/application/dto/SessionParticipantDTO";
import type { CampaignVisibilityApplicationService } from "@modules/campaigns/application/services/CampaignVisibilityApplicationService";

export function mapSessionParticipantDtoFromDomain(participant: SessionParticipant): SessionParticipantDTO {
  return {
    id: participant.id,
    sessionId: participant.sessionId,
    userId: participant.userId,
    characterId: participant.characterId,
    attendanceStatus: participant.attendanceStatus.value,
    note: participant.note,
    createdAt: participant.createdAt.toISOString(),
    updatedAt: participant.updatedAt.toISOString(),
  };
}

export function mapSessionListItemFromDomain(session: GameSession): SessionListItemDTO {
  return {
    id: session.id,
    campaignId: session.campaignId,
    title: session.title,
    description: session.description,
    status: session.status.value,
    scheduledStartAt: session.scheduledStartAt?.toISOString() ?? null,
    scheduledEndAt: session.scheduledEndAt?.toISOString() ?? null,
    actualStartAt: session.actualStartAt?.toISOString() ?? null,
    actualEndAt: session.actualEndAt?.toISOString() ?? null,
    locationType: session.locationType?.value ?? null,
    locationDetails: session.locationDetails,
    meetingUrl: session.meetingUrl,
    summaryPublic: session.summaryPublic,
    createdById: session.createdById,
    createdAt: session.createdAt.toISOString(),
    updatedAt: session.updatedAt.toISOString(),
    cancelledAt: session.cancelledAt?.toISOString() ?? null,
  };
}

export function mapSessionPlayerViewFromDomain(
  session: GameSession,
  participants: SessionParticipant[],
): SessionPlayerViewDTO {
  return {
    ...mapSessionListItemFromDomain(session),
    participants: participants.map(mapSessionParticipantDtoFromDomain),
  };
}

export function mapSessionGmViewFromDomain(
  session: GameSession,
  participants: SessionParticipant[],
): SessionGmViewDTO {
  return {
    ...mapSessionPlayerViewFromDomain(session, participants),
    summaryPrivate: session.summaryPrivate,
  };
}

export function mapSessionDetailsFromDomain(
  session: GameSession,
  participants: SessionParticipant[],
  role: CampaignRole,
  visibilityService: CampaignVisibilityApplicationService,
): SessionDetailsDTO {
  return visibilityService.canSeeSecretContent(role)
    ? mapSessionGmViewFromDomain(session, participants)
    : mapSessionPlayerViewFromDomain(session, participants);
}
