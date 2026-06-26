export interface SessionParticipantDTO {
  id: string;
  sessionId: string;
  userId: string;
  username?: string | null;
  avatarUrl?: string | null;
  characterId: string | null;
  attendanceStatus: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
