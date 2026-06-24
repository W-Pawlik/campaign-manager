import { Alert, Button, Stack } from "@mui/material";
import { useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import { useCampaignDetailsQuery } from "@/features/campaigns";
import {
  useCancelSessionMutation,
  useCampaignSessionsQuery,
  useCompleteSessionMutation,
  useConfirmSessionAttendanceMutation,
  useCreateSessionMutation,
  useDeclineSessionAttendanceMutation,
  useSessionDetailsQuery,
  useUpdateSessionMutation,
} from "@/features/sessions/api/sessionsQueries";
import { CampaignSessionsList } from "@/features/sessions/ui/CampaignSessionsList";
import { SessionDetailsDialog } from "@/features/sessions/ui/SessionDetailsDialog";
import { SessionFormDialog } from "@/features/sessions/ui/SessionFormDialog";
import { SessionStatusFilterBar } from "@/features/sessions/ui/SessionStatusFilterBar";
import type { SessionFilterValue } from "@/features/sessions/ui/sessionUi.utils";
import { isSessionFilterMatch } from "@/features/sessions/ui/sessionUi.utils";
import { ErrorState, LoadingScreen, PageHeader, SectionCard } from "@/shared/components";

function canManageSessions(role: string | undefined): boolean {
  return role === "OWNER" || role === "GM" || role === "CO_GM";
}

function toNullableString(value?: string): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();

  return trimmed.length === 0 ? null : trimmed;
}

function toNullableIsoDateTime(value?: string): string | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  return value.trim().length === 0 ? null : new Date(value).toISOString();
}

export function CampaignSessionsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const campaignDetailsQuery = useCampaignDetailsQuery(campaignId);
  const sessionsQuery = useCampaignSessionsQuery(campaignId);
  const createSessionMutation = useCreateSessionMutation(campaignId);
  const updateSessionMutation = useUpdateSessionMutation(campaignId);
  const cancelSessionMutation = useCancelSessionMutation(campaignId);
  const completeSessionMutation = useCompleteSessionMutation(campaignId);
  const confirmSessionAttendanceMutation = useConfirmSessionAttendanceMutation(campaignId);
  const declineSessionAttendanceMutation = useDeclineSessionAttendanceMutation(campaignId);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SessionFilterValue>("ALL");
  const sessionDetailsQuery = useSessionDetailsQuery(campaignId, selectedSessionId ?? editingSessionId);

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (sessionsQuery.isError) {
      return sessionsQuery.error.message;
    }

    return null;
  }, [campaignDetailsQuery.error, campaignDetailsQuery.isError, sessionsQuery.error, sessionsQuery.isError]);

  if (campaignDetailsQuery.isLoading || sessionsQuery.isLoading) {
    return <LoadingScreen minHeight="60vh" />;
  }

  if (!campaignId || !campaignDetailsQuery.data || pageError) {
    return (
      <ErrorState
        message={pageError ?? "Campaign sessions could not be loaded."}
        onRetry={() => {
          void campaignDetailsQuery.refetch();
          void sessionsQuery.refetch();
        }}
        title="Unable to load sessions"
      />
    );
  }

  const canManage = canManageSessions(campaignDetailsQuery.data.role);
  const actionMutationError =
    cancelSessionMutation.error?.message ??
    completeSessionMutation.error?.message ??
    confirmSessionAttendanceMutation.error?.message ??
    declineSessionAttendanceMutation.error?.message ??
    null;

  const filteredSessions = (sessionsQuery.data ?? []).filter((session) =>
    isSessionFilterMatch(session.status, statusFilter),
  );

  const isMutating =
    createSessionMutation.isPending ||
    updateSessionMutation.isPending ||
    cancelSessionMutation.isPending ||
    completeSessionMutation.isPending ||
    confirmSessionAttendanceMutation.isPending ||
    declineSessionAttendanceMutation.isPending;

  return (
    <>
      <Stack spacing={3.5}>
        <PageHeader
          action={
            canManage ? (
              <Button onClick={() => setIsCreateDialogOpen(true)} variant="contained">
                Create session
              </Button>
            ) : undefined
          }
          description="Plan upcoming games, track attendance, and keep public or private recaps attached to each session."
          title="Sessions"
        />

        {actionMutationError ? <Alert severity="error">{actionMutationError}</Alert> : null}

        <SectionCard>
          <Stack spacing={2.5}>
            <SessionStatusFilterBar onChange={setStatusFilter} value={statusFilter} />
            <CampaignSessionsList
              canManageSessions={canManage}
              isSubmitting={isMutating}
              onCancelSession={(sessionId) => cancelSessionMutation.mutate(sessionId)}
              onCompleteSession={(sessionId) => completeSessionMutation.mutate(sessionId)}
              onEditSession={(sessionId) => setEditingSessionId(sessionId)}
              onOpenDetails={(sessionId) => setSelectedSessionId(sessionId)}
              sessions={filteredSessions}
            />
          </Stack>
        </SectionCard>
      </Stack>

      <SessionFormDialog
        isSubmitting={createSessionMutation.isPending}
        onClose={() => {
          createSessionMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        onSubmit={async (values) => {
          await createSessionMutation.mutateAsync({
            description: toNullableString(values.description),
            locationDetails: toNullableString(values.locationDetails),
            locationType: values.locationType ? values.locationType : null,
            meetingUrl: toNullableString(values.meetingUrl),
            scheduledEndAt: toNullableIsoDateTime(values.scheduledEndAt),
            scheduledStartAt: toNullableIsoDateTime(values.scheduledStartAt),
            status: values.status,
            summaryPrivate: toNullableString(values.summaryPrivate),
            summaryPublic: toNullableString(values.summaryPublic),
            title: values.title.trim(),
          });
          createSessionMutation.reset();
          setIsCreateDialogOpen(false);
        }}
        open={isCreateDialogOpen}
        submitError={createSessionMutation.error?.message ?? null}
      />

      <SessionFormDialog
        disableSubmitReason={
          sessionDetailsQuery.data?.status === "COMPLETED"
            ? "Completed sessions are read-only in the current backend."
            : sessionDetailsQuery.data?.status === "CANCELLED"
              ? "Cancelled sessions are read-only in the current backend. Restoring them requires backend support."
              : null
        }
        initialSession={editingSessionId ? sessionDetailsQuery.data ?? null : null}
        isSubmitting={updateSessionMutation.isPending || sessionDetailsQuery.isLoading}
        onClose={() => {
          updateSessionMutation.reset();
          setEditingSessionId(null);
        }}
        onSubmit={async (values) => {
          if (!editingSessionId) {
            return;
          }

          await updateSessionMutation.mutateAsync({
            payload: {
              description: toNullableString(values.description),
              locationDetails: toNullableString(values.locationDetails),
              locationType: values.locationType ? values.locationType : null,
              meetingUrl: toNullableString(values.meetingUrl),
              scheduledEndAt: toNullableIsoDateTime(values.scheduledEndAt),
              scheduledStartAt: toNullableIsoDateTime(values.scheduledStartAt),
              status: values.status,
              summaryPrivate: toNullableString(values.summaryPrivate),
              summaryPublic: toNullableString(values.summaryPublic),
              title: values.title.trim(),
            },
            sessionId: editingSessionId,
          });
          updateSessionMutation.reset();
          setEditingSessionId(null);
        }}
        open={Boolean(editingSessionId)}
        submitError={updateSessionMutation.error?.message ?? null}
      />

      <SessionDetailsDialog
        canManageSessions={canManage}
        isSubmitting={confirmSessionAttendanceMutation.isPending || declineSessionAttendanceMutation.isPending}
        onClose={() => setSelectedSessionId(null)}
        onConfirmAttendance={() => {
          if (selectedSessionId) {
            confirmSessionAttendanceMutation.mutate(selectedSessionId);
          }
        }}
        onDeclineAttendance={() => {
          if (selectedSessionId) {
            declineSessionAttendanceMutation.mutate(selectedSessionId);
          }
        }}
        open={Boolean(selectedSessionId)}
        session={selectedSessionId ? sessionDetailsQuery.data ?? null : null}
      />
    </>
  );
}
