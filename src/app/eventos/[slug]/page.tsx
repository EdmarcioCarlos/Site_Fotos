import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/site-shell";
import { getPublishedEventBySlug } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { directionsUrl, locationQuery, mapEmbedUrl } from "@/lib/maps";

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
    openGraph: { title: event.name, description: event.description, images: [event.banner_url] },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getPublishedEventBySlug((await params).slug);
  if (!event) notFound();

  const place = locationQuery(event.address, event.city);
  const mapUrl = mapEmbedUrl(place);

  return (
    <SiteShell>
      <article className="container narrow event-page">
        <Link href="/" className="back-link">
          ← Todos os eventos
        </Link>
        <div className="banner banner-contain">
          <Image
            src={event.banner_url}
            alt={`Banner do evento ${event.name}`}
            fill
            sizes="(max-width: 780px) 100vw, 780px"
            priority
          />
        </div>
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
      </article>
    </SiteShell>
  );
}
