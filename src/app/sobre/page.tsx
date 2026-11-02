import type { Metadata } from "next";
import { SiteShell } from "@/components/site-shell";
import { HIRE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sobre",
  description:
    "Conheça a PhotoPRO, de Márcio Souza: fotografia criativa, com cobertura de esportes e eventos sociais em foto e vídeo.",
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <SiteShell>
      <article className="container narrow text-page">
        <h1>Sobre a PhotoPRO</h1>
        <p>
          A PhotoPRO é o trabalho de fotografia criativa de Márcio Souza, com cobertura completa de
          esportes e eventos sociais, em foto e vídeo.
        </p>

        <h2 className="section-title">O que fotografamos</h2>
        <ul>
          <li>Esportes como futebol, vôlei, beach tennis e airsoft</li>
          <li>Eventos sociais e corporativos</li>
          <li>Gastronomia</li>
        </ul>

        <h2 className="section-title">Como encontrar as suas fotos</h2>
        <ol>
          <li>Procure o seu evento na página inicial.</li>
          <li>Abra o evento para ver a descrição e o local.</li>
          <li>
            Toque em &quot;Ver e comprar fotos&quot;. A galeria abre no site de venda, onde a compra é
            feita.
          </li>
        </ol>

        <h2 className="section-title">Leve a PhotoPRO para o seu evento</h2>
        <p>Vai organizar um evento? Envie a data, o local e o tipo de cobertura que você precisa.</p>
        <a className="button button-primary" href={HIRE_URL}>
          Contratar cobertura
        </a>
      </article>
    </SiteShell>
  );
}
