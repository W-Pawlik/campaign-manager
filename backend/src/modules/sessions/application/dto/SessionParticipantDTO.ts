export interface SessionParticipantDTO {
  id: string;
  sessionId: string;
  userId: string;
  characterId: string | null;
  attendanceStatus: string;
  note: string | null;
  createdAt: string;
  updatedAt: string;
}
