
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from "crypto";

function getEncryptionKey(): Buffer {
  const secret = process.env.GOOGLE_TOKEN_ENCRYPTION_KEY;

  if (!secret) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY is not configured."
    );
  }

  const key = Buffer.from(secret, "base64");

  if (key.length !== 32) {
    throw new Error(
      "GOOGLE_TOKEN_ENCRYPTION_KEY must decode to exactly 32 bytes."
    );
  }

  return key;
}

export function encryptToken(token: string): string {
  const key = getEncryptionKey();
  const iv = randomBytes(12);

  const cipher = createCipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  const encrypted = Buffer.concat([
    cipher.update(token, "utf8"),
    cipher.final(),
  ]);

  const authTag = cipher.getAuthTag();

  return [
    iv.toString("base64"),
    authTag.toString("base64"),
    encrypted.toString("base64"),
  ].join(":");
}

export function decryptToken(
  encryptedToken: string
): string {
  const key = getEncryptionKey();

  const [ivPart, authTagPart, encryptedPart] =
    encryptedToken.split(":");

  if (!ivPart || !authTagPart || !encryptedPart) {
    throw new Error("Invalid encrypted token format.");
  }

  const iv = Buffer.from(ivPart, "base64");
  const authTag = Buffer.from(authTagPart, "base64");
  const encrypted = Buffer.from(encryptedPart, "base64");

  const decipher = createDecipheriv(
    "aes-256-gcm",
    key,
    iv
  );

  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
}
