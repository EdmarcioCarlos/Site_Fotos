"use client";

import { upload } from "@vercel/blob/client";
import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import type { EventRow } from "@/lib/events";
import { locationQuery, mapEmbedUrl } from "@/lib/maps";
import { LIMITS } from "@/lib/validation";
import type { EventFormState } from "../actions";

const MAX_BANNER_MB = 10;
const initialState: EventFormState = {};

type Props = {
  action: (state: EventFormState, form: FormData) => Promise<EventFormState>;
  event?: EventRow;
  uploadEnabled: boolean;
};

export function EventForm({ action, event, uploadEnabled }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const [name, setName] = useState(event?.name ?? "");
  const [description, setDescription] = useState(event?.description ?? "");
  const [address, setAddress] = useState(event?.address ?? "");
  const [city, setCity] = useState(event?.city ?? "");
  const [eventDate, setEventDate] = useState(event?.event_date ?? "");
  const [salesUrl, setSalesUrl] = useState(event?.sales_url ?? "");
  const [published, setPublished] = useState(event?.published ?? false);
  const [bannerUrl, setBannerUrl] = useState(event?.banner_url ?? "");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const [mapPlace, setMapPlace] = useState(locationQuery(address, city));
  useEffect(() => {
    const timer = setTimeout(() => setMapPlace(locationQuery(address, city)), 800);
    return () => clearTimeout(timer);
  }, [address, city]);
  const mapUrl = mapEmbedUrl(mapPlace);

  async function handleBanner(file: File | undefined) {
    if (!file) return;
    setUploadError("");
    if (file.size > MAX_BANNER_MB * 1024 * 1024) {
      setUploadError(`A imagem pode ter no máximo ${MAX_BANNER_MB} MB.`);
      return;
    }
    setUploading(true);
    try {
      const blob = await upload(`banners/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/admin/upload",
      });
      setBannerUrl(blob.url);
    } catch {
      setUploadError("Não foi possível enviar a imagem. Use JPG, PNG ou WebP e tente de novo.");
    } finally {
      setUploading(false);
    }
  }

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="form">
      <div className="field">
        <label htmlFor="name">Nome do evento</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={LIMITS.name}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="banner">Banner</label>
        {bannerUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={bannerUrl} alt="Pré-visualização do banner" className="banner-preview" />
        )}
        <input
          id="banner"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => handleBanner(e.target.files?.[0])}
          disabled={!uploadEnabled}
        />
        <p className="hint">
          JPG, PNG ou WebP de até {MAX_BANNER_MB} MB. Formato ideal: 1600 × 900 pixels.
        </p>
        {!uploadEnabled && (
          <p className="error">
            O envio de imagens ainda não está configurado: falta conectar o Vercel Blob. Sem ele, não
            é possível salvar eventos.
          </p>
        )}
        <input type="hidden" name="bannerUrl" value={bannerUrl} />
        {uploading && <p className="hint">Enviando imagem...</p>}
        {uploadError && <p className="error">{uploadError}</p>}
        {errors.bannerUrl && <p className="error">{errors.bannerUrl}</p>}
      </div>

      <div className="field-row">
        <div className="field">
          <label htmlFor="eventDate">Data do evento</label>
          <input
            id="eventDate"
            name="eventDate"
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            required
          />
          {errors.eventDate && <p className="error">{errors.eventDate}</p>}
        </div>
        <div className="field">
          <label htmlFor="city">Cidade</label>
          <input
            id="city"
            name="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            maxLength={LIMITS.city}
            placeholder="Campo Grande - MS"
            required
          />
          {errors.city && <p className="error">{errors.city}</p>}
        </div>
      </div>

      <div className="field">
        <label htmlFor="address">Local ou endereço</label>
        <input
          id="address"
          name="address"
          type="text"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          maxLength={LIMITS.address}
          required
        />
        {errors.address && <p className="error">{errors.address}</p>}
        {mapUrl ? (
          <iframe
            className="map-frame"
            src={mapUrl}
            title="Pré-visualização do local no mapa"
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        ) : (
          <p className="hint">O mapa aparece aqui quando o endereço e a chave do Maps existirem.</p>
        )}
      </div>

      <div className="field">
        <label htmlFor="description">Descrição</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={LIMITS.description}
          aria-describedby="description-count"
          required
        />
        <p id="description-count" className="hint">
          {description.length} de {LIMITS.description} caracteres
        </p>
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="field">
        <label htmlFor="salesUrl">Link do site de venda das fotos</label>
        <input
          id="salesUrl"
          name="salesUrl"
          type="url"
          value={salesUrl}
          onChange={(e) => setSalesUrl(e.target.value)}
          placeholder="https://"
          required
        />
        {errors.salesUrl && <p className="error">{errors.salesUrl}</p>}
      </div>

      <label className="checkbox">
        <input
          type="checkbox"
          name="published"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
        />
        Publicar no site
      </label>

      <div className="admin-actions">
        <button type="submit" className="button button-primary" disabled={pending || uploading}>
          {pending ? "Salvando..." : "Salvar evento"}
        </button>
        <Link href="/admin" className="button">
          Cancelar
        </Link>
      </div>
    </form>
  );
}
