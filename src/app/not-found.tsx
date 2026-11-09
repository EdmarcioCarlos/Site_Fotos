import Link from "next/link";
import { SiteShell } from "@/components/site-shell";
import { getSocialIcons } from "@/lib/events";

export default async function NotFound() {
  const socialIcons = await getSocialIcons();

  return (
    <SiteShell customIcons={socialIcons}>
      <section className="hero container">
        <h1>Página não encontrada</h1>
        <p>Este evento pode ter sido removido ou o endereço está incorreto.</p>
        <Link href="/" className="button button-primary">
          Ver todos os eventos
        </Link>
      </section>
    </SiteShell>
  );
}
