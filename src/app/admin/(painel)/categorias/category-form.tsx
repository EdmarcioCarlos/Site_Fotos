"use client";

import { useActionState, useEffect, useState } from "react";
import Link from "next/link";
import type { CategoryRow } from "@/lib/events";
import type { CategoryFormState } from "../actions";

type Props = {
  action: (state: CategoryFormState, form: FormData) => Promise<CategoryFormState>;
  category?: CategoryRow;
};

export function CategoryForm({ action, category }: Props) {
  const [state, formAction, pending] = useActionState(action, { errors: {} });
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(category?.description ?? "");
  const [color, setColor] = useState(category?.color ?? "#cb1718");

  useEffect(() => {
    if (name && !slug) {
      setSlug(
        name
          .normalize("NFD")
          .replace(/[̀-ͯ]/g, "")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "")
          .slice(0, 80)
      );
    }
  }, [name, slug]);

  const errors = state.errors ?? {};

  return (
    <form action={formAction} className="form">
      <h1>{category ? "Editar modalidade" : "Nova modalidade"}</h1>

      <div className="field">
        <label htmlFor="name">Nome da modalidade</label>
        <input
          id="name"
          name="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
          required
        />
        {errors.name && <p className="error">{errors.name}</p>}
      </div>

      <div className="field">
        <label htmlFor="slug">Slug (URL amigável)</label>
        <input
          id="slug"
          name="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          maxLength={80}
          required
        />
        <p className="hint">Usado na URL: /categoria/este-slug. Apenas letras minúsculas, números e hífen.</p>
        {errors.slug && <p className="error">{errors.slug}</p>}
      </div>

      <div className="field">
        <label htmlFor="description">Descrição (opcional)</label>
        <textarea
          id="description"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
        />
        {errors.description && <p className="error">{errors.description}</p>}
      </div>

      <div className="field">
        <label htmlFor="color">Cor de destaque</label>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <input
            id="color"
            name="color"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ width: 50, height: 40, border: "none", borderRadius: 8, cursor: "pointer" }}
          />
          <input
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            style={{ flex: 1, fontFamily: "monospace" }}
            placeholder="#cb1718"
          />
        </div>
        {errors.color && <p className="error">{errors.color}</p>}
      </div>

      <div className="admin-actions">
        <button type="submit" className="button button-primary" disabled={pending}>
          {pending ? "Salvando..." : "Salvar modalidade"}
        </button>
        <Link href="/admin/categorias" className="button">
          Cancelar
        </Link>
      </div>
    </form>
  );
}