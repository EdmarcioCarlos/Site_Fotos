"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { MAX_PASSWORD_LENGTH, hashPassword, verifyPassword } from "@/lib/password";
import { clearAccountFailures, isBlocked, loginLimits, recordFailure } from "@/lib/rate-limit";
import { createSession } from "@/lib/session";
import { findUserByEmail } from "@/lib/users";
import { normalizeEmail } from "@/lib/validation";

export type LoginState = { error?: string };

const INVALID = "E-mail ou senha incorretos.";

// Comparado quando o e-mail não existe, para o tempo de resposta não revelar quais contas existem.
const decoyHash = hashPassword("senha-inexistente-para-comparacao");

export async function loginAction(_: LoginState, form: FormData): Promise<LoginState> {
  const email = normalizeEmail(String(form.get("email") ?? ""));
  const password = String(form.get("password") ?? "");

  const headerList = await headers();
  const ip =
    headerList.get("x-real-ip") ??
    headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "desconhecido";
  const limits = loginLimits(email, ip);

  if (await isBlocked(limits)) {
    return { error: "Muitas tentativas. Aguarde 15 minutos e tente de novo." };
  }

  const user = await findUserByEmail(email);
  const validLength = password.length > 0 && password.length <= MAX_PASSWORD_LENGTH;
  const matches =
    (await verifyPassword(
      validLength ? password : "",
      user?.password_hash ?? (await decoyHash),
    )) && validLength;

  if (!user || !user.active || !matches) {
    await recordFailure(limits);
    return { error: INVALID };
  }

  await clearAccountFailures(limits);
  await createSession(user.id);
  redirect(user.must_change_password ? "/admin/senha" : "/admin");
}
