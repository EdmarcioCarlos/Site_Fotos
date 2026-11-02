import "server-only";
import { createHash } from "node:crypto";
import { query } from "@/lib/db";

const WINDOW_MINUTES = 15;

export type Limit = { key: string; max: number };

// Guardado como hash para não manter e-mails e IPs legíveis nesta tabela.
export function loginLimits(email: string, ip: string): Limit[] {
  const hash = (value: string) => createHash("sha256").update(value).digest("hex");
  return [
    { key: hash(`conta:${email}:${ip}`), max: 5 },
    { key: hash(`ip:${ip}`), max: 20 },
  ];
}

export async function isBlocked(limits: Limit[]): Promise<boolean> {
  await query(`DELETE FROM login_attempts WHERE window_started < now() - interval '1 day'`);
  const rows = await query<{ key: string; failures: number }>(
    `SELECT key, failures FROM login_attempts
     WHERE key = ANY($1) AND window_started > now() - make_interval(mins => $2)`,
    [limits.map((limit) => limit.key), WINDOW_MINUTES],
  );
  return rows.some((row) => {
    const limit = limits.find((l) => l.key === row.key);
    return limit !== undefined && row.failures >= limit.max;
  });
}

export async function recordFailure(limits: Limit[]): Promise<void> {
  for (const { key } of limits) {
    await query(
      `INSERT INTO login_attempts (key, failures, window_started) VALUES ($1, 1, now())
       ON CONFLICT (key) DO UPDATE SET
         failures = CASE WHEN login_attempts.window_started > now() - make_interval(mins => $2)
                         THEN login_attempts.failures + 1 ELSE 1 END,
         window_started = CASE WHEN login_attempts.window_started > now() - make_interval(mins => $2)
                               THEN login_attempts.window_started ELSE now() END`,
      [key, WINDOW_MINUTES],
    );
  }
}

// Só zera o contador da conta: um login certo não libera quem testa muitas contas pelo mesmo IP.
export async function clearAccountFailures(limits: Limit[]): Promise<void> {
  await query(`DELETE FROM login_attempts WHERE key = $1`, [limits[0].key]);
}
