import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { logoutAction } from "./actions";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <>
      <header className="admin-header">
        <div className="container">
          <Link href="/admin" className="text-link">
            Painel PhotoPRO
          </Link>
          <nav aria-label="Painel">
            <Link href="/admin">Eventos</Link>
            {user.role === "owner" && <Link href="/admin/usuarios">Usuários</Link>}
            <Link href="/admin/senha">Minha senha</Link>
            <Link href="/" target="_blank">
              Ver site
            </Link>
            <form action={logoutAction}>
              <button type="submit" className="link-button">
                Sair
              </button>
            </form>
          </nav>
        </div>
      </header>
      <main className="admin-main container">{children}</main>
    </>
  );
}
