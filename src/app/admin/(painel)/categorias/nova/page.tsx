import { requireOwner } from "@/lib/session";
import { createCategoryAction } from "../../actions";
import { CategoryForm } from "../category-form";

export default function NewCategoryPage() {
  return <CategoryForm action={createCategoryAction} />;
}