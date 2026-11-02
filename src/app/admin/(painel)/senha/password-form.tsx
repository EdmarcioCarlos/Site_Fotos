"use client";

import { useActionState } from "react";
import { MIN_PASSWORD_LENGTH } from "@/lib/validation-constants";
import { changePasswordAction, type PasswordState } from "../actions";

const initialState: PasswordState = {};

export function PasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, initialState);

  return (
    <form action={action} className="form">
      <div className="field">
        <label htmlFor="currentPassword">Senha atual</label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>
      <div className="field">
        <label htmlFor="newPassword">Nova senha</label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          autoComplete="new-password"
          minLength={MIN_PASSWORD_LENGTH}
          required
        />
        <p className="hint">Mínimo de {MIN_PASSWORD_LENGTH} caracteres. Uma frase longa é ótima.</p>
      </div>
      <div className="field">
        <label htmlFor="confirmation">Confirme a nova senha</label>
        <input
          id="confirmation"
          name="confirmation"
          type="password"
          autoComplete="new-password"
          required
        />
      </div>
      {state.error && (
        <p className="error" role="alert">
          {state.error}
        </p>
      )}
      <div>
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Salvando..." : "Salvar nova senha"}
        </button>
      </div>
    </form>
  );
}
