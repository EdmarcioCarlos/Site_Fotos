import "server-only";
import { Pool, type QueryResultRow } from "pg";

let pool: Pool | undefined;

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL não configurada");
    pool = new Pool({ connectionString, max: 3, connectionTimeoutMillis: 10_000 });
  }
  return pool;
}

// Sempre parametrizado: valores vão em `params`, nunca concatenados no SQL.
export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const result = await getPool().query<T>(text, params);
  return result.rows;
}
