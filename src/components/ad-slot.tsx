"use client";

import Script from "next/script";

interface AdSlotProps {
  name: string;
  slot: string;
  format?: "auto" | "fluid" | "rectangle" | "horizontal";
}

export function AdSlot({ name, slot, format = "auto" }: AdSlotProps) {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT;
  if (!client) return null;

  return (
    <aside className="ad-slot" aria-label="Publicidade" data-ad-position={name}>
      <span className="ad-label">Publicidade</span>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
      <Script
        id="adsense"
        strategy="lazyOnload"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
        crossOrigin="anonymous"
      >
        {`(adsbygoogle = window.adsbygoogle || []).push({});`}
      </Script>
    </aside>
  );
}
