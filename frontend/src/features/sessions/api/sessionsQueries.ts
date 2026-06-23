import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { campaignsQueryKeys } from "@/features/campaigns";
import { sessionsApi } from "@/features/sessions/api/sessionsApi";
import type {
  CreateSessionPayload,
  UpdateSessionPayload,
} from "@/features/sessions/model/session.types";

export const sessionsQueryKeys = {
  all: ["sessions"] as const,
  details: (campaignId: string, sessionId: string) =>
    [...sessionsQueryKeys.all, campaignId, sessionId] as const,
  list: (campaignId: string) => [...sessionsQueryKeys.all, campaignId, "list"] as const,
};

function invalidateSessionQueries(
  queryClient: ReturnType<typeof useQueryClient>,
  campaignId: string,
  sessionId?: string,
) {
  queryClient.invalidateQueries({ queryKey: sessionsQueryKeys.list(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.sessions(campaignId) });
  queryClient.invalidateQueries({ queryKey: campaignsQueryKeys.details(campaignId) });

  if (sessionId) {
    queryClient.invalidateQueries({ queryKey: sessionsQueryKeys.details(campaignId, sessionId) });
  }
}

export function useCampaignSessionsQuery(campaignId: string | undefined) {
  return useQuery({
    enabled: Boolean(campaignId),
    queryFn: () => sessionsApi.listCampaignSessions(campaignId!),
    queryKey: sessionsQueryKeys.list(campaignId ?? "missing"),
  });
}

export function useSessionDetailsQuery(campaignId: string | undefined, sessionId: string | null) {
  return useQuery({
    enabled: Boolean(campaignId && sessionId),
    queryFn: () => sessionsApi.getSessionDetails(campaignId!, sessionId!),
    queryKey: sessionsQueryKeys.details(campaignId ?? "missing", sessionId ?? "missing"),
  });
}

export function useCreateSessionMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSessionPayload) => sessionsApi.createSession(campaignId!, payload),
    onSuccess: (session) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, session.id);
        queryClient.setQueryData(sessionsQueryKeys.details(campaignId, session.id), session);
      }
    },
  });
}

export function useUpdateSessionMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { payload: UpdateSessionPayload; sessionId: string }) =>
      sessionsApi.updateSession(campaignId!, input.sessionId, input.payload),
    onSuccess: (session) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, session.id);
        queryClient.setQueryData(sessionsQueryKeys.details(campaignId, session.id), session);
      }
    },
  });
}

export function useCancelSessionMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.cancelSession(campaignId!, sessionId),
    onSuccess: (_data, sessionId) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, sessionId);
      }
    },
  });
}

export function useCompleteSessionMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.completeSession(campaignId!, sessionId),
    onSuccess: (_data, sessionId) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, sessionId);
      }
    },
  });
}

export function useConfirmSessionAttendanceMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.confirmSessionAttendance(campaignId!, sessionId),
    onSuccess: (_data, sessionId) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, sessionId);
      }
    },
  });
}

export function useDeclineSessionAttendanceMutation(campaignId: string | undefined) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (sessionId: string) => sessionsApi.declineSessionAttendance(campaignId!, sessionId),
    onSuccess: (_data, sessionId) => {
      if (campaignId) {
        invalidateSessionQueries(queryClient, campaignId, sessionId);
      }
    },
  });
}
