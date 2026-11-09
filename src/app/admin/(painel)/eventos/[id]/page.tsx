import { notFound } from "next/navigation";
import { getEventById, listCategories } from "@/lib/events";
import { requireUser } from "@/lib/session";
import { updateEventAction } from "../../actions";
import { EventForm } from "../event-form";

export default async function EditEventPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const [event, categories] = await Promise.all([
    getEventById(id),
    listCategories(),
  ]);
  if (!event) notFound();

  return (
    <div className="narrow">
      <div className="admin-title">
        <h1>Editar evento</h1>
      </div>
      <EventForm
        action={updateEventAction.bind(null, event.id)}
        event={event}
        categories={categories}
        uploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}
