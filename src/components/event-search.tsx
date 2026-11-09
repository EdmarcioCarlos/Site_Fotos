"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import type { EventRow } from "@/lib/events";
import { formatEventDate } from "@/lib/format";

interface EventSearchProps {
  initialEvents: EventRow[];
}

export function EventSearch({ initialEvents }: EventSearchProps) {
  const [query, setQuery] = useState("");

  const filteredEvents = useMemo(() => {
    if (!query.trim()) return initialEvents;
    const lower = query.toLowerCase();
    return initialEvents.filter(
      (event) =>
        event.name.toLowerCase().includes(lower) ||
        event.city.toLowerCase().includes(lower)
    );
  }, [initialEvents, query]);

  const displayEvents = filteredEvents.slice(0, 6);
  const moreEvents = filteredEvents.slice(6);

  return (
    <>
      <div className="search-wrapper">
        <label htmlFor="event-search" className="search-label">
          Pesquisar evento
        </label>
        <div className="search-input-wrapper">
          <svg
            className="search-icon"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" />
          </svg>
          <input
            id="event-search"
            type="search"
            placeholder="Digite o nome do evento ou cidade..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="search-input"
            autoComplete="off"
          />
        </div>
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="search-clear"
            aria-label="Limpar pesquisa"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        )}
      </div>

      {filteredEvents.length === 0 ? (
        <p className="empty">
          {query
            ? `Nenhum evento encontrado para "${query}".`
            : "Nenhum evento publicado ainda. Volte em breve!"}
        </p>
      ) : (
        <>
          <ul className="event-grid" role="list">
            {displayEvents.map((event, index) => (
              <li key={event.id}>
                <a href={event.sales_url} target="_blank" rel="noopener noreferrer" className="event-card">
                  <div className="banner">
                    <Image
                      src={event.banner_url}
                      alt=""
                      fill
                      sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 370px"
                      priority={index === 0}
                    />
                  </div>
                  <div className="event-card-body">
                    <h2>{event.name}</h2>
                    <p className="event-meta">
                      {event.city} · {formatEventDate(event.event_date)}
                    </p>
                  </div>
                </a>
              </li>
            ))}
          </ul>
          {moreEvents.length > 0 && (
            <ul className="event-grid" role="list">
              {moreEvents.map((event) => (
                <li key={event.id}>
                  <a href={event.sales_url} target="_blank" rel="noopener noreferrer" className="event-card">
                    <div className="banner">
                      <Image
                        src={event.banner_url}
                        alt=""
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 370px"
                      />
                    </div>
                    <div className="event-card-body">
                      <h2>{event.name}</h2>
                      <p className="event-meta">
                        {event.city} · {formatEventDate(event.event_date)}
                      </p>
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}