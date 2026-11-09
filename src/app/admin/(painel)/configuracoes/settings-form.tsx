"use client";

import { useActionState, useState } from "react";
import { upload } from "@vercel/blob/client";
import Link from "next/link";
import type { SiteSetting } from "@/lib/events";

const HERO_BANNER_KEY = "hero_banner_url";
const ABOUT_CONTENT_KEY = "about_content";
const MAX_BANNER_MB = 10;

type SettingsFormState = { errors?: Record<string, string> };
type Props = { initialSettings: SiteSetting[]; action: (state: SettingsFormState, form: FormData) => Promise<SettingsFormState> };

export function SettingsForm({ initialSettings, action }: Props) {
  const [state, formAction, pending] = useActionState(action, { errors: {} });
  const settingsMap = new Map(initialSettings.map((s) => [s.key, s.value]));
  const [heroBannerUrl, setHeroBannerUrl] = useState(settingsMap.get(HERO_BANNER_KEY) ?? "");
  const [aboutContent, setAboutContent] = useState(settingsMap.get(ABOUT_CONTENT_KEY) ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleHeroBanner(file: File | undefined) {
    if (!file) return;
    setUploadError("");
    if (file.size > MAX_BANNER_MB * 1024 * 1024) {
      setUploadError(`A imagem pode ter no máximo ${MAX_BANNER_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(`site/hero-banner-${Date.now()}.${file.name.split(".").pop()}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setHeroBannerUrl(blob.url);
    } catch {
      setUploadError("Não foi possível enviar a imagem. Use JPG, PNG ou WebP e tente de novo.");
    } finally {
      setUploading(false);
    }
  }

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="form">
      <h1>Configurações do Site</h1>

      <section className="settings-section">
        <h2>Banner Principal (Home)</h2>
        <p className="hint">Esta imagem aparece no topo da página inicial, acima da lista de eventos.</p>

        <div className="field">
          <label htmlFor="heroBanner">Banner principal</label>
          {heroBannerUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={heroBannerUrl} alt="Pré-visualização do banner principal" className="banner-preview" />
          )}
          <input
            id="heroBanner"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(e) => handleHeroBanner(e.target.files?.[0])}
            disabled={!true} // uploadEnabled viria do contexto, simplificado por enquanto
          />
          <p className="hint">JPG, PNG ou WebP de até {MAX_BANNER_MB} MB. Formato ideal: 1920 × 600 pixels (corte horizontal).</p>
          <input type="hidden" name="hero_banner_url" value={heroBannerUrl} />
          {uploading && <p className="hint">Enviando imagem...</p>}
          {uploadError && <p className="error">{uploadError}</p>}
          {errors.hero_banner_url && <p className="error">{errors.hero_banner_url}</p>}
        </div>
      </section>

      <section className="settings-section">
        <h2>Conteúdo da Página "Sobre"</h2>
        <p className="hint">Texto que aparece na página /sobre. Use quebras de linha para parágrafos.</p>

        <div className="field">
          <label htmlFor="aboutContent">Sobre a PhotoPRO</label>
          <textarea
            id="aboutContent"
            name="about_content"
            value={aboutContent}
            onChange={(e) => setAboutContent(e.target.value)}
            rows={12}
            className="field-textarea"
          />
          {errors.about_content && <p className="error">{errors.about_content}</p>}
        </div>

        <div className="admin-actions">
          <button type="submit" className="button button-primary" disabled={pending || uploading}>
            {pending ? "Salvando..." : "Salvar configurações"}
          </button>
          <Link href="/admin" className="button">
            Cancelar
          </Link>
        </div>
      </section>
    </form>
  );
}