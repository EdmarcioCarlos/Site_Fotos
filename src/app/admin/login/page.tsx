import Image from "next/image";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/admin");

  return (
    <main className="login-box">
      <Image src="/logo.png" alt="PhotoPRO" width={96} height={96} priority />
      <h1>Acesso ao painel</h1>
      <LoginForm />
    </main>
  );
}
