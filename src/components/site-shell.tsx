"use client";

import Image from "next/image";
import Link from "next/link";
import { HIRE_URL, INSTAGRAM_URL, WHATSAPP_URL, YOUTUBE_URL } from "@/lib/constants";

interface SiteShellProps {
  children: React.ReactNode;
  customIcons?: {
    youtube?: string;
    instagram?: string;
    whatsapp?: string;
  };
}

function SocialIcon({ href, label, children, customSrc }: { href: string; label: string; children: React.ReactNode; customSrc?: string }) {
  return (
    <a
      className="social-icon"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      {customSrc ? (
        <Image src={customSrc} alt="" width={24} height={24} className="custom-social-icon" />
      ) : (
        children
      )}
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
    <svg viewBox="0 0 24 24" width="24" height="24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="12" fill="#25D366" />
      <path fill="#fff" d="M17.75 10.03c-.23-.17-.97-.59-1.2-.68-.23-.09-.42-.09-.64-.07-.23.02-.4.16-.56.32-.17.17-.33.37-.35.43-.03.07-.14.21-.23.33-.17.23-.53.72-.75 1.06-.22.33-.2.47-.27.53-.07.07-.28.07-.41 0-.14-.07-.54-.54-.74-.95-.2-.4-.34-.8-.34-1.15 0-.34.1-.63.24-.86.14-.24.33-.55.56-.87.24-.33.57-.74.86-1.1.29-.37.47-.55.54-.61.07-.07.19-.07.36-.07.09 0 .2.01.3.03.1.02.21.08.3.2.1.14.12.27.13.3.03.1-.11.3-.3.54-.18.2-.5.6-.77.93-.27.32-.51.7-.63.93-.12.24-.16.36-.16.37 0 .02.15.14 1.1.67 1.02.58 1.74 1.07 2.34 1.18.5.09.78.07 1.1-.1.32-.17.71-.53.93-.88.22-.34.33-.72.3-.94-.03-.2-.12-.32-.32-.48-.13-.11-.3-.15-.5-.15-.19 0-.36.04-.5.12-.25.14-.63.5-.83.9-.2.4-.32.87-.32 1.04 0 .17.06.33.18.48.12.15.42.45.74.76.33.32.7.61 1.08.79.44.2.87.18 1.1-.03.23-.2.5-.5.7-.86.18-.33.29-.69.32-.89.04-.2-.12-.42-.42-.63z"/>
    </svg>
  );
}

export function SiteShell({ children, customIcons }: SiteShellProps) {
  return (
    <>
      <header className="site-header">
        <div className="container">
          <Link href="/" className="brand" aria-label="PhotoPRO, página inicial">
            <Image src="/logo.png" alt="" width={64} height={64} priority />
          </Link>
          <div className="header-actions">
            <div className="social-links">
              <SocialIcon href={YOUTUBE_URL} label="YouTube" customSrc={customIcons?.youtube}>
                <YouTubeIcon />
              </SocialIcon>
              <SocialIcon href={INSTAGRAM_URL} label="Instagram" customSrc={customIcons?.instagram}>
                <InstagramIcon />
              </SocialIcon>
              <SocialIcon href={WHATSAPP_URL} label="WhatsApp" customSrc={customIcons?.whatsapp}>
                <WhatsAppIcon />
              </SocialIcon>
            </div>
            <a className="button button-primary" href={HIRE_URL}>
              Contratar
            </a>
          </div>
        </div>
      </header>
      <main>{children}</main>
      <footer className="site-footer">
        <div className="container">
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