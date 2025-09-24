import type {EncryptedRoot} from "./types.ts";

const b64Encode = (arr: ArrayBuffer) =>
    btoa(String.fromCharCode(...new Uint8Array(arr)));
const b64Decode = (b64: string) =>
    Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder();

export async function generateRandomBytes(len: number): Promise<Uint8Array> {
    const buf = new Uint8Array(len);
    crypto.getRandomValues(buf);
    return buf;
}

export async function deriveKey(
    username: string,
    passphrase: string,
    salt?: Uint8Array,
    iterations = 150000,
): Promise<{ key: CryptoKey; salt: Uint8Array; iterations: number }> {
    const materialStr = `${username}:${passphrase}`;
    const material = textEncoder.encode(materialStr);

    const usedSalt = salt ?? (await generateRandomBytes(16));

    const baseKey = await crypto.subtle.importKey(
        "raw",
        material,
        { name: "PBKDF2" },
        false,
        ["deriveKey", "deriveBits"]
    );

    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: usedSalt,
            iterations,
            hash: "SHA-256",
        },
        baseKey,
        { name: "AES-GCM", length: 256 },
        true,
        ["encrypt", "decrypt"]
    );

    return { key: key, salt: usedSalt, iterations };
}

export async function encryptJSON(
    data: unknown,
    username: string,
    passphrase: string
): Promise<EncryptedRoot> {
    const plaintext = textEncoder.encode(JSON.stringify(data));

    const { key, salt, iterations: usedIterations } = await deriveKey(username, passphrase);
    const iv = await generateRandomBytes(12);

    const ciphertext = await crypto.subtle.encrypt(
        {
            name: "AES-GCM",
            iv,
        },
        key,
        plaintext
    );

    return {
        version: 1,
        kdf: "PBKDF2",
        hash: "SHA-256",
        iterations: usedIterations,
        salt: b64Encode(salt.buffer),
        iv: b64Encode(iv.buffer),
        ciphertext: b64Encode(ciphertext),
        createdAt: Date.now(),
    } as EncryptedRoot;

}

export async function decryptEnvelope<T = unknown>(
    envelope: EncryptedRoot,
    username: string,
    passphrase: string
): Promise<T> {
    if (envelope.kdf !== "PBKDF2" || envelope.hash !== "SHA-256") {
        throw new Error("Unsupported envelope KDF/hash");
    }

    const salt = b64Decode(envelope.salt);
    const iv = b64Decode(envelope.iv);
    const ciphertext = b64Decode(envelope.ciphertext);

    const { key } = await deriveKey(username, passphrase, salt, envelope.iterations);

    let plaintextBuf: ArrayBuffer;
    try {
        plaintextBuf = await crypto.subtle.decrypt(
            {
                name: "AES-GCM",
                iv,
            },
            key,
            ciphertext
        );
    } catch (err) {
        throw new Error(`Decryption failed (wrong credentials or corrupted data). Stacktrace: ${(err as Error).message}`);
    }

    const jsonStr = textDecoder.decode(plaintextBuf);
    return JSON.parse(jsonStr) as T;
}