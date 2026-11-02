"use client";

import { useActionState } from "react";
import { createUserAction, type UserFormState } from "../actions";
import { TemporaryPassword } from "./temporary-password";

const initialState: UserFormState = {};

export function NewUserForm() {
  const [state, action, pending] = useActionState(createUserAction, initialState);

  return (
    <form action={action} className="form">
      <div className="field-row">
        <div className="field">
          <label htmlFor="name">Nome</label>
          <input id="name" name="name" type="text" maxLength={100} required />
        </div>
        <div className="field">
          <label htmlFor="email">E-mail</label>
          <input id="email" name="email" type="email" maxLength={254} required />
        </div>
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      {state.created && <TemporaryPassword {...state.created} />}
      <div>
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Criando..." : "Criar usuário"}
        </button>
      </div>
    </form>
  );
}

export function ResetPasswordForm({
  action,
}: {
  action: (state: UserFormState) => Promise<UserFormState>;
}) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <>
      <form action={formAction}>
        <button type="submit" className="button" disabled={pending}>
          Nova senha
        </button>
      </form>
      {state.error && <p className="error">{state.error}</p>}
      {state.created && <TemporaryPassword {...state.created} />}
    </>
  );
}
