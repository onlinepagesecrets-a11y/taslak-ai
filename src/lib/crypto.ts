import crypto from "crypto";

// Kullanıcıların kendi Replicate API anahtarlarını veritabanında düz metin
// olarak saklamamak için AES-256-GCM ile şifreler/çözer.
// API_KEY_ENCRYPTION_SECRET: base64, 32 byte (256 bit) — .env içinde tutulur.

const ALGORITHM = "aes-256-gcm";

function getKey(): Buffer {
  const secret = process.env.API_KEY_ENCRYPTION_SECRET;
  if (!secret) {
    throw new Error("API_KEY_ENCRYPTION_SECRET tanımlı değil.");
  }
  const key = Buffer.from(secret, "base64");
  if (key.length !== 32) {
    throw new Error("API_KEY_ENCRYPTION_SECRET 32 byte (base64) olmalı.");
  }
  return key;
}

export function encryptSecret(plainText: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv);
  const encrypted = Buffer.concat([cipher.update(plainText, "utf8"), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return [iv.toString("base64"), authTag.toString("base64"), encrypted.toString("base64")].join(".");
}

export function decryptSecret(payload: string): string {
  const [ivB64, authTagB64, dataB64] = payload.split(".");
  if (!ivB64 || !authTagB64 || !dataB64) {
    throw new Error("Şifrelenmiş anahtar formatı geçersiz.");
  }
  const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(authTagB64, "base64"));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(dataB64, "base64")),
    decipher.final(),
  ]);
  return decrypted.toString("utf8");
}

// Panelde göstermek için: sk_live_ab12...ef90 gibi maskeli önizleme.
export function maskApiKey(key: string): string {
  if (key.length <= 8) return "••••••••";
  return `${key.slice(0, 6)}••••${key.slice(-4)}`;
}
