import "server-only";
import { HERO_BANNER_KEY } from "./constants";
import { getSiteSetting } from "./events";

export async function getHeroBannerUrl(): Promise<string> {
  const dbValue = await getSiteSetting(HERO_BANNER_KEY);
  return dbValue ?? process.env.NEXT_PUBLIC_HERO_BANNER_URL ?? "";
}