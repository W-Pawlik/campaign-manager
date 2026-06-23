import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsApi, campaignsQueryKeys } from "@/features/campaigns";
import { notesApi } from "@/features/notes/api/notesApi";
import type { CreateNotePayload, UpdateNotePayload } from "@/features/notes/model/note.types";

export const notesQueryKeys = {
  all: ["notes"] as const,
  details: (campaignId: string, noteId: string) => [...notesQueryKeys.all, campaignId, noteId] as const,
  list: (campaignId: string) => campaignsQueryKeys.notes(campaignId),
};

function invalidateNoteQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  noteId?: string,
) {
  queryClient.invalidateQueries({ queryKey: notesQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (noteId) {
    queryClient.invalidateQueries({ queryKey: notesQueryKeys.details(campaignId, noteId) });
  }
}

export function useCampaignNotesQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => campaignsApi.listCampaignNotes(campaignId!),
    queryKey: notesQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useNoteDetailsQuery(campaignId: string | undefined, noteId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && noteId),
    queryFn: () => notesApi.getNoteDetails(campaignId!, noteId!),
    queryKey: notesQueryKeys.details(campaignId ?? "missing", noteId ?? "missing"),
  });
}

export function useCreateNoteMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateNotePayload) => notesApi.createNote(campaignId!, payload),
    onSuccess: (note) => {
      if (campaignId) {
        invalidateNoteQueries(queryClient, campaignId, note.id);
      }
    },
  });
}

export function useUpdateNoteMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { noteId: string; payload: UpdateNotePayload }) =>
      notesApi.updateNote(campaignId!, input.noteId, input.payload),
    onSuccess: (note) => {
      if (campaignId) {
        invalidateNoteQueries(queryClient, campaignId, note.id);
      }
    },
  });
}

export function useDeleteNoteMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (noteId: string) => notesApi.deleteNote(campaignId!, noteId),
    onSuccess: (_data, noteId) => {
      if (campaignId) {
        invalidateNoteQueries(queryClient, campaignId, noteId);
      }
    },
  });
}
