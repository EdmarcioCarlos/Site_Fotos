export function locationQuery(address: string, city: string): string {
  return [address, city]
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");
}

export function mapEmbedUrl(place: string): string | null {
  if (!place) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
}

export function directionsUrl(place: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
}
