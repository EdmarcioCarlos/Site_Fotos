import { notFound, redirect } from "next/navigation";
import { requireOwner } from "@/lib/session";
import { getCategoryById, updateCategory, type CategoryRow } from "@/lib/events";
import { updateCategoryAction, deleteCategoryAction } from "../../actions";
import { CategoryForm } from "../category-form";
import { ConfirmButton } from "../../confirm-button";

export default async function EditCategoryPage({ params }: { params: Promise<{ id: string }> }) {
  await requireOwner();
  const { id } = await params;
  const category = await getCategoryById(id);
  if (!category) notFound();

  return (
    <CategoryForm
      category={category}
      action={async (state, form) => {
        const result = await updateCategoryAction(id, state, form);
        if (result && !("errors" in result)) redirect("/admin/categorias");
        return result;
      }}
    />
  );
}