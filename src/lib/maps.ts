export function locationQuery(address: string, city: string): string {
  return [address, city]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export function mapEmbedUrl(place: string): string | null {
  const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  if (!key || !place) return null;
  return `https://www.google.com/maps/embed/v1/place?key=${encodeURIComponent(key)}&q=${encodeURIComponent(place)}`;
}

export function directionsUrl(place: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
}
