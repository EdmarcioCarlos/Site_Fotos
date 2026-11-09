import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { HIRE_URL } from "@/lib/site";
import { getSiteSetting } from "@/lib/events";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a PhotoPRO, de Márcio Souza: fotografia criativa, com cobertura de esportes e eventos sociais em foto e vídeo.",
  alternates: { canonical: "/sobre" },
};

export default async function AboutPage() {
  const aboutContent = await getSiteSetting("about_content");

  // Conteúdo padrão caso não tenha nada configurado
  const defaultContent = `
A PhotoPRO é o trabalho de fotografia criativa de Márcio Souza, com cobertura completa de
esportes e eventos sociais, em foto e vídeo.

## O que fotografamos

- Esportes como futebol, vôlei, beach tennis e airsoft
- Eventos sociais e corporativos
- Gastronomia

## Como encontrar as suas fotos

1. Procure o seu evento na página inicial.
2. Abra o evento para ver a descrição e o local.
3. Toque em "Ver e comprar fotos". A galeria abre no site de venda, onde a compra é feita.

## Leve a PhotoPRO para o seu evento

Vai organizar um evento? Envie a data, o local e o tipo de cobertura que você precisa.
  `.trim();

  // Função simples para converter texto com quebras de linha em parágrafos HTML
  function renderContent(content: string) {
    return content
      .split(/\n\s*\n/) // Divide por parágrafos (duas quebras de linha)
      .filter((p) => p.trim())
      .map((paragraph, i) => {
        const trimmed = paragraph.trim();
        // Verifica se é um título (começa com ##)
        if (trimmed.startsWith("## ")) {
          return <h2 key={i} className="section-title">{trimmed.slice(3)}</h2>;
        }
        // Verifica se é uma lista
        if (trimmed.startsWith("- ")) {
          const items = trimmed.split("\n").map((item, idx) => (
            <li key={idx}>{item.slice(2)}</li>
          ));
          return <ul key={i}>{items}</ul>;
        }
        if (/^\d+\./.test(trimmed)) {
          const items = trimmed.split("\n").map((item, idx) => (
            <li key={idx}>{item.replace(/^\d+\.\s*/, "")}</li>
          ));
          return <ol key={i}>{items}</ol>;
        }
        return <p key={i}>{trimmed}</p>;
      });
  }

  return (
    <SiteShell>
      <article className="container narrow text-page">
        <h1>Sobre a PhotoPRO</h1>
        {renderContent(aboutContent || defaultContent)}
        <a className="button button-primary" href={HIRE_URL}>
          Contratar cobertura
        </a>
      </article>
    </SiteShell>
  );
}