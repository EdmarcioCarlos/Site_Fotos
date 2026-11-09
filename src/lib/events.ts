import "server-only";
import { randomBytes } from "node:crypto";
import { query } from "@/lib/db";
import { isUuid, slugify, type EventInput } from "@/lib/validation";

export type EventRow = {
  id: string;
  slug: string;
  name: string;
  description: string;
  address: string;
  city: string;
  event_date: string;
  banner_url: string;
  sales_url: string;
  published: boolean;
  details: string;
  hide_ads: boolean;
  category_id: string | null;
};

export type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  description: string;
  color: string;
  created_at: Date;
  updated_at: Date;
};

// event_date em texto: evita que o fuso do servidor mude o dia do evento.
const COLUMNS = `id, slug, name, description, address, city, event_date::text AS event_date,
  banner_url, sales_url, published, details, hide_ads, category_id`;

const CAT_COLUMNS = `id, name, slug, description, color, created_at, updated_at`;

export function listPublishedEvents(categoryId?: string): Promise<EventRow[]> {
  if (categoryId) {
    return query<EventRow>(
      `SELECT ${COLUMNS} FROM events WHERE published AND category_id = $1 ORDER BY event_date DESC, created_at DESC`,
      [categoryId],
    );
  }
  return query<EventRow>(
    `SELECT ${COLUMNS} FROM events WHERE published ORDER BY event_date DESC, created_at DESC`,
  );
}

export function listEventsForSitemap(): Promise<{ slug: string; updated_at: Date }[]> {
  return query<{ slug: string; updated_at: Date }>(
    `SELECT slug, updated_at FROM events WHERE published ORDER BY event_date DESC`,
  );
}

export async function getPublishedEventBySlug(slug: string): Promise<EventRow | null> {
  const rows = await query<EventRow>(
    `SELECT ${COLUMNS} FROM events WHERE slug = $1 AND published`,
    [slug],
  );
  return rows[0] ?? null;
}

export function listAllEvents(): Promise<EventRow[]> {
  return query<EventRow>(`SELECT ${COLUMNS} FROM events ORDER BY event_date DESC, created_at DESC`);
}

export async function getEventById(id: string): Promise<EventRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<EventRow>(`SELECT ${COLUMNS} FROM events WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

// Categorias
export function listCategories(): Promise<CategoryRow[]> {
  return query<CategoryRow>(`SELECT ${CAT_COLUMNS} FROM categories ORDER BY name`);
}

export async function getCategoryById(id: string): Promise<CategoryRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<CategoryRow>(`SELECT ${CAT_COLUMNS} FROM categories WHERE id = $1`, [id]);
  return rows[0] ?? null;
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const rows = await query<CategoryRow>(`SELECT ${CAT_COLUMNS} FROM categories WHERE slug = $1`, [slug]);
  return rows[0] ?? null;
}

export async function createCategory(input: { name: string; slug: string; description?: string; color?: string }): Promise<CategoryRow> {
  const rows = await query<CategoryRow>(
    `INSERT INTO categories (name, slug, description, color)
     VALUES ($1, $2, $3, $4)
     RETURNING ${CAT_COLUMNS}`,
    [input.name, input.slug, input.description ?? '', input.color ?? '#cb1718'],
  );
  return rows[0]!;
}

export async function updateCategory(id: string, input: { name?: string; slug?: string; description?: string; color?: string }): Promise<CategoryRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<CategoryRow>(
    `UPDATE categories SET
       name = COALESCE($2, name),
       slug = COALESCE($3, slug),
       description = COALESCE($4, description),
       color = COALESCE($5, color),
       updated_at = now()
     WHERE id = $1 RETURNING ${CAT_COLUMNS}`,
    [id, input.name, input.slug, input.description, input.color],
  );
  return rows[0] ?? null;
}

export async function deleteCategory(id: string): Promise<CategoryRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<CategoryRow>(`DELETE FROM categories WHERE id = $1 RETURNING ${CAT_COLUMNS}`, [id]);
  return rows[0] ?? null;
}

async function insertWithSlug(slug: string, input: EventInput): Promise<EventRow | null> {
  const rows = await query<EventRow>(
    `INSERT INTO events
       (slug, name, description, address, city, event_date, banner_url, sales_url, published,
        details, hide_ads, category_id)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
     ON CONFLICT (slug) DO NOTHING
     RETURNING ${COLUMNS}`,
    [
      slug,
      input.name,
      input.description,
      input.address,
      input.city,
      input.eventDate,
      input.bannerUrl,
      input.salesUrl,
      input.published,
      input.details,
      input.hideAds,
      input.categoryId,
    ],
  );
  return rows[0] ?? null;
}

export async function createEvent(input: EventInput): Promise<EventRow> {
  const base = slugify(`${input.name} ${input.eventDate.slice(0, 4)}`) || "evento";
  const created = await insertWithSlug(base, input);
  if (created) return created;
  const retried = await insertWithSlug(`${base}-${randomBytes(3).toString("hex")}`, input);
  if (!retried) throw new Error("Não foi possível gerar um endereço único para o evento");
  return retried;
}

// O slug não muda na edição: links já compartilhados continuam funcionando.
export async function updateEvent(id: string, input: EventInput): Promise<EventRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<EventRow>(
    `UPDATE events SET name = $2, description = $3, address = $4, city = $5, event_date = $6,
       banner_url = $7, sales_url = $8, published = $9, details = $10, hide_ads = $11, category_id = $12,
       updated_at = now()
     WHERE id = $1 RETURNING ${COLUMNS}`,
    [
      id,
      input.name,
      input.description,
      input.address,
      input.city,
      input.eventDate,
      input.bannerUrl,
      input.salesUrl,
      input.published,
      input.details,
      input.hideAds,
      input.categoryId,
    ],
  );
  return rows[0] ?? null;
}

export async function setEventPublished(id: string, published: boolean): Promise<EventRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<EventRow>(
    `UPDATE events SET published = $2, updated_at = now() WHERE id = $1 RETURNING ${COLUMNS}`,
    [id, published],
  );
  return rows[0] ?? null;
}

export async function deleteEvent(id: string): Promise<EventRow | null> {
  if (!isUuid(id)) return null;
  const rows = await query<EventRow>(`DELETE FROM events WHERE id = $1 RETURNING ${COLUMNS}`, [id]);
  return rows[0] ?? null;
}

export type SiteSetting = { key: string; value: string; updated_at: Date };

export async function getSiteSetting(key: string): Promise<string | null> {
  const rows = await query<SiteSetting>(`SELECT value FROM site_settings WHERE key = $1`, [key]);
  return rows[0]?.value ?? null;
}

export async function setSiteSetting(key: string, value: string): Promise<void> {
  await query(
    `INSERT INTO site_settings (key, value) VALUES ($1, $2)
     ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = now()`,
    [key, value],
  );
}

export async function listSiteSettings(): Promise<SiteSetting[]> {
  return query<SiteSetting>(`SELECT key, value, updated_at FROM site_settings ORDER BY key`);
}
