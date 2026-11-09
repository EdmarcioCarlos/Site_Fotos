import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { WHATSAPP_URL } from "@/lib/constants";
import { getSocialIcons } from "@/lib/events";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como o site de eventos da PhotoPRO trata os dados de quem o visita.",
  alternates: { canonical: "/privacidade" },
};

export default async function PrivacyPage() {
  const socialIcons = await getSocialIcons();

  return (
    <SiteShell customIcons={socialIcons}>
      <article className="container narrow text-page">
        <h1>Privacidade</h1>
        <p className="event-meta">Atualizado em novembro de 2026.</p>

        <h2 className="section-title">Visitantes</h2>
        <p>
          Este site não tem cadastro nem formulários para visitantes, não usa ferramentas próprias de
          estatística ou rastreamento e não exibe anúncios. Se isso mudar, esta página será
          atualizada antes da mudança.
        </p>

        <h2 className="section-title">Serviços de terceiros</h2>
        <ul>
          <li>
            <strong>Hospedagem:</strong> o site e os banners ficam na Vercel, que pode processar dados
            técnicos das conexões, como o endereço IP, para entregar as páginas.
          </li>
          <li>
            <strong>Google Maps:</strong> o mapa da página do evento é carregado pelo Google, que
            recebe dados da conexão de acordo com as próprias regras.
          </li>
          <li>
            <strong>Site de venda:</strong> ao tocar em "Ver e comprar fotos", você vai para
            outro site, que tem a própria política de privacidade.
          </li>
        </ul>

        <h2 className="section-title">Painel do fotógrafo</h2>
        <p>
          A área restrita usa um cookie necessário para manter o login de quem administra o site.
          Visitantes não recebem esse cookie. Tentativas de login erradas ficam registradas por pouco
          tempo, de forma não legível, para bloquear ataques.
        </p>

        <h2 className="section-title">Fotos e seus direitos</h2>
        <p>
          Para falar sobre os seus dados, pedir a retirada de uma imagem deste site ou tirar dúvidas,
          entre em contato pelo <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">WhatsApp</a>.
        </p>
      </article>
    </SiteShell>
  );
}