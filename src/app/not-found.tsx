import Link from "next/link";
import { SiteShell } from "@/components/site-shell";

export default function NotFound() {
  return (
    <SiteShell>
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
