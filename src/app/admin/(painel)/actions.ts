"use server";

import { del } from "@vercel/blob";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  createEvent,
  deleteEvent,
  getEventById,
  setEventPublished,
  updateEvent,
} from "@/lib/events";
import { passwordProblem, verifyPassword } from "@/lib/password";
import { createSession, destroySession, getCurrentUser, requireOwner, requireUser } from "@/lib/session";
import {
  changeOwnPassword,
  createEditor,
  findUserById,
  resetPassword,
  setUserActive,
} from "@/lib/users";
import {
  isUuid,
  isValidEmail,
  normalizeEmail,
  parseEventInput,
  type FieldErrors,
} from "@/lib/validation";

export type EventFormState = { errors?: FieldErrors };
export type PasswordState = { error?: string };
export type UserFormState = { error?: string; created?: { email: string; password: string } };

function refreshPublicPages(slug: string) {
  revalidatePath("/");
  revalidatePath(`/eventos/${slug}`);
  revalidatePath("/sitemap.xml");
}

// Falhar ao apagar a imagem antiga não deve desfazer a alteração já salva no evento.
async function removeBanner(url: string) {
  try {
    await del(url);
  } catch (error) {
    console.error("Não foi possível apagar o banner antigo", error);
  }
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function createEventAction(
  _: EventFormState,
  form: FormData,
): Promise<EventFormState> {
  await requireUser();
  const parsed = parseEventInput(form);
  if (!parsed.ok) return { errors: parsed.errors };
  const event = await createEvent(parsed.data);
  refreshPublicPages(event.slug);
  redirect("/admin");
}

export async function updateEventAction(
  id: string,
  _: EventFormState,
  form: FormData,
): Promise<EventFormState> {
  await requireUser();
  const parsed = parseEventInput(form);
  if (!parsed.ok) return { errors: parsed.errors };
  const previous = await getEventById(id);
  const event = await updateEvent(id, parsed.data);
  if (event) {
    refreshPublicPages(event.slug);
    if (previous && previous.banner_url !== event.banner_url) {
      await removeBanner(previous.banner_url);
    }
  }
  redirect("/admin");
}

export async function togglePublishedAction(id: string, published: boolean) {
  await requireUser();
  const event = await setEventPublished(id, published);
  if (event) refreshPublicPages(event.slug);
  revalidatePath("/admin");
}

export async function deleteEventAction(id: string) {
  await requireUser();
  const event = await deleteEvent(id);
  if (event) {
    refreshPublicPages(event.slug);
    await removeBanner(event.banner_url);
  }
  revalidatePath("/admin");
}

// Usa getCurrentUser, e não requireUser: é a única ação liberada para quem ainda
// precisa trocar a senha temporária.
export async function changePasswordAction(
  _: PasswordState,
  form: FormData,
): Promise<PasswordState> {
  const current = await getCurrentUser();
  if (!current) redirect("/admin/login");

  const currentPassword = String(form.get("currentPassword") ?? "");
  const newPassword = String(form.get("newPassword") ?? "");
  const confirmation = String(form.get("confirmation") ?? "");

  const user = await findUserById(current.id);
  if (!user || !(await verifyPassword(currentPassword.slice(0, 200), user.password_hash))) {
    return { error: "A senha atual está incorreta." };
  }
  if (newPassword !== confirmation) return { error: "A confirmação não é igual à nova senha." };
  if (newPassword === currentPassword) return { error: "A nova senha precisa ser diferente." };
  const problem = passwordProblem(newPassword, user.email);
  if (problem) return { error: problem };

  // Encerra as sessões em outros aparelhos e abre uma nova neste.
  await changeOwnPassword(user.id, newPassword);
  await createSession(user.id);
  redirect("/admin");
}

export async function createUserAction(_: UserFormState, form: FormData): Promise<UserFormState> {
  await requireOwner();
  const email = normalizeEmail(String(form.get("email") ?? ""));
  const name = String(form.get("name") ?? "").trim();
  if (name.length < 2 || name.length > 100) return { error: "Informe o nome da pessoa." };
  if (!isValidEmail(email)) return { error: "Informe um e-mail válido." };

  const created = await createEditor(email, name);
  if (!created) return { error: "Já existe um usuário com este e-mail." };
  revalidatePath("/admin/usuarios");
  return { created: { email, password: created.password } };
}

export async function setUserActiveAction(id: string, active: boolean) {
  await requireOwner();
  if (!isUuid(id)) return;
  await setUserActive(id, active);
  revalidatePath("/admin/usuarios");
}

export async function resetUserPasswordAction(
  id: string,
  _: UserFormState,
): Promise<UserFormState> {
  await requireOwner();
  if (!isUuid(id)) return { error: "Usuário inválido." };
  const user = await findUserById(id);
  if (!user || user.role === "owner") return { error: "Usuário inválido." };
  const password = await resetPassword(id);
  revalidatePath("/admin/usuarios");
  return { created: { email: user.email, password } };
}
