// Sem imports do Next: também é usado por scripts/create-admin.mjs.
import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

const N = 32768;
const R = 8;
const P = 1;
const KEY_LENGTH = 64;
const MAX_MEMORY = 128 * 1024 * 1024;

const MIN_PASSWORD_LENGTH = 12;
export const MAX_PASSWORD_LENGTH = 200;

function derive(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, KEY_LENGTH, { N: n, r, p, maxmem: MAX_MEMORY }, (error, key) => {
      if (error) reject(error);
      else resolve(key);
    });
  });
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derive(password, salt, N, R, P);
  return ["scrypt", N, R, P, salt.toString("base64url"), key.toString("base64url")].join(":");
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, n, r, p, salt, key] = stored.split(":");
  if (scheme !== "scrypt" || !key) return false;
  const expected = Buffer.from(key, "base64url");
  const actual = await derive(
    password,
    Buffer.from(salt, "base64url"),
    Number(n),
    Number(r),
    Number(p),
  );
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export function generatePassword(): string {
  return randomBytes(15).toString("base64url");
}

export function passwordProblem(password: string, email: string): string | null {
  if (password.length < MIN_PASSWORD_LENGTH) {
    return `A senha precisa ter pelo menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }
  if (password.length > MAX_PASSWORD_LENGTH) {
    return `A senha pode ter no máximo ${MAX_PASSWORD_LENGTH} caracteres.`;
  }
  if (new Set(password).size < 5) return "A senha é muito repetitiva.";
  const lower = password.toLowerCase();
  const localPart = email.toLowerCase().split("@")[0];
  if (localPart.length >= 4 && lower.includes(localPart)) {
    return "A senha não pode conter o seu e-mail.";
  }
  if (["123456", "password", "senha123", "photopro", "qwerty"].some((w) => lower.includes(w))) {
    return "A senha contém uma sequência muito comum.";
  }
  return null;
}
