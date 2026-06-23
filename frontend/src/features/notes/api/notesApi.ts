import { apiEndpoints } from "@/core/api/endpoints";
import { httpClient } from "@/core/api/httpClient";
import type { CampaignNote } from "@/features/campaigns";
import type { CreateNotePayload, UpdateNotePayload } from "@/features/notes/model/note.types";

const campaignsBasePath = apiEndpoints.campaigns.base;

export const notesApi = {
  async createNote(campaignId: string, payload: CreateNotePayload): Promise<CampaignNote> {
    const response = await httpClient.post<CampaignNote>(`${campaignsBasePath}/${campaignId}/notes`, payload);

    return response.data;
  },

  async deleteNote(campaignId: string, noteId: string): Promise<void> {
    await httpClient.delete(`${campaignsBasePath}/${campaignId}/notes/${noteId}`);
  },

  async getNoteDetails(campaignId: string, noteId: string): Promise<CampaignNote> {
    const response = await httpClient.get<CampaignNote>(`${campaignsBasePath}/${campaignId}/notes/${noteId}`);

    return response.data;
  },

  async updateNote(campaignId: string, noteId: string, payload: UpdateNotePayload): Promise<CampaignNote> {
    const response = await httpClient.patch<CampaignNote>(
      `${campaignsBasePath}/${campaignId}/notes/${noteId}`,
      payload,
    );

    return response.data;
  },
} as const;
