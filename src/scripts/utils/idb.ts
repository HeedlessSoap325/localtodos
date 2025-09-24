import type {EncryptedRoot, SavedRoot} from "./types.ts";

const DB_NAME = "super-tree-db";
const STORE_NAME = "envelopes";
const DB_VERSION = 1;

function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = () => {
            const db = req.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                const store = db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
                store.createIndex("username_idx", "username", { unique: true });
            }
        };
        req.onsuccess = () => resolve(req.result);
        req.onerror = () => reject(req.error);
    });
}

export async function saveEncryptedForUser(
    username: string,
    envelope: EncryptedRoot,
    key?: IDBValidKey
): Promise<number> {
    const db = await openDB();
    return new Promise<number>((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const record = {
            username,
            envelope,
            createdAt: envelope.createdAt ?? Date.now(),
        };

        if (key !== undefined) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            record.id = key;
        }

        const req = store.put(record)
        req.onsuccess = () => resolve(req.result as number);
        req.onerror = () => reject(req.error);
    });
}

export async function getEncryptedForUserIfExists(username: string): Promise<SavedRoot | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const idx = store.index("username_idx");
        const req = idx.get(IDBKeyRange.only(username))
        req.onsuccess = () => {
            resolve(req.result as SavedRoot || null);
        };
        req.onerror = () => reject(req.error);
    });
}

export async function getEncryptedById(id: number): Promise<{ username: string; envelope: EncryptedRoot } | null> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readonly");
        const store = tx.objectStore(STORE_NAME);
        const req = store.get(id);
        req.onsuccess = () => {
            if (!req.result) return resolve(null);
            resolve({ username: req.result.username, envelope: req.result.envelope });
        };
        req.onerror = () => reject(req.error);
    });
}

export async function deleteById(id: number): Promise<void> {
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, "readwrite");
        const store = tx.objectStore(STORE_NAME);
        const req = store.delete(id);
        req.onsuccess = () => resolve();
        req.onerror = () => reject(req.error);
    });
}