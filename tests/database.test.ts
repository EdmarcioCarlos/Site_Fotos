import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const db = new PGlite();

vi.mock("@/lib/db", () => ({
  query: async (text: string, params: unknown[] = []) => (await db.query(text, params)).rows,
}));

const {
  createEvent,
  deleteEvent,
  getPublishedEventBySlug,
  listEventsForSitemap,
  listPublishedEvents,
  updateEvent,
} = await import("@/lib/events");
const { clearAccountFailures, isBlocked, loginLimits, recordFailure } =
  await import("@/lib/rate-limit");
const { changeOwnPassword, createEditor, findUserByEmail, resetPassword, setUserActive } =
  await import("@/lib/users");

const input = {
  name: "Copa de Vôlei",
  description: "Final da copa.",
  address: "Ginásio",
  city: "Campo Grande",
  eventDate: "2026-10-30",
  bannerUrl: "https://abc.public.blob.vercel-storage.com/a.jpg",
  salesUrl: "https://loja.exemplo.com",
  published: true,
  details: "",
  hideAds: false,
};

beforeAll(async () => {
  await db.exec(readFileSync("db/schema.sql", "utf8"));
});

beforeEach(async () => {
  await db.exec("TRUNCATE events, users, sessions, login_attempts CASCADE");
});

async function sessionCount(userId: string) {
  const { rows } = await db.query<{ total: number }>(
    "SELECT count(*)::int AS total FROM sessions WHERE user_id = $1",
    [userId],
  );
  return rows[0].total;
}

async function addSession(userId: string) {
  await db.query(
    "INSERT INTO sessions (token_hash, user_id, expires_at) VALUES ($1, $2, now() + interval '1 day')",
    [`token-${Math.random()}`, userId],
  );
}

describe("eventos", () => {
  it("mostra ao público só os eventos publicados", async () => {
    const hidden = await createEvent({ ...input, name: "Evento oculto", published: false });
    const visible = await createEvent(input);
    expect((await listPublishedEvents()).map((e) => e.id)).toEqual([visible.id]);
    expect(await getPublishedEventBySlug(hidden.slug)).toBeNull();
    expect(await getPublishedEventBySlug(visible.slug)).not.toBeNull();
  });

  it("mantém a data exata e gera endereços únicos", async () => {
    const first = await createEvent(input);
    const second = await createEvent(input);
    expect(first.event_date).toBe("2026-10-30");
    expect(first.slug).toBe("copa-de-volei-2026");
    expect(second.slug).not.toBe(first.slug);
  });

  it("não troca o endereço ao editar e aceita excluir", async () => {
    const event = await createEvent(input);
    const updated = await updateEvent(event.id, { ...input, name: "Outro nome" });
    expect(updated?.name).toBe("Outro nome");
    expect(updated?.slug).toBe(event.slug);
    expect((await deleteEvent(event.id))?.id).toBe(event.id);
    expect(await listPublishedEvents()).toEqual([]);
  });

  it("guarda o texto longo e a opção sem anúncios", async () => {
    const event = await createEvent({ ...input, details: "Como foi a final.", hideAds: true });
    expect(event.details).toBe("Como foi a final.");
    expect(event.hide_ads).toBe(true);
    const updated = await updateEvent(event.id, { ...input, details: "Outro texto", hideAds: false });
    expect(updated?.details).toBe("Outro texto");
    expect(updated?.hide_ads).toBe(false);
  });

  it("o mapa do site lista só os eventos publicados", async () => {
    await createEvent({ ...input, name: "Evento oculto", published: false });
    const visible = await createEvent(input);
    expect((await listEventsForSitemap()).map((e) => e.slug)).toEqual([visible.slug]);
  });

  it("aplicar a estrutura de novo não apaga dados", async () => {
    const event = await createEvent({ ...input, details: "Mantido" });
    await db.exec(readFileSync("db/schema.sql", "utf8"));
    expect((await listPublishedEvents())[0]).toMatchObject({ id: event.id, details: "Mantido" });
  });

  it("ignora identificadores inválidos sem consultar o banco", async () => {
    expect(await updateEvent("' OR 1=1 --", input)).toBeNull();
    expect(await deleteEvent("nao-e-uuid")).toBeNull();
  });
});

describe("limite de tentativas", () => {
  it("bloqueia após 5 erros na conta e libera após login correto", async () => {
    const limits = loginLimits("a@b.com", "1.1.1.1");
    for (let i = 0; i < 4; i++) await recordFailure(limits);
    expect(await isBlocked(limits)).toBe(false);
    await recordFailure(limits);
    expect(await isBlocked(limits)).toBe(true);
    await clearAccountFailures(limits);
    expect(await isBlocked(limits)).toBe(false);
  });

  it("bloqueia um IP que testa muitas contas", async () => {
    for (let i = 0; i < 20; i++) await recordFailure(loginLimits(`c${i}@b.com`, "2.2.2.2"));
    expect(await isBlocked(loginLimits("nova@b.com", "2.2.2.2"))).toBe(true);
    expect(await isBlocked(loginLimits("nova@b.com", "3.3.3.3"))).toBe(false);
  });

  it("recomeça a contagem depois de 15 minutos", async () => {
    const limits = loginLimits("a@b.com", "1.1.1.1");
    for (let i = 0; i < 5; i++) await recordFailure(limits);
    await db.exec("UPDATE login_attempts SET window_started = now() - interval '16 minutes'");
    expect(await isBlocked(limits)).toBe(false);
    await recordFailure(limits);
    const { rows } = await db.query<{ failures: number }>(
      "SELECT failures FROM login_attempts WHERE key = $1",
      [limits[0].key],
    );
    expect(rows[0].failures).toBe(1);
  });

  it("não guarda e-mail nem IP legíveis", async () => {
    await recordFailure(loginLimits("a@b.com", "1.1.1.1"));
    const { rows } = await db.query<{ key: string }>("SELECT key FROM login_attempts");
    for (const row of rows) expect(row.key).toMatch(/^[0-9a-f]{64}$/);
  });
});

describe("usuários", () => {
  it("cria editor exigindo troca de senha e recusa e-mail repetido", async () => {
    expect(await createEditor("e@b.com", "Editor")).not.toBeNull();
    const user = await findUserByEmail("e@b.com");
    expect(user?.role).toBe("editor");
    expect(user?.must_change_password).toBe(true);
    expect(await createEditor("e@b.com", "Outro")).toBeNull();
  });

  it("desativar encerra as sessões na hora", async () => {
    await createEditor("e@b.com", "Editor");
    const user = await findUserByEmail("e@b.com");
    await addSession(user!.id);
    await setUserActive(user!.id, false);
    expect(await sessionCount(user!.id)).toBe(0);
    expect((await findUserByEmail("e@b.com"))?.active).toBe(false);
  });

  it("nova senha encerra as sessões e exige nova troca", async () => {
    await createEditor("e@b.com", "Editor");
    const user = await findUserByEmail("e@b.com");
    await changeOwnPassword(user!.id, "cavalo azul correu longe");
    expect((await findUserByEmail("e@b.com"))?.must_change_password).toBe(false);
    await addSession(user!.id);
    await resetPassword(user!.id);
    expect(await sessionCount(user!.id)).toBe(0);
    expect((await findUserByEmail("e@b.com"))?.must_change_password).toBe(true);
  });

  it("o responsável não pode ser desativado pelo painel", async () => {
    await db.query(
      "INSERT INTO users (email, name, password_hash, role) VALUES ('o@b.com', 'Dono', 'x', 'owner')",
    );
    const owner = await findUserByEmail("o@b.com");
    await setUserActive(owner!.id, false);
    expect((await findUserByEmail("o@b.com"))?.active).toBe(true);
  });
});
