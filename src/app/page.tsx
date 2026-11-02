import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AdSlot } from "@/components/ad-slot";
import { SiteShell } from "@/components/site-shell";
import { listPublishedEvents, type EventRow } from "@/lib/events";
import { formatEventDate } from "@/lib/format";

export const revalidate = 3600;

const EVENTS_BEFORE_AD = 6;
// Com poucos eventos a página tem pouco conteúdo, e o Google não permite anúncios nesses casos.
const MIN_EVENTS_FOR_AD = 3;

export async function generateMetadata(): Promise<Metadata> {
  const [latest] = await listPublishedEvents();
  return {
    alternates: { canonical: "/" },
    openGraph: {
      title: "PhotoPRO | Eventos",
      description: "Encontre o seu evento e acesse as fotos da cobertura da PhotoPRO.",
      url: "/",
      siteName: "PhotoPRO",
      locale: "pt_BR",
      type: "website",
      images: [latest?.banner_url ?? "/logo.png"],
    },
  };
}

function EventGrid({ events, firstIsPriority }: { events: EventRow[]; firstIsPriority?: boolean }) {
  return (
    <ul className="event-grid">
      {events.map((event, index) => (
        <li key={event.id}>
          <Link href={`/eventos/${event.slug}`} className="event-card">
            <div className="banner">
              <Image
                src={event.banner_url}
                alt=""
                fill
                sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 370px"
                priority={firstIsPriority && index === 0}
              />
            </div>
            <div className="event-card-body">
              <h2>{event.name}</h2>
              <p className="event-meta">
                {event.city} · {formatEventDate(event.event_date)}
              </p>
            </div>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default async function HomePage() {
  const events = await listPublishedEvents();
  const moreEvents = events.slice(EVENTS_BEFORE_AD);

  return (
    <SiteShell>
      <section className="hero container">
        <h1>Encontre as fotos do seu evento</h1>
        <p>Escolha o evento abaixo e acesse a galeria para ver e comprar as suas fotos.</p>
        <hr className="dots" />
      </section>
      <section className="container" aria-label="Eventos">
        {events.length === 0 ? (
          <p className="empty">Nenhum evento publicado ainda. Volte em breve!</p>
        ) : (
          <>
            <EventGrid events={events.slice(0, EVENTS_BEFORE_AD)} firstIsPriority />
            {events.length >= MIN_EVENTS_FOR_AD && <AdSlot name="inicio-entre-eventos" />}
            {moreEvents.length > 0 && <EventGrid events={moreEvents} />}
          </>
        )}
      </section>
    </SiteShell>
  );
}
