"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { SiteSetting } from "@/lib/events";

const HERO_BANNER_KEY = "hero_banner_url";
const ABOUT_CONTENT_KEY = "about_content";
const ICON_KEYS = {
  youtube: "youtube_icon_url",
  instagram: "instagram_icon_url",
  whatsapp: "whatsapp_icon_url",
} as const;
const MAX_BANNER_MB = 10;
const MAX_ICON_MB = 1;

type SettingsFormState = { errors?: Record<string, string> };
type Props = { initialSettings: SiteSetting[]; action: (state: SettingsFormState, form: FormData) => Promise<SettingsFormState> };

async function uploadToServer(file: File, pathPrefix: string): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("pathPrefix", pathPrefix);

  const res = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || "Falha no upload");
  }
  return data.url;
}

export function SettingsForm({ initialSettings, action }: Props) {
  const [state, formAction, pending] = useActionState(action, { errors: {} });
  const settingsMap = new Map(initialSettings.map((s) => [s.key, s.value]));
  const [heroBannerUrl, setHeroBannerUrl] = useState(settingsMap.get(HERO_BANNER_KEY) ?? "");
  const [aboutContent, setAboutContent] = useState(settingsMap.get(ABOUT_CONTENT_KEY) ?? "");
  const [iconUrls, setIconUrls] = useState<Record<string, string>>({
    youtube: settingsMap.get(ICON_KEYS.youtube) ?? "",
    instagram: settingsMap.get(ICON_KEYS.instagram) ?? "",
    whatsapp: settingsMap.get(ICON_KEYS.whatsapp) ?? "",
  });
  const [uploading, setUploading] = useState<string | false>(false);
  const [uploadError, setUploadError] = useState("");

  async function handleHeroBanner(file: File | undefined) {
    if (!file) return;
    setUploadError("");
    if (file.size > MAX_BANNER_MB * 1024 * 1024) {
      setUploadError(`A imagem pode ter no máximo ${MAX_BANNER_MB} MB.`);
      return;
    }
    setUploading("hero");
    try {
      const url = await uploadToServer(file, "site/");
      setHeroBannerUrl(url);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Não foi possível enviar a imagem. Use JPG, PNG ou WebP e tente de novo.");
    } finally {
      setUploading(false);
    }
  }

  async function handleIconUpload(platform: keyof typeof ICON_KEYS, file: File | undefined) {
    if (!file) return;
    setUploadError("");
    if (file.size > MAX_ICON_MB * 1024 * 1024) {
      setUploadError(`O ícone pode ter no máximo ${MAX_ICON_MB} MB.`);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setUploadError("O arquivo deve ser uma imagem (PNG, JPG, WebP, SVG).");
      return;
    }
    setUploading(platform);
    try {
      const url = await uploadToServer(file, "site/");
      setIconUrls((prev) => ({ ...prev, [platform]: url }));
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Não foi possível enviar o ícone. Tente novamente.");
    } finally {
      setUploading(false);
    }
  }

  function renderIconUpload(platform: keyof typeof ICON_KEYS, label: string) {
    const url = iconUrls[platform];
    const isUploading = uploading === platform;

    return (
      <div className="field">
        <label htmlFor={`icon-${platform}`}>{label}</label>
        {url && (
          <div className="icon-preview-wrapper">
            <img src={url} alt={`Pré-visualização do ícone ${label}`} className="icon-preview" />
            <button
              type="button"
              className="icon-remove"
              onClick={() => {
                setIconUrls((prev) => ({ ...prev, [platform]: "" }));
              }}
              aria-label={`Remover ícone ${label}`}
            >
              ×
            </button>
          </div>
        )}
        <input
          id={`icon-${platform}`}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/svg+xml"
          onChange={(e) => handleIconUpload(platform, e.target.files?.[0])}
          disabled={!!uploading}
        />
        <p className="hint">PNG, JPG, WebP ou SVG de até {MAX_ICON_MB} MB. Recomendado: 24×24px, fundo transparente.</p>
        <input type="hidden" name={ICON_KEYS[platform]} value={url} />
        {isUploading && <p className="hint">Enviando ícone...</p>}
        {uploadError && <p className="error">{uploadError}</p>}
        {errors[ICON_KEYS[platform]] && <p className="error">{errors[ICON_KEYS[platform]]}</p>}
      </div>
    );
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
            disabled={!!uploading}
          />
          <p className="hint">JPG, PNG ou WebP de até {MAX_BANNER_MB} MB. Formato ideal: 1920 × 600 pixels (corte horizontal).</p>
          <input type="hidden" name="hero_banner_url" value={heroBannerUrl} />
          {uploading === "hero" && <p className="hint">Enviando imagem...</p>}
          {uploadError && <p className="error">{uploadError}</p>}
          {errors.hero_banner_url && <p className="error">{errors.hero_banner_url}</p>}
        </div>
      </section>

      <section className="settings-section">
        <h2>Ícones das Redes Sociais (Header)</h2>
        <p className="hint">Envie imagens personalizadas para substituir os ícones padrão. Deixe vazio para usar os ícones padrão (SVG).</p>

        {renderIconUpload("youtube", "YouTube")}
        {renderIconUpload("instagram", "Instagram")}
        {renderIconUpload("whatsapp", "WhatsApp")}

        <div className="admin-actions">
          <button type="submit" className="button button-primary" disabled={pending || !!uploading}>
            {pending ? "Salvando..." : "Salvar configurações"}
          </button>
          <Link href="/admin" className="button">
            Cancelar
          </Link>
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
      </section>
    </form>
  );
}