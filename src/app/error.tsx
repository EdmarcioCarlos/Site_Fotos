"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <main className="hero container">
      <h1>Algo deu errado</h1>
      <p>Não foi possível carregar esta página. Tente novamente em instantes.</p>
      <button type="button" className="button button-primary" onClick={reset}>
        Tentar novamente
      </button>
    </main>
  );
}
