import CryptoJS from "crypto-js";

const ENCRYPTION_KEY = "rkejwhiuh@CsZbdfjs78fu!qw8uiqehfuih5";

export function getCurrentUserId(token: string): string | null {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    const payload = JSON.parse(jsonPayload);
    const userId =
      payload?.[
        "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
      ] ||
      payload?.sub ||
      null;
    return userId;
  } catch (e) {
    console.warn("Error extracting user ID from token", e);
    return null;
  }
}

export function encrypt(plainText: string): string {
  if (!plainText) return plainText;
  const key = CryptoJS.enc.Utf8.parse(
    ENCRYPTION_KEY.padEnd(32).substring(0, 32),
  );
  let iv;
  try {
    iv = CryptoJS.lib.WordArray.random(16);
  } catch (e) {
    const words: number[] = [];
    for (let i = 0; i < 16; i += 4) {
      words.push((Math.random() * 0x100000000) | 0);
    }
    iv = CryptoJS.lib.WordArray.create(words, 16);
  }
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  const combined = iv.clone().concat(encrypted.ciphertext);
  return CryptoJS.enc.Base64.stringify(combined);
}

export function decrypt(cipherText: string): string {
  if (!cipherText) return cipherText;
  try {
    const combined = CryptoJS.enc.Base64.parse(cipherText);
    const ivWords: number[] = [];
    for (let i = 0; i < 4; i++) {
      ivWords.push(combined.words[i]);
    }
    const iv = CryptoJS.lib.WordArray.create(ivWords, 16);
    const cipherWords: number[] = [];
    for (let i = 4; i < combined.words.length; i++) {
      cipherWords.push(combined.words[i]);
    }
    const ciphertext = CryptoJS.lib.WordArray.create(
      cipherWords,
      combined.sigBytes - 16,
    );
    const key = CryptoJS.enc.Utf8.parse(
      ENCRYPTION_KEY.padEnd(32).substring(0, 32),
    );
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext } as any,
      key,
      { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 },
    );
    return CryptoJS.enc.Utf8.stringify(decrypted);
  } catch (e) {
    console.warn("Decryption failed, returning original text", e);
    return cipherText;
  }
}
