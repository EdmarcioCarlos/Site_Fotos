import "server-only";
import { query } from "@/lib/db";
import { generatePassword, hashPassword } from "@/lib/password";

export type UserRow = {
  id: string;
  email: string;
  name: string;
  password_hash: string;
  role: "owner" | "editor";
  active: boolean;
  must_change_password: boolean;
};

export type UserSummary = Omit<UserRow, "password_hash">;

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT id, email, name, password_hash, role, active, must_change_password
     FROM users WHERE email = $1`,
    [email],
  );
  return rows[0] ?? null;
}

export async function findUserById(id: string): Promise<UserRow | null> {
  const rows = await query<UserRow>(
    `SELECT id, email, name, password_hash, role, active, must_change_password
     FROM users WHERE id = $1`,
    [id],
  );
  return rows[0] ?? null;
}

export function listUsers(): Promise<UserSummary[]> {
  return query<UserSummary>(
    `SELECT id, email, name, role, active, must_change_password
     FROM users ORDER BY role DESC, name`,
  );
}

// Pelo painel só se criam editores: o responsável (owner) é criado por npm run admin:create.
export async function createEditor(
  email: string,
  name: string,
): Promise<{ password: string } | null> {
  const password = generatePassword();
  const rows = await query(
    `INSERT INTO users (email, name, password_hash, role)
     VALUES ($1, $2, $3, 'editor')
     ON CONFLICT (email) DO NOTHING RETURNING id`,
    [email, name, await hashPassword(password)],
  );
  return rows.length ? { password } : null;
}

export async function revokeSessions(userId: string): Promise<void> {
  await query(`DELETE FROM sessions WHERE user_id = $1`, [userId]);
}

export async function setUserActive(userId: string, active: boolean): Promise<void> {
  await query(`UPDATE users SET active = $2 WHERE id = $1 AND role <> 'owner'`, [userId, active]);
  if (!active) await revokeSessions(userId);
}

export async function resetPassword(userId: string): Promise<string> {
  const password = generatePassword();
  await query(
    `UPDATE users SET password_hash = $2, must_change_password = true
     WHERE id = $1 AND role <> 'owner'`,
    [userId, await hashPassword(password)],
  );
  await revokeSessions(userId);
  return password;
}

export async function changeOwnPassword(userId: string, newPassword: string): Promise<void> {
  await query(`UPDATE users SET password_hash = $2, must_change_password = false WHERE id = $1`, [
    userId,
    await hashPassword(newPassword),
  ]);
  await revokeSessions(userId);
}
