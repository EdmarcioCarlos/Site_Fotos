import { requireUser } from "@/lib/session";
import { createEventAction } from "../../actions";
import { listCategories } from "@/lib/events";
import { EventForm } from "../event-form";

export default async function NewEventPage() {
  await requireUser();
  const categories = await listCategories();

  return (
    <div className="narrow">
      <div className="admin-title">
        <h1>Novo evento</h1>
      </div>
      <EventForm
        action={createEventAction}
        categories={categories}
        uploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}
