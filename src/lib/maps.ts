// Divide em "Rua X", "150", "Planalto", "Belo Horizonte", "MG", sem quebrar nomes como "Bom-Jesus".
function addressParts(value: string): string[] {
  return value
    .split(/[,/]|\s+-\s*|\s*-\s+|-(?=[A-Za-z]{2}\b)/)
    .map((part) =>
      part
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .trim()
        .toLowerCase(),
    )
    .filter(Boolean);
}

// A primeira parte é ignorada porque costuma ser a rua, e "Rua Belo Horizonte" não indica a cidade.
function addressHasCity(address: string, city: string): boolean {
  const parts = addressParts(address);
  const cityName = addressParts(city)[0];
  return (parts.length > 1 ? parts.slice(1) : parts).includes(cityName);
}

export function locationQuery(address: string, city: string): string {
  const place = address.trim();
  const cityText = city.trim();
  if (!place || !cityText) return place || cityText;
  return addressHasCity(place, cityText) ? place : `${place}, ${cityText}`;
}

export function mapEmbedUrl(place: string): string | null {
  if (!place) return null;
  return `https://www.google.com/maps?q=${encodeURIComponent(place)}&output=embed`;
}

export function directionsUrl(place: string): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(place)}`;
}
