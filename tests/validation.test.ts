import { describe, expect, it } from "vitest";
import { formatEventDate } from "@/lib/format";
import { directionsUrl, locationQuery, mapEmbedUrl } from "@/lib/maps";
import { parseEventInput, slugify } from "@/lib/validation";

const BANNER = "https://abc.public.blob.vercel-storage.com/banners/a.jpg";

function form(overrides: Record<string, string> = {}) {
  const data = new FormData();
  const values = {
    name: "Copa de Vôlei",
    description: "Final da copa.",
    address: "Ginásio Guanandizão",
    city: "Campo Grande - MS",
    eventDate: "2026-10-30",
    bannerUrl: BANNER,
    salesUrl: "https://loja.exemplo.com/copa",
    ...overrides,
  };
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

function errorsOf(overrides: Record<string, string>) {
  const result = parseEventInput(form(overrides));
  return result.ok ? {} : result.errors;
}

describe("parseEventInput", () => {
  it("aceita um evento válido", () => {
    const result = parseEventInput(form());
    expect(result.ok).toBe(true);
  });

  it("aplica o limite de 280 caracteres na descrição", () => {
    expect(errorsOf({ description: "a".repeat(280) }).description).toBeUndefined();
    expect(errorsOf({ description: "a".repeat(281) }).description).toBeDefined();
  });

  it.each([
    "javascript:alert(1)",
    "http://loja.exemplo.com",
    "data:text/html,<script>alert(1)</script>",
    "https://usuario:senha@loja.exemplo.com",
    "loja.exemplo.com",
  ])("recusa o link de venda %s", (salesUrl) => {
    expect(errorsOf({ salesUrl }).salesUrl).toBeDefined();
  });

  it.each([
    "https://exemplo.com/a.jpg",
    "https://public.blob.vercel-storage.com.exemplo.com/a.jpg",
    "http://abc.public.blob.vercel-storage.com/a.jpg",
    "",
  ])("recusa o banner %s", (bannerUrl) => {
    expect(errorsOf({ bannerUrl }).bannerUrl).toBeDefined();
  });

  it("recusa datas que não existem", () => {
    expect(errorsOf({ eventDate: "2026-02-30" }).eventDate).toBeDefined();
    expect(errorsOf({ eventDate: "ontem" }).eventDate).toBeDefined();
  });
});

describe("apoio", () => {
  it("gera endereços sem acentos", () => {
    expect(slugify("Copa de Vôlei — Ação 2026!")).toBe("copa-de-volei-acao-2026");
  });

  it("formata a data sem depender do fuso", () => {
    expect(formatEventDate("2026-01-01")).toBe("1 de janeiro de 2026");
  });

  it("monta o mapa sem chave e só quando há endereço", () => {
    expect(mapEmbedUrl("Rua A & B")).toBe(
      "https://www.google.com/maps?q=Rua%20A%20%26%20B&output=embed",
    );
    expect(mapEmbedUrl("")).toBeNull();
  });

  it("codifica o endereço no link de rota", () => {
    expect(directionsUrl(locationQuery("Rua A & B", "Campo Grande"))).toContain(
      "Rua%20A%20%26%20B%2C%20Campo%20Grande",
    );
  });
});
