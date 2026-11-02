import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { cache } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";

const SESSION_DAYS = 7;
const secure = process.env.NODE_ENV === "production";
const COOKIE_NAME = secure ? "__Host-photopro_sessao" : "photopro_sessao";

export type CurrentUser = {
  id: string;
  email: string;
  name: string;
  role: "owner" | "editor";
  must_change_password: boolean;
};

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  await query(`DELETE FROM sessions WHERE expires_at < now()`);
  await query(
    `INSERT INTO sessions (token_hash, user_id, expires_at)
     VALUES ($1, $2, now() + make_interval(days => $3))`,
    [hashToken(token), userId, SESSION_DAYS],
  );
  (await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    secure,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (token) await query(`DELETE FROM sessions WHERE token_hash = $1`, [hashToken(token)]);
  store.delete(COOKIE_NAME);
}

export const getCurrentUser = cache(async (): Promise<CurrentUser | null> => {
  const token = (await cookies()).get(COOKIE_NAME)?.value;
  if (!token) return null;
  const rows = await query<CurrentUser>(
    `SELECT u.id, u.email, u.name, u.role, u.must_change_password
     FROM sessions s JOIN users u ON u.id = s.user_id
     WHERE s.token_hash = $1 AND s.expires_at > now() AND u.active`,
    [hashToken(token)],
  );
  return rows[0] ?? null;
});

// Chamado no início de toda página e toda ação do painel, não só no layout:
// uma Server Action pode ser acionada diretamente, sem passar pelo layout.
export async function requireUser(): Promise<CurrentUser> {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (user.must_change_password) redirect("/admin/senha");
  return user;
}

export async function requireOwner(): Promise<CurrentUser> {
  const user = await requireUser();
  if (user.role !== "owner") redirect("/admin");
  return user;
}
