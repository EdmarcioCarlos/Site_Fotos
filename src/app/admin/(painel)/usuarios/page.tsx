import { requireOwner } from "@/lib/session";
import { listUsers } from "@/lib/users";
import { resetUserPasswordAction, setUserActiveAction } from "../actions";
import { ConfirmButton } from "../confirm-button";
import { NewUserForm, ResetPasswordForm } from "./user-forms";

export default async function UsersPage() {
  await requireOwner();
  const users = await listUsers();

  return (
    <>
      <div className="admin-title">
        <h1>Usuários</h1>
      </div>
      <ul className="admin-list">
        {users.map((user) => (
          <li key={user.id} className="admin-item">
            <div className="admin-item-info">
              <strong>{user.name}</strong>
              <span className="hint">{user.email}</span>
              <br />
              <span className={user.active ? "status status-on" : "status"}>
                {user.role === "owner" ? "Responsável" : "Editor"} ·{" "}
                {user.active ? "Ativo" : "Desativado"}
              </span>
            </div>
            {user.role !== "owner" && (
              <div className="admin-actions">
                <ResetPasswordForm action={resetUserPasswordAction.bind(null, user.id)} />
                <form action={setUserActiveAction.bind(null, user.id, !user.active)}>
                  {user.active ? (
                    <ConfirmButton
                      className="button button-danger"
                      message={`Desativar ${user.name}? O acesso será encerrado na hora.`}
                    >
                      Desativar
                    </ConfirmButton>
                  ) : (
                    <button type="submit" className="button">
                      Reativar
                    </button>
                  )}
                </form>
              </div>
            )}
          </li>
        ))}
      </ul>
      <h2 className="section-title">Novo usuário</h2>
      <p className="hint" style={{ marginBottom: 16 }}>
        Editores cuidam dos eventos. Só o responsável gerencia usuários.
      </p>
      <NewUserForm />
    </>
  );
}
