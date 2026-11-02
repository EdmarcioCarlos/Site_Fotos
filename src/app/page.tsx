import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { listPublishedEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";

export const revalidate = 3600;

export default async function HomePage() {
  const events = await listPublishedEvents();

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
                      priority={index === 0}
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
        )}
      </section>
    </SiteShell>
  );
}
