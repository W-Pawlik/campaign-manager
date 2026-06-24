import type { CampaignChronicleEntry } from "@/features/campaigns";
import type {
  ChronicleConflictReason,
  ChronicleEntryView,
  ChronicleSyncState,
  CreateChronicleEntryPayload,
  UpdateChronicleEntryPayload,
} from "@/features/chronicle/model/chronicle.types";

const databaseName = "campaign-manager-offline";
const databaseVersion = 1;
const entriesStoreName = "chronicle_entries";
const operationsStoreName = "chronicle_operations";

export type StoredChronicleEntry = CampaignChronicleEntry & {
  baseUpdatedAt: string | null;
  campaignEntryKey: string;
  conflictReason: ChronicleConflictReason | null;
  offlineUpdatedAt: number;
  serverSnapshot: CampaignChronicleEntry | null;
  syncState: ChronicleSyncState;
};

export type ChronicleOfflineOperation = {
  baseUpdatedAt: string | null;
  campaignId: string;
  createdAt: number;
  entryId: string;
  id: string;
  payload: CreateChronicleEntryPayload | UpdateChronicleEntryPayload | null;
  type: "create" | "update" | "delete";
};

function entryKey(campaignId: string, entryId: string): string {
  return `${campaignId}:${entryId}`;
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = window.indexedDB.open(databaseName, databaseVersion);

    request.onupgradeneeded = () => {
      const database = request.result;

      if (!database.objectStoreNames.contains(entriesStoreName)) {
        const entriesStore = database.createObjectStore(entriesStoreName, { keyPath: "campaignEntryKey" });
        entriesStore.createIndex("by_campaign", "campaignId", { unique: false });
      }

      if (!database.objectStoreNames.contains(operationsStoreName)) {
        const operationsStore = database.createObjectStore(operationsStoreName, { keyPath: "id" });
        operationsStore.createIndex("by_campaign", "campaignId", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB could not be opened."));
  });
}

function runTransaction<T>(
  storeName: string,
  mode: IDBTransactionMode,
  executor: (store: IDBObjectStore) => Promise<T>,
): Promise<T> {
  return openDatabase().then(
    (database) =>
      new Promise<T>((resolve, reject) => {
        const transaction = database.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);

        executor(store)
          .then((result) => {
            transaction.oncomplete = () => {
              database.close();
              resolve(result);
            };
            transaction.onerror = () => {
              database.close();
              reject(transaction.error ?? new Error("IndexedDB transaction failed."));
            };
            transaction.onabort = () => {
              database.close();
              reject(transaction.error ?? new Error("IndexedDB transaction aborted."));
            };
          })
          .catch((error) => {
            database.close();
            reject(error);
          });
      }),
  );
}

function wrapRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error ?? new Error("IndexedDB request failed."));
  });
}

export function mapStoredChronicleEntryToView(entry: StoredChronicleEntry): ChronicleEntryView {
  return {
    ...entry,
    offlineMeta: {
      conflictReason: entry.conflictReason,
      hasServerVersion: Boolean(entry.serverSnapshot),
      syncState: entry.syncState,
    },
  };
}

export async function getStoredChronicleEntry(
  campaignId: string,
  entryId: string,
): Promise<StoredChronicleEntry | null> {
  return runTransaction(entriesStoreName, "readonly", async (store) => {
    const result = await wrapRequest(store.get(entryKey(campaignId, entryId)));

    return (result as StoredChronicleEntry | undefined) ?? null;
  });
}

export async function listStoredChronicleEntries(campaignId: string): Promise<StoredChronicleEntry[]> {
  return runTransaction(entriesStoreName, "readonly", async (store) => {
    const index = store.index("by_campaign");
    const result = await wrapRequest(index.getAll(campaignId));

    return (result as StoredChronicleEntry[] | undefined) ?? [];
  });
}

export async function putStoredChronicleEntry(entry: StoredChronicleEntry): Promise<void> {
  await runTransaction(entriesStoreName, "readwrite", async (store) => {
    await wrapRequest(store.put(entry));

    return undefined;
  });
}

export async function deleteStoredChronicleEntry(campaignId: string, entryId: string): Promise<void> {
  await runTransaction(entriesStoreName, "readwrite", async (store) => {
    await wrapRequest(store.delete(entryKey(campaignId, entryId)));

    return undefined;
  });
}

export async function replaceStoredChronicleEntryId(
  campaignId: string,
  previousEntryId: string,
  nextEntry: StoredChronicleEntry,
): Promise<void> {
  await runTransaction(entriesStoreName, "readwrite", async (store) => {
    await wrapRequest(store.delete(entryKey(campaignId, previousEntryId)));
    await wrapRequest(store.put(nextEntry));

    return undefined;
  });
}

export async function listChronicleOfflineOperations(
  campaignId?: string,
): Promise<ChronicleOfflineOperation[]> {
  return runTransaction(operationsStoreName, "readonly", async (store) => {
    if (!campaignId) {
      const result = await wrapRequest(store.getAll());

      return ((result as ChronicleOfflineOperation[] | undefined) ?? []).sort(
        (left, right) => left.createdAt - right.createdAt,
      );
    }

    const index = store.index("by_campaign");
    const result = await wrapRequest(index.getAll(campaignId));

    return ((result as ChronicleOfflineOperation[] | undefined) ?? []).sort(
      (left, right) => left.createdAt - right.createdAt,
    );
  });
}

export async function putChronicleOfflineOperation(operation: ChronicleOfflineOperation): Promise<void> {
  await runTransaction(operationsStoreName, "readwrite", async (store) => {
    await wrapRequest(store.put(operation));

    return undefined;
  });
}

export async function deleteChronicleOfflineOperation(operationId: string): Promise<void> {
  await runTransaction(operationsStoreName, "readwrite", async (store) => {
    await wrapRequest(store.delete(operationId));

    return undefined;
  });
}

export async function listChronicleCampaignsWithPendingOperations(): Promise<string[]> {
  const operations = await listChronicleOfflineOperations();

  return Array.from(new Set(operations.map((operation) => operation.campaignId)));
}
