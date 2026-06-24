import { normalizeApiError } from "@/core/api/apiError";
import { campaignsApi } from "@/features/campaigns";
import type { CampaignChronicleEntry } from "@/features/campaigns";
import { chronicleApi } from "@/features/chronicle/api/chronicleApi";
import {
  deleteChronicleOfflineOperation,
  deleteStoredChronicleEntry,
  getStoredChronicleEntry,
  listChronicleCampaignsWithPendingOperations,
  listChronicleOfflineOperations,
  listStoredChronicleEntries,
  mapStoredChronicleEntryToView,
  putChronicleOfflineOperation,
  putStoredChronicleEntry,
  replaceStoredChronicleEntryId,
  type ChronicleOfflineOperation,
  type StoredChronicleEntry,
} from "@/features/chronicle/offline/chronicleOfflineDb";
import type {
  ChronicleEntryDetails,
  ChronicleEntryView,
  ChronicleSyncState,
  CreateChronicleEntryPayload,
  UpdateChronicleEntryPayload,
} from "@/features/chronicle/model/chronicle.types";

function isLikelyNetworkError(error: unknown): boolean {
  const normalized = normalizeApiError(error);

  return normalized.status === undefined;
}

function createLocalId(): string {
  return `local-${crypto.randomUUID()}`;
}

function createOperationId(): string {
  return `chronicle-op-${crypto.randomUUID()}`;
}

function nowIsoString(): string {
  return new Date().toISOString();
}

function mapServerEntryToStoredEntry(
  entry: CampaignChronicleEntry,
  overrides?: Partial<StoredChronicleEntry>,
): StoredChronicleEntry {
  return {
    ...entry,
    baseUpdatedAt: null,
    campaignEntryKey: `${entry.campaignId}:${entry.id}`,
    conflictReason: null,
    offlineUpdatedAt: Date.now(),
    serverSnapshot: null,
    syncState: "SYNCED",
    ...overrides,
  };
}

function buildOptimisticEntry(
  campaignId: string,
  payload: CreateChronicleEntryPayload,
): StoredChronicleEntry {
  const timestamp = nowIsoString();
  const entryId = createLocalId();

  return {
    campaignEntryKey: `${campaignId}:${entryId}`,
    campaignId,
    content: payload.content,
    createdAt: timestamp,
    createdById: "offline-user",
    id: entryId,
    inWorldDate: payload.inWorldDate ?? null,
    occurredAt: payload.occurredAt ?? null,
    offlineUpdatedAt: Date.now(),
    serverSnapshot: null,
    sessionId: payload.sessionId ?? null,
    syncState: "PENDING_CREATE",
    title: payload.title,
    updatedAt: timestamp,
    visibility: payload.visibility ?? "PUBLIC",
    baseUpdatedAt: null,
    conflictReason: null,
  };
}

function buildUpdatedEntry(
  entry: StoredChronicleEntry,
  payload: UpdateChronicleEntryPayload,
  syncState: ChronicleSyncState,
): StoredChronicleEntry {
  return {
    ...entry,
    content: payload.content ?? entry.content,
    inWorldDate: payload.inWorldDate === undefined ? entry.inWorldDate : payload.inWorldDate ?? null,
    occurredAt: payload.occurredAt === undefined ? entry.occurredAt : payload.occurredAt ?? null,
    offlineUpdatedAt: Date.now(),
    sessionId: payload.sessionId === undefined ? entry.sessionId : payload.sessionId ?? null,
    syncState,
    title: payload.title ?? entry.title,
    updatedAt: nowIsoString(),
    visibility: payload.visibility ?? entry.visibility,
  };
}

async function upsertOfflineOperation(operation: ChronicleOfflineOperation): Promise<void> {
  await putChronicleOfflineOperation(operation);
}

async function removeAllOperationsForEntry(campaignId: string, entryId: string): Promise<void> {
  const operations = await listChronicleOfflineOperations(campaignId);
  const matchingOperations = operations.filter((operation) => operation.entryId === entryId);

  await Promise.all(matchingOperations.map((operation) => deleteChronicleOfflineOperation(operation.id)));
}

async function mergeRemoteChronicleEntries(
  campaignId: string,
  remoteEntries: CampaignChronicleEntry[],
): Promise<ChronicleEntryView[]> {
  const localEntries = await listStoredChronicleEntries(campaignId);
  const localById = new Map(localEntries.map((entry) => [entry.id, entry]));
  const remoteIds = new Set(remoteEntries.map((entry) => entry.id));

  for (const remoteEntry of remoteEntries) {
    const localEntry = localById.get(remoteEntry.id);

    if (
      localEntry &&
      (localEntry.syncState === "PENDING_UPDATE" ||
        localEntry.syncState === "PENDING_DELETE" ||
        localEntry.syncState === "CONFLICT")
    ) {
      continue;
    }

    await putStoredChronicleEntry(mapServerEntryToStoredEntry(remoteEntry));
  }

  for (const localEntry of localEntries) {
    if (!remoteIds.has(localEntry.id) && localEntry.syncState === "SYNCED") {
      await deleteStoredChronicleEntry(campaignId, localEntry.id);
    }
  }

  const mergedEntries = await listStoredChronicleEntries(campaignId);

  return mergedEntries
    .filter((entry) => entry.syncState !== "PENDING_DELETE")
    .map(mapStoredChronicleEntryToView);
}

async function markConflict(
  entry: StoredChronicleEntry,
  reason: StoredChronicleEntry["conflictReason"],
  serverSnapshot: CampaignChronicleEntry | null,
): Promise<void> {
  await putStoredChronicleEntry({
    ...entry,
    conflictReason: reason,
    serverSnapshot,
    syncState: "CONFLICT",
  });
}

export const chronicleOfflineService = {
  async createEntry(campaignId: string, payload: CreateChronicleEntryPayload): Promise<ChronicleEntryView> {
    const localEntry = buildOptimisticEntry(campaignId, payload);

    await putStoredChronicleEntry(localEntry);
    await upsertOfflineOperation({
      baseUpdatedAt: null,
      campaignId,
      createdAt: Date.now(),
      entryId: localEntry.id,
      id: createOperationId(),
      payload,
      type: "create",
    });

    if (navigator.onLine) {
      await chronicleOfflineService.syncCampaign(campaignId);
      const syncedEntry = await getStoredChronicleEntry(campaignId, localEntry.id);

      if (syncedEntry) {
        return mapStoredChronicleEntryToView(syncedEntry);
      }

      const currentEntries = await listStoredChronicleEntries(campaignId);
      const latestEntry = currentEntries
        .filter((entry) => entry.title === localEntry.title)
        .sort((left, right) => right.offlineUpdatedAt - left.offlineUpdatedAt)[0];

      if (latestEntry) {
        return mapStoredChronicleEntryToView(latestEntry);
      }
    }

    return mapStoredChronicleEntryToView(localEntry);
  },

  async deleteEntry(campaignId: string, entryId: string): Promise<void> {
    const existingEntry = await getStoredChronicleEntry(campaignId, entryId);

    if (!existingEntry) {
      return;
    }

    if (existingEntry.syncState === "PENDING_CREATE") {
      await deleteStoredChronicleEntry(campaignId, entryId);
      await removeAllOperationsForEntry(campaignId, entryId);

      return;
    }

    await putStoredChronicleEntry({
      ...existingEntry,
      baseUpdatedAt: existingEntry.baseUpdatedAt ?? existingEntry.updatedAt,
      conflictReason: null,
      offlineUpdatedAt: Date.now(),
      syncState: "PENDING_DELETE",
    });

    await upsertOfflineOperation({
      baseUpdatedAt: existingEntry.baseUpdatedAt ?? existingEntry.updatedAt,
      campaignId,
      createdAt: Date.now(),
      entryId,
      id: createOperationId(),
      payload: null,
      type: "delete",
    });

    if (navigator.onLine) {
      await chronicleOfflineService.syncCampaign(campaignId);
    }
  },

  async getEntryDetails(campaignId: string, entryId: string): Promise<ChronicleEntryDetails> {
    const localEntry = await getStoredChronicleEntry(campaignId, entryId);

    if (navigator.onLine) {
      try {
        const remoteEntry = await chronicleApi.getChronicleEntryDetails(campaignId, entryId);
        const localPendingEntry = await getStoredChronicleEntry(campaignId, entryId);

        if (
          !localPendingEntry ||
          (localPendingEntry.syncState !== "PENDING_UPDATE" &&
            localPendingEntry.syncState !== "PENDING_DELETE" &&
            localPendingEntry.syncState !== "CONFLICT")
        ) {
          await putStoredChronicleEntry(mapServerEntryToStoredEntry(remoteEntry));

          return mapStoredChronicleEntryToView(mapServerEntryToStoredEntry(remoteEntry));
        }
      } catch (error) {
        if (!isLikelyNetworkError(error)) {
          throw error;
        }
      }
    }

    if (!localEntry) {
      throw new Error("Chronicle entry is not available offline yet.");
    }

    return mapStoredChronicleEntryToView(localEntry);
  },

  async listEntries(campaignId: string): Promise<ChronicleEntryView[]> {
    if (navigator.onLine) {
      try {
        const remoteEntries = await campaignsApi.listCampaignChronicle(campaignId);

        return mergeRemoteChronicleEntries(campaignId, remoteEntries);
      } catch (error) {
        if (!isLikelyNetworkError(error)) {
          throw error;
        }
      }
    }

    const localEntries = await listStoredChronicleEntries(campaignId);

    return localEntries
      .filter((entry) => entry.syncState !== "PENDING_DELETE")
      .map(mapStoredChronicleEntryToView);
  },

  async resolveConflictWithLocal(campaignId: string, entryId: string): Promise<ChronicleEntryView | null> {
    const entry = await getStoredChronicleEntry(campaignId, entryId);

    if (!entry || entry.syncState !== "CONFLICT") {
      return entry ? mapStoredChronicleEntryToView(entry) : null;
    }

    await removeAllOperationsForEntry(campaignId, entryId);

    if (entry.id.startsWith("local-")) {
      await upsertOfflineOperation({
        baseUpdatedAt: null,
        campaignId,
        createdAt: Date.now(),
        entryId,
        id: createOperationId(),
        payload: {
          content: entry.content,
          inWorldDate: entry.inWorldDate,
          occurredAt: entry.occurredAt,
          sessionId: entry.sessionId,
          title: entry.title,
          visibility: entry.visibility as CreateChronicleEntryPayload["visibility"],
        },
        type: "create",
      });
      await putStoredChronicleEntry({
        ...entry,
        conflictReason: null,
        serverSnapshot: null,
        syncState: "PENDING_CREATE",
      });
    } else {
      await upsertOfflineOperation({
        baseUpdatedAt: entry.serverSnapshot?.updatedAt ?? entry.updatedAt,
        campaignId,
        createdAt: Date.now(),
        entryId,
        id: createOperationId(),
        payload: {
          content: entry.content,
          inWorldDate: entry.inWorldDate,
          occurredAt: entry.occurredAt,
          sessionId: entry.sessionId,
          title: entry.title,
          visibility: entry.visibility as UpdateChronicleEntryPayload["visibility"],
        },
        type: "update",
      });
      await putStoredChronicleEntry({
        ...entry,
        baseUpdatedAt: entry.serverSnapshot?.updatedAt ?? entry.updatedAt,
        conflictReason: null,
        syncState: "PENDING_UPDATE",
      });
    }

    if (navigator.onLine) {
      await chronicleOfflineService.syncCampaign(campaignId);
    }

    const nextEntry = await getStoredChronicleEntry(campaignId, entryId);

    return nextEntry ? mapStoredChronicleEntryToView(nextEntry) : null;
  },

  async resolveConflictWithServer(campaignId: string, entryId: string): Promise<ChronicleEntryView | null> {
    const entry = await getStoredChronicleEntry(campaignId, entryId);

    if (!entry || entry.syncState !== "CONFLICT") {
      return entry ? mapStoredChronicleEntryToView(entry) : null;
    }

    await removeAllOperationsForEntry(campaignId, entryId);

    if (!entry.serverSnapshot) {
      await deleteStoredChronicleEntry(campaignId, entryId);

      return null;
    }

    const syncedEntry = mapServerEntryToStoredEntry(entry.serverSnapshot);
    await putStoredChronicleEntry(syncedEntry);

    return mapStoredChronicleEntryToView(syncedEntry);
  },

  async syncAllPending(): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    const campaignIds = await listChronicleCampaignsWithPendingOperations();

    for (const campaignId of campaignIds) {
      await chronicleOfflineService.syncCampaign(campaignId);
    }
  },

  async syncCampaign(campaignId: string): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    const operations = await listChronicleOfflineOperations(campaignId);

    for (const operation of operations) {
      const entry = await getStoredChronicleEntry(operation.campaignId, operation.entryId);

      try {
        if (operation.type === "create") {
          const remoteEntry = await chronicleApi.createChronicleEntry(
            operation.campaignId,
            operation.payload as CreateChronicleEntryPayload,
          );

          if (entry) {
            await replaceStoredChronicleEntryId(
              operation.campaignId,
              operation.entryId,
              mapServerEntryToStoredEntry(remoteEntry),
            );
          }

          await deleteChronicleOfflineOperation(operation.id);
          continue;
        }

        if (!entry) {
          await deleteChronicleOfflineOperation(operation.id);
          continue;
        }

        if (operation.type === "update") {
          const remoteEntry = await chronicleApi.getChronicleEntryDetails(operation.campaignId, operation.entryId);

          if (operation.baseUpdatedAt && remoteEntry.updatedAt !== operation.baseUpdatedAt) {
            await markConflict(entry, "REMOTE_UPDATED", remoteEntry);
            await deleteChronicleOfflineOperation(operation.id);
            continue;
          }

          const savedEntry = await chronicleApi.updateChronicleEntry(
            operation.campaignId,
            operation.entryId,
            operation.payload as UpdateChronicleEntryPayload,
          );

          await putStoredChronicleEntry(mapServerEntryToStoredEntry(savedEntry));
          await deleteChronicleOfflineOperation(operation.id);
          continue;
        }

        if (operation.type === "delete") {
          let remoteEntry: CampaignChronicleEntry | null = null;

          try {
            remoteEntry = await chronicleApi.getChronicleEntryDetails(operation.campaignId, operation.entryId);
          } catch (error) {
            const normalized = normalizeApiError(error);

            if (normalized.status === 404) {
              await deleteStoredChronicleEntry(operation.campaignId, operation.entryId);
              await deleteChronicleOfflineOperation(operation.id);
              continue;
            }

            throw error;
          }

          if (operation.baseUpdatedAt && remoteEntry.updatedAt !== operation.baseUpdatedAt) {
            await markConflict(entry, "REMOTE_UPDATED", remoteEntry);
            await deleteChronicleOfflineOperation(operation.id);
            continue;
          }

          await chronicleApi.deleteChronicleEntry(operation.campaignId, operation.entryId);
          await deleteStoredChronicleEntry(operation.campaignId, operation.entryId);
          await deleteChronicleOfflineOperation(operation.id);
        }
      } catch (error) {
        if (isLikelyNetworkError(error)) {
          break;
        }

        if (entry) {
          await markConflict(entry, "SYNC_FAILED", entry.serverSnapshot);
        }

        await deleteChronicleOfflineOperation(operation.id);
      }
    }

    try {
      const remoteEntries = await campaignsApi.listCampaignChronicle(campaignId);
      await mergeRemoteChronicleEntries(campaignId, remoteEntries);
    } catch (error) {
      if (!isLikelyNetworkError(error)) {
        throw error;
      }
    }
  },

  async updateEntry(
    campaignId: string,
    entryId: string,
    payload: UpdateChronicleEntryPayload,
  ): Promise<ChronicleEntryView> {
    const existingEntry = await getStoredChronicleEntry(campaignId, entryId);

    if (!existingEntry) {
      throw new Error("Chronicle entry is not available locally.");
    }

    if (existingEntry.syncState === "PENDING_CREATE") {
      const updatedEntry = buildUpdatedEntry(existingEntry, payload, "PENDING_CREATE");

      await putStoredChronicleEntry(updatedEntry);
      await removeAllOperationsForEntry(campaignId, entryId);
      await upsertOfflineOperation({
        baseUpdatedAt: null,
        campaignId,
        createdAt: Date.now(),
        entryId,
        id: createOperationId(),
        payload: {
          content: updatedEntry.content,
          inWorldDate: updatedEntry.inWorldDate,
          occurredAt: updatedEntry.occurredAt,
          sessionId: updatedEntry.sessionId,
          title: updatedEntry.title,
          visibility: updatedEntry.visibility as CreateChronicleEntryPayload["visibility"],
        },
        type: "create",
      });

      return mapStoredChronicleEntryToView(updatedEntry);
    }

    const updatedEntry = buildUpdatedEntry(existingEntry, payload, "PENDING_UPDATE");

    await putStoredChronicleEntry({
      ...updatedEntry,
      baseUpdatedAt: existingEntry.baseUpdatedAt ?? existingEntry.updatedAt,
      conflictReason: null,
      serverSnapshot: null,
    });

    await removeAllOperationsForEntry(campaignId, entryId);
    await upsertOfflineOperation({
      baseUpdatedAt: existingEntry.baseUpdatedAt ?? existingEntry.updatedAt,
      campaignId,
      createdAt: Date.now(),
      entryId,
      id: createOperationId(),
      payload,
      type: "update",
    });

    if (navigator.onLine) {
      await chronicleOfflineService.syncCampaign(campaignId);
      const syncedEntry = await getStoredChronicleEntry(campaignId, entryId);

      if (syncedEntry) {
        return mapStoredChronicleEntryToView(syncedEntry);
      }
    }

    const latestEntry = await getStoredChronicleEntry(campaignId, entryId);

    if (!latestEntry) {
      throw new Error("Chronicle entry disappeared while updating.");
    }

    return mapStoredChronicleEntryToView(latestEntry);
  },
} as const;
