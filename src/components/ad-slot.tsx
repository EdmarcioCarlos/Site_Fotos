// Espaço reservado para anúncio: não renderiza nada enquanto o AdSense não for configurado.
// Ao ativar, falta incluir aqui o bloco do Google, o script no layout e liberar ambos na CSP.
export function AdSlot({ name }: { name: string }) {
  if (!process.env.NEXT_PUBLIC_ADSENSE_CLIENT) return null;

  return (
    <aside className="ad-slot" aria-label="Publicidade" data-ad-position={name}>
      <span className="ad-label">Publicidade</span>
    </aside>
  );
}
