import Image from "next/image";
import Link from "next/link";

const LINKS_URL = "https://linktr.ee/photopro";
const CONTACT_EMAIL = "marciofotoearte@gmail.com";
const YOUTUBE_URL = "https://www.youtube.com/@lifesessions_";
const INSTAGRAM_URL = "https://www.instagram.com/photopro.ms/";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand" aria-label="PhotoPRO, página inicial">
            <Image src="/logo.png" alt="" width={64} height={64} priority />
          </Link>
          <a className="button" href={LINKS_URL} target="_blank" rel="noopener noreferrer">
            Painéis de trabalho
          </a>
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
