import Link from "next/link";
import { listAllEvents } from "@/lib/events";
import { formatEventDate } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { deleteEventAction, togglePublishedAction } from "./actions";
import { ConfirmButton } from "./confirm-button";

export default async function AdminEventsPage() {
  await requireUser();
  const events = await listAllEvents();

  return (
    <>
      <div className="admin-title">
        <h1>Eventos</h1>
        <Link href="/admin/eventos/novo" className="button button-primary">
          Novo evento
        </Link>
      </div>
      {events.length === 0 ? (
        <p className="empty">Nenhum evento cadastrado.</p>
      ) : (
        <ul className="admin-list">
          {events.map((event) => (
            <li key={event.id} className="admin-item">
              <div className="admin-item-info">
                <strong>{event.name}</strong>
                <span className="hint">
                  {event.city} · {formatEventDate(event.event_date)}
                </span>
                <br />
                <span className={event.published ? "status status-on" : "status"}>
                  {event.published ? "Publicado" : "Oculto"}
                </span>
              </div>
              <div className="admin-actions">
                <Link href={`/admin/eventos/${event.id}`} className="button">
                  Editar
                </Link>
                <form action={togglePublishedAction.bind(null, event.id, !event.published)}>
                  <button type="submit" className="button">
                    {event.published ? "Ocultar" : "Publicar"}
                  </button>
                </form>
                <form action={deleteEventAction.bind(null, event.id)}>
                  <ConfirmButton
                    className="button button-danger"
                    message={`Excluir "${event.name}" e o banner? Isso não pode ser desfeito.`}
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
