export const LIMITS = { name: 120, description: 280, details: 5000, address: 300, city: 100 } as const;

export const BLOB_HOST_SUFFIX = ".public.blob.vercel-storage.com";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export type EventInput = {
  name: string;
  description: string;
  address: string;
  city: string;
  eventDate: string;
  bannerUrl: string;
  salesUrl: string;
  published: boolean;
  details: string;
  hideAds: boolean;
  categoryId: string | null;
};

export type FieldErrors = Partial<Record<keyof EventInput, string>>;

export type ParseResult<T> = { ok: true; data: T } | { ok: false; errors: FieldErrors };

export function isUuid(value: string): boolean {
  return UUID.test(value);
}

function text(form: FormData, field: string): string {
  const value = form.get(field);
  return typeof value === "string" ? value.replace(/\r\n/g, "\n").trim() : "";
}

function httpsUrl(value: string): URL | null {
  if (value.length > 2000) return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:" || url.username || url.password) return null;
    return url;
  } catch {
    return null;
  }
}

function isRealDate(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function checkLength(value: string, min: number, max: number, label: string): string | undefined {
  if (value.length < min) return `Preencha ${label}.`;
  if (value.length > max) return `Use no máximo ${max} caracteres em ${label}.`;
  return undefined;
}

export function parseEventInput(form: FormData): ParseResult<EventInput> {
  const data: EventInput = {
    name: text(form, "name"),
    description: text(form, "description"),
    address: text(form, "address"),
    city: text(form, "city"),
    eventDate: text(form, "eventDate"),
    bannerUrl: text(form, "bannerUrl"),
    salesUrl: text(form, "salesUrl"),
    published: form.get("published") === "on",
    details: text(form, "details"),
    hideAds: form.get("hideAds") === "on",
    categoryId: text(form, "categoryId") || null,
  };

  const errors: FieldErrors = {};
  const set = (field: keyof EventInput, message: string | undefined) => {
    if (message) errors[field] = message;
  };

  set("name", checkLength(data.name, 3, LIMITS.name, "o nome"));
  set("description", checkLength(data.description, 1, LIMITS.description, "a descrição"));
  set("details", checkLength(data.details, 0, LIMITS.details, "o texto sobre o evento"));
  set("address", checkLength(data.address, 5, LIMITS.address, "o endereço"));
  set("city", checkLength(data.city, 2, LIMITS.city, "a cidade"));
  if (!isRealDate(data.eventDate)) set("eventDate", "Informe uma data válida.");
  if (!httpsUrl(data.salesUrl)) {
    set("salesUrl", "Informe um link completo começando com https://");
  }
  const banner = httpsUrl(data.bannerUrl);
  if (!banner || !banner.hostname.endsWith(BLOB_HOST_SUFFIX)) {
    set("bannerUrl", "Envie a imagem do banner.");
  }

  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, data };
}

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/, "");
}
