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
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.454.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.472.099-.174.05-.372-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.297.126.597.198.896.198.242 0 .49-.025.714-.075.272-.05.644-.249.94-.498.297-.249.52-.324.792-.448.272-.126.497-.323.52-.398.025-.1.074-.174.274-.57.074-.1.025-.174.05-.249.025-.074-.025-.125-.05-.175-.075l-.075-.025c-.125-.05-.299-.2-.448-.398-.248-.273-.548-.548-.797-.772-.272-.248-.52-.348-.697-.424-.222-.074-.443-.148-.69-.148" />
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
