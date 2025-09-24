import type {EncryptedRoot, SavedRoot, TodoSuper} from "./utils/types.ts";
import {decryptEnvelope, encryptJSON} from "./utils/crypto.ts";
import {
    getEncryptedById,
    getEncryptedForUserIfExists,
    saveEncryptedForUser
} from "./utils/idb.ts";

export async function handleSave(username: string, tree: TodoSuper[], passphrase: string): Promise<void>{
    try {
        const prev_saved: SavedRoot | null = await getEncryptedForUserIfExists(username);
        if (prev_saved != null) {
            const envelope: EncryptedRoot = await encryptJSON(tree, username, passphrase);

            const id = await saveEncryptedForUser(username, envelope, prev_saved.id);
            console.info(`Successfully updated encrypted data Tree for user ${username} with id ${id}`);
            console.assert(id === prev_saved.id);
        } else {
            const envelope = await encryptJSON(tree, username, passphrase);

            const id = await saveEncryptedForUser(username, envelope);
            console.info(`Successfully saved encrypted data Tree for user ${username} with id ${id}`);
        }
    } catch (err) {
        throw new Error(`Saving of data Tree failed. Stacktrace: ${err}`);
    }
}

export async function handleLoad(username: string, passphrase: string, setTree: (newTree: TodoSuper[]) => void): Promise<void> {
    try {
        const prev_saved: SavedRoot | null = await getEncryptedForUserIfExists(username);
        if(prev_saved != null) {
            const rec = await getEncryptedById(prev_saved.id);
            if (!rec) throw new Error("Not found");
            const data = await decryptEnvelope<TodoSuper[]>(rec.envelope, username, passphrase);
            setTree(data)
            console.info(`Successfully loaded data Tree with id ${prev_saved.id}`)
        }else {
            setTree([])
            console.info(`Could not find data tree for user ${username}, created new empty tree`)
        }
    } catch (err) {
        throw new Error(`Loading of data Tree failed. Stacktrace: ${(err as Error).message}`);
    }
}

export async function handleDelete(username: string, passphrase: string, clearTree: () => void): Promise<void> {
    try {
        const prev_saved: SavedRoot | null = await getEncryptedForUserIfExists(username);
        if(prev_saved != null) {
            const rec = await getEncryptedById(prev_saved.id);
            if (!rec) throw new Error("Not found");
            await decryptEnvelope<TodoSuper[]>(rec.envelope, username, passphrase); // Would throw an error, if the passphrase was wrong
            clearTree()
        }else {
            throw new Error(`Could not find previously saved data Tree for user ${username}`)
        }
    }catch (err){
        throw new Error(`Deleting of data Tree failed. Stacktrace: ${err}`);
    }
}