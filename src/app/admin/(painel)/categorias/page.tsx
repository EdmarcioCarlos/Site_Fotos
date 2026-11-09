import Link from "next/link";
import { requireOwner } from "@/lib/session";
import { listCategories, type CategoryRow } from "@/lib/events";
import { deleteCategoryAction } from "../actions";
import { ConfirmButton } from "./confirm-button";

export default async function AdminCategoriesPage() {
  await requireOwner();
  const categories = await listCategories();

  return (
    <>
      <div className="admin-title">
        <h1>Modalidades</h1>
        <Link href="/admin/categorias/nova" className="button button-primary">
          Nova modalidade
        </Link>
      </div>
      {categories.length === 0 ? (
        <p className="empty">Nenhuma modalidade cadastrada.</p>
      ) : (
        <ul className="admin-list">
          {categories.map((category) => (
            <li key={category.id} className="admin-item">
              <div className="admin-item-info">
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: 12,
                      height: 12,
                      borderRadius: "50%",
                      background: category.color,
                    }}
                  />
                  <strong>{category.name}</strong>
                </div>
                <span className="hint">{category.slug}</span>
                {category.description && (
                  <>
                    <br />
                    <span className="hint">{category.description}</span>
                  </>
                )}
              </div>
              <div className="admin-actions">
                <Link href={`/admin/categorias/${category.id}`} className="button">
                  Editar
                </Link>
                <form action={deleteCategoryAction.bind(null, category.id)}>
                  <ConfirmButton
                    className="button button-danger"
                    message={`Excluir "${category.name}"? Isso não pode ser desfeito. Eventos desta modalidade ficarão sem categoria.`}
                  >
                    Excluir
                  </ConfirmButton>
                </form>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}