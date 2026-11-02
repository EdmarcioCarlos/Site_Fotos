export function TemporaryPassword({ email, password }: { email: string; password: string }) {
  return (
    <div className="notice" role="status">
      Senha temporária de {email}. Ela aparece só agora: envie à pessoa por um canal seguro.
      <code>{password}</code>
    </div>
  );
}
