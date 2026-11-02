import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import { PasswordForm } from "./password-form";

export default async function PasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  return (
    <div className="narrow">
      <div className="admin-title">
        <h1>Minha senha</h1>
      </div>
      {user.must_change_password && (
        <p className="notice">Crie a sua senha definitiva para liberar o painel.</p>
      )}
      <PasswordForm />
    </div>
  );
}
