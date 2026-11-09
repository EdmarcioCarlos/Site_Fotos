export const SITE_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const CONTACT_EMAIL = "marciofotoearte@gmail.com";
export const HIRE_URL = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent("Contratar cobertura de evento")}`;
export const LINKS_URL = "https://linktr.ee/photopro";
export const YOUTUBE_URL = "https://www.youtube.com/channel/UClAlbHjGTXVVzfas7oRftIg";
export const INSTAGRAM_URL = "https://www.instagram.com/photopro.ms/";

export const HERO_BANNER_KEY = "hero_banner_url";

export async function getHeroBannerUrl(): Promise<string> {
  const { getSiteSetting } = await import("./events");
  const dbValue = await getSiteSetting(HERO_BANNER_KEY);
  return dbValue ?? process.env.NEXT_PUBLIC_HERO_BANNER_URL ?? "";
}
