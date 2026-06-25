import { Icon } from "@iconify/react";
import { Alert, Box, Button, MenuItem, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

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
import { CampaignSessionsFeaturedCard } from "@/features/sessions/ui/CampaignSessionsFeaturedCard";
import { CampaignSessionsList } from "@/features/sessions/ui/CampaignSessionsList";
import { SessionDetailsDialog } from "@/features/sessions/ui/SessionDetailsDialog";
import { SessionFormDialog } from "@/features/sessions/ui/SessionFormDialog";
import { SessionStatusFilterBar } from "@/features/sessions/ui/SessionStatusFilterBar";
import type { SessionFilterValue, SessionSortValue } from "@/features/sessions/ui/sessionUi.utils";
import {
  formatSessionSortLabel,
  isSessionFilterMatch,
} from "@/features/sessions/ui/sessionUi.utils";
import { ErrorState, LoadingScreen } from "@/shared/components";

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

function sortSessions(
  sessions: ReturnType<typeof useCampaignSessionsQuery>["data"] extends infer T
    ? T extends Array<infer U>
      ? U[]
      : never
    : never,
  sortValue: SessionSortValue,
) {
  return [...sessions].sort((left, right) => {
    if (sortValue === "TITLE") {
      return left.title.localeCompare(right.title);
    }

    if (sortValue === "RECENT") {
      return new Date(right.updatedAt).getTime() - new Date(left.updatedAt).getTime();
    }

    const leftTime = left.scheduledStartAt
      ? new Date(left.scheduledStartAt).getTime()
      : Number.MAX_SAFE_INTEGER;
    const rightTime = right.scheduledStartAt
      ? new Date(right.scheduledStartAt).getTime()
      : Number.MAX_SAFE_INTEGER;

    return leftTime - rightTime;
  });
}

export function CampaignSessionsPage() {
  const { campaignId } = useParams<{ campaignId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
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
  const [highlightedSessionId, setHighlightedSessionId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<SessionFilterValue>("ALL");
  const [sortValue, setSortValue] = useState<SessionSortValue>("UPCOMING");
  const sessionDetailsQuery = useSessionDetailsQuery(
    campaignId,
    selectedSessionId ?? editingSessionId,
  );

  const pageError = useMemo(() => {
    if (campaignDetailsQuery.isError) {
      return campaignDetailsQuery.error.message;
    }

    if (sessionsQuery.isError) {
      return sessionsQuery.error.message;
    }

    return null;
  }, [
    campaignDetailsQuery.error,
    campaignDetailsQuery.isError,
    sessionsQuery.error,
    sessionsQuery.isError,
  ]);
  const canManage = canManageSessions(campaignDetailsQuery.data?.role);
  const actionMutationError =
    cancelSessionMutation.error?.message ??
    completeSessionMutation.error?.message ??
    confirmSessionAttendanceMutation.error?.message ??
    declineSessionAttendanceMutation.error?.message ??
    null;
  const routedHighlightedSessionId =
    typeof location.state === "object" &&
    location.state !== null &&
    "highlightedSessionId" in location.state &&
    typeof (location.state as { highlightedSessionId?: unknown }).highlightedSessionId === "string"
      ? ((location.state as { highlightedSessionId: string }).highlightedSessionId ?? null)
      : null;

  const activeHighlightedSessionId = routedHighlightedSessionId ?? highlightedSessionId;
  const allSessions = useMemo(() => sessionsQuery.data ?? [], [sessionsQuery.data]);
  const filteredSessions = allSessions.filter((session) =>
    isSessionFilterMatch(session.status, statusFilter),
  );
  const sortedSessions = useMemo(
    () => sortSessions(filteredSessions, sortValue),
    [filteredSessions, sortValue],
  );
  const featuredSession = useMemo(() => {
    const eligible = allSessions.filter(
      (session) => session.status !== "COMPLETED" && session.status !== "CANCELLED",
    );

    return (
      sortSessions(eligible, "UPCOMING")[0] ?? sortSessions(allSessions, "UPCOMING")[0] ?? null
    );
  }, [allSessions]);

  const isMutating =
    createSessionMutation.isPending ||
    updateSessionMutation.isPending ||
    cancelSessionMutation.isPending ||
    completeSessionMutation.isPending ||
    confirmSessionAttendanceMutation.isPending ||
    declineSessionAttendanceMutation.isPending;

  useEffect(() => {
    if (!highlightedSessionId) {
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      setHighlightedSessionId(null);
    }, 2200);

    return () => window.clearTimeout(timeoutId);
  }, [highlightedSessionId]);

  useEffect(() => {
    if (!routedHighlightedSessionId) {
      return undefined;
    }

    const scrollTimeoutId = window.setTimeout(() => {
      const element = document.getElementById(`session-card-${routedHighlightedSessionId}`);
      element?.scrollIntoView({ behavior: "smooth", block: "center" });
      setHighlightedSessionId(routedHighlightedSessionId);
      navigate(location.pathname, { replace: true, state: null });
    }, 10);

    return () => window.clearTimeout(scrollTimeoutId);
  }, [location.pathname, navigate, routedHighlightedSessionId]);

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

  return (
    <>
      <Stack spacing={3.5}>
        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2.5}
          sx={{
            alignItems: { xl: "flex-end" },
            borderBottom: "1px solid rgba(188, 128, 52, 0.16)",
            justifyContent: "space-between",
            pb: 3,
          }}
        >
          <Stack spacing={1}>
            <Typography
              sx={{
                color: "#f3e5cc",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: { xs: "2.45rem", md: "3.4rem" },
                lineHeight: 0.98,
              }}
            >
              Campaign sessions
            </Typography>
            <Typography color="text.secondary" sx={{ maxWidth: 780 }} variant="body1">
              Plan upcoming gatherings, track attendance, and keep public or private recaps attached
              to each session.
            </Typography>
          </Stack>

          {canManage ? (
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              startIcon={<Icon icon="mingcute:calendar-add-fill" />}
              variant="contained"
            >
              Schedule session
            </Button>
          ) : null}
        </Stack>

        {actionMutationError ? <Alert severity="error">{actionMutationError}</Alert> : null}

        <Stack
          direction={{ xs: "column", xl: "row" }}
          spacing={2}
          sx={{ alignItems: { xl: "center" }, justifyContent: "space-between" }}
        >
          <SessionStatusFilterBar onChange={setStatusFilter} value={statusFilter} />

          <Stack
            direction="row"
            spacing={1.25}
            sx={{ alignItems: "center", justifyContent: "flex-end" }}
          >
            <Typography color="text.secondary" variant="body2">
              Sort by:
            </Typography>
            <TextField
              select
              size="small"
              sx={{ minWidth: 190 }}
              value={sortValue}
              onChange={(event) => setSortValue(event.target.value as SessionSortValue)}
            >
              <MenuItem value="UPCOMING">{formatSessionSortLabel("UPCOMING")}</MenuItem>
              <MenuItem value="RECENT">{formatSessionSortLabel("RECENT")}</MenuItem>
              <MenuItem value="TITLE">{formatSessionSortLabel("TITLE")}</MenuItem>
            </TextField>
          </Stack>
        </Stack>

        {featuredSession ? (
          <CampaignSessionsFeaturedCard
            canManageSessions={canManage}
            isSubmitting={isMutating}
            onCompleteSession={(sessionId) => completeSessionMutation.mutate(sessionId)}
            onEditSession={(sessionId) => setEditingSessionId(sessionId)}
            onOpenDetails={(sessionId) => setSelectedSessionId(sessionId)}
            session={featuredSession}
          />
        ) : null}

        <Stack spacing={1.5}>
          <Box>
            <Typography
              sx={{
                color: "#f1dfbd",
                fontFamily: '"Georgia", "Times New Roman", serif',
                fontSize: { xs: "2rem", md: "2.4rem" },
                lineHeight: 1.02,
              }}
            >
              All sessions
            </Typography>
          </Box>

          <CampaignSessionsList
            canManageSessions={canManage}
            highlightedSessionId={activeHighlightedSessionId}
            isSubmitting={isMutating}
            onCancelSession={(sessionId) => cancelSessionMutation.mutate(sessionId)}
            onCompleteSession={(sessionId) => completeSessionMutation.mutate(sessionId)}
            onEditSession={(sessionId) => setEditingSessionId(sessionId)}
            onOpenDetails={(sessionId) => setSelectedSessionId(sessionId)}
            sessions={sortedSessions}
          />
        </Stack>
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
        initialSession={editingSessionId ? (sessionDetailsQuery.data ?? null) : null}
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
        campaignId={campaignId}
        canManageSessions={canManage}
        isSubmitting={
          confirmSessionAttendanceMutation.isPending || declineSessionAttendanceMutation.isPending
        }
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
        session={selectedSessionId ? (sessionDetailsQuery.data ?? null) : null}
      />
    </>
  );
}
