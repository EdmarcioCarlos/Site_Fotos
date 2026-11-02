import { requireUser } from "@/lib/session";
import { createEventAction } from "../../actions";
import { EventForm } from "../event-form";

export default async function NewEventPage() {
  await requireUser();

  return (
    <div className="narrow">
      <div className="admin-title">
        <h1>Novo evento</h1>
      </div>
      <EventForm
        action={createEventAction}
        uploadEnabled={Boolean(process.env.BLOB_READ_WRITE_TOKEN)}
      />
    </div>
  );
}
