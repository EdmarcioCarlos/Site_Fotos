import type { Metadata } from "next";
import Image from "next/image";
import { AdSlot } from "@/components/ad-slot";
import { SiteShell } from "@/components/site-shell";
import { listPublishedEvents, type EventRow } from "@/lib/events";
import { EventSearch } from "@/components/event-search";
import { getHeroBannerUrl } from "@/lib/site";

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

export default async function HomePage() {
  const [events, heroBannerUrl] = await Promise.all([
    listPublishedEvents(),
    getHeroBannerUrl(),
  ]);

  return (
    <SiteShell>
      {heroBannerUrl && (
        <section className="hero-banner" aria-label="Banner principal">
          <Image
            src={heroBannerUrl}
            alt=""
            fill
            priority
            sizes="100vw"
            className="hero-banner-image"
          />
        </section>
      )}
      <section className="hero container">
        <h1>Encontre as fotos do seu evento</h1>
        <p>Escolha o evento abaixo e acesse a galeria para ver e comprar as suas fotos.</p>
        <hr className="dots" />
      </section>
      <section className="container" aria-label="Eventos">
        <EventSearch initialEvents={events} />
        {events.length >= MIN_EVENTS_FOR_AD && <AdSlot name="inicio-entre-eventos" />}
      </section>
    </SiteShell>
  );
}