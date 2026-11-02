import Image from "next/image";
import Link from "next/link";
import { CONTACT_EMAIL, HIRE_URL, INSTAGRAM_URL, LINKS_URL, YOUTUBE_URL } from "@/lib/site";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="top-bar container">
        <Link href="/admin" prefetch={false}>
          Painel do fotógrafo
        </Link>
      </div>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand" aria-label="PhotoPRO, página inicial">
            <Image src="/logo.png" alt="" width={64} height={64} priority />
          </Link>
          <div className="header-actions">
            <a className="button" href={LINKS_URL} target="_blank" rel="noopener noreferrer">
              Meus trabalhos
            </a>
            <a className="button button-primary" href={HIRE_URL}>
              Contratar
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">
          <h2 className="footer-title">Contato</h2>
          <ul className="contact-list">
            <li>
              <a className="text-link" href={`mailto:${CONTACT_EMAIL}`}>
                {CONTACT_EMAIL}
              </a>
            </li>
            <li>
              <a className="text-link" href={YOUTUBE_URL} target="_blank" rel="noopener noreferrer">
                YouTube
              </a>
            </li>
            <li>
              <a
                className="text-link"
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram
              </a>
            </li>
          </ul>
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
