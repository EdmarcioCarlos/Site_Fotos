import type { MetadataRoute } from "next";
import { listEventsForSitemap } from "@/lib/events";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await listEventsForSitemap();
  return [
    { url: SITE_URL },
    { url: `${SITE_URL}/sobre` },
    { url: `${SITE_URL}/privacidade` },
    ...events.map((event) => ({
      url: `${SITE_URL}/eventos/${event.slug}`,
      lastModified: event.updated_at,
    })),
  ];
}
