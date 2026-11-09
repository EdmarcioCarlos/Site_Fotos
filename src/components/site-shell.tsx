import Image from "next/image";
import Link from "next/link";
import { HIRE_URL, INSTAGRAM_URL, WHATSAPP_URL, YOUTUBE_URL } from "@/lib/site";

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      className="social-icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {children}
    </a>
  );
}

function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.128-1.28-.072-1.689-.072-4.947 0-3.259-.014-3.668-.072-4.947.196-4.354 2.617-6.78 6.979-6.98.128-1.28.072-1.689.072-4.947 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-.128-1.28-.072-1.689-.072-4.947 0-3.259-.014-3.668-.072-4.948.2-4.358 2.618-6.78 6.98-6.98 1.281-.058 1.689-.072 4.948-.072 3.259 0 3.668.014 4.948.072 4.354.2 6.782 2.618 6.979 6.98.059 1.28.073 1.689.073 4.948 0 3.259-.014 3.667-.072 4.947-.196 4.354-2.617 6.78-6.979 6.98-.128 1.28-.072 1.689-.072 4.947 0 3.259.014 3.668.072 4.947.196 4.354 2.617 6.78 6.979 6.98.128 1.28.072 1.689.072 4.947 0 3.259-.014 3.667-.072 4.947-.2 4.354-2.617 6.78-6.979 6.98z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M12.031 3.308c-4.806 0-8.711 3.905-8.711 8.711 0 1.47.372 2.862 1.011 4.088L.271 23.345l5.337-1.41c1.084.524 2.297.843 3.573.843 4.806 0 8.711-3.905 8.711-8.711s-3.905-8.711-8.711-8.711zm4.093 11.907c-.488.306-1.51.524-2.144.636-.77.133-1.365.084-1.758-.078-.624-.252-1.25-.715-1.51-1.173-.206-.404-.078-.77.133-1.103.306-.46.583-.923.77-1.164.133-.306.084-.624-.026-.892-.079-.187-.583-2.266-.98-4.535-.232-1.33-.183-2.576.079-3.572.232-.923.583-1.643.797-2.211.233-.524-.105-.797-.318-1.204-.264-.105-.264-.319-.053-.319-.583 0-.306.079-.583.345-.797.21-.233.424-.404.69-.488.553-.158 1.612-.026 2.576.502 1.45.607 2.42 1.52 3.019 2.275.478.607.75 1.204.775 1.392.053.371-.026.69-.237.953-.184.265-.583.69-.923 1.052-.318.318-.715.636-.98.872-.264.265-.423.46-.553.583-.105.104-.183.183-.345.078l-.473-.319c-.345-.232-.74-.552-1.007-.797-.371-.265-.74-.5-1.103-.607-.371-.132-.797-.026-1.103.237-.345.264-.583.74-.583 1.232 0 .553.318 1.084.814 1.593.398.404.843.74 1.277.979.404.264.893.46 1.392.488.583.026 1.083-.132 1.566-.553.43-.398.715-.923.872-1.33.133-.432.079-.814-.026-1.103z" />
    </svg>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand" aria-label="PhotoPRO, página inicial">
            <Image src="/logo.png" alt="" width={64} height={64} priority />
          </Link>
          <div className="header-actions">
            <a className="button button-primary" href={HIRE_URL}>
              Contratar
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">
          <div className="social-links">
            <SocialIcon href={YOUTUBE_URL} label="YouTube">
              <YouTubeIcon />
            </SocialIcon>
            <SocialIcon href={INSTAGRAM_URL} label="Instagram">
              <InstagramIcon />
            </SocialIcon>
            <SocialIcon href={WHATSAPP_URL} label="WhatsApp">
              <WhatsAppIcon />
            </SocialIcon>
          </div>
          <ul className="contact-list">
            <li>
              <Link className="text-link" href="/sobre">
                Sobre
              </Link>
            </li>
            <li>
              <Link className="text-link" href="/privacidade">
                Privacidade
              </Link>
            </li>
          </ul>
          <p>PhotoPRO | Márcio Souza. Fotografia esportiva e social.</p>
          <p>
            Este site não coleta dados de visitantes. O mapa da página do evento é carregado pelo
            Google, e a compra das fotos acontece no site de venda indicado em cada evento.
          </p>
        </div>
      </footer>
    </>
  );
}
