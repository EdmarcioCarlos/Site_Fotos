import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AdSlot } from "@/components/ad-slot";
import { SiteShell } from "@/components/site-shell";
import { getPublishedEventBySlug, type EventRow } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { directionsUrl, locationQuery, mapEmbedUrl } from "@/lib/maps";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

// Lista vazia: as páginas são geradas na primeira visita e guardadas em cache.
export function generateStaticParams() {
  return [];
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const event = await getPublishedEventBySlug((await params).slug);
  if (!event) return {};
  return {
    title: event.name,
    description: event.description,
    alternates: { canonical: `/eventos/${event.slug}` },
    openGraph: {
      title: event.name,
      description: event.description,
      url: `/eventos/${event.slug}`,
      siteName: "PhotoPRO",
      locale: "pt_BR",
      images: [event.banner_url],
    },
  };
}

function eventJsonLd(event: EventRow, place: string): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: event.name,
    description: event.description,
    startDate: event.event_date,
    image: [event.banner_url],
    url: `${SITE_URL}/eventos/${event.slug}`,
    location: { "@type": "Place", name: event.city, address: place },
  };
  // Troca "<" para um texto cadastrado não conseguir fechar a tag <script>.
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export default async function EventPage({ params }: Props) {
  const event = await getPublishedEventBySlug((await params).slug);
  if (!event) notFound();

  const place = locationQuery(event.address, event.city);
  const mapUrl = mapEmbedUrl(place);

  return (
    <SiteShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: eventJsonLd(event, place) }}
      />
      <article className="container narrow event-page">
        <Link href="/" className="back-link">
          ← Todos os eventos
        </Link>
        <a
          className="banner banner-contain"
          href={event.sales_url}
          aria-label={`Ver e comprar fotos do evento ${event.name}`}
        >
          <Image
            className="banner-backdrop"
            src={event.banner_url}
            alt=""
            fill
            sizes="96px"
            aria-hidden
          />
          <Image
            src={event.banner_url}
            alt={`Banner do evento ${event.name}`}
            fill
            sizes="(max-width: 780px) 100vw, 780px"
            priority
          />
        </a>
        <h1>{event.name}</h1>
        <p className="event-meta">
          {event.city} · {formatEventDate(event.event_date)}
        </p>
        <p className="event-description">{event.description}</p>
        <a
          className="button button-primary button-large"
          href={event.sales_url}
          target="_blank"
          rel="noopener noreferrer"
        >
          Ver e comprar fotos
        </a>

        {!event.hide_ads && <AdSlot name="evento-apos-botao" />}

        {event.details && (
          <>
            <h2 className="section-title">Sobre o evento</h2>
            <p className="event-description">{event.details}</p>
          </>
        )}

        <h2 className="section-title">Local</h2>
        <p className="event-meta">{place}</p>
        {mapUrl && (
          <iframe
            className="map-frame"
            src={mapUrl}
            title={`Mapa do local: ${place}`}
            loading="lazy"
            referrerPolicy="strict-origin-when-cross-origin"
          />
        )}
        <p>
          <a
            className="button"
            href={directionsUrl(place)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Como chegar
          </a>
        </p>

        {!event.hide_ads && <AdSlot name="evento-apos-local" />}
      </article>
    </SiteShell>
  );
}
