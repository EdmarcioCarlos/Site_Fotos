import "server-only";
import { Pool, type QueryResultRow } from "pg";

let pool: Pool | undefined;

function getPool(): Pool | undefined {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) return undefined;
    pool = new Pool({ connectionString, max: 3, connectionTimeoutMillis: 10_000 });
  }
  return pool;
}

// Sempre parametrizado: valores vão em `params`, nunca concatenados no SQL.
export async function query<T extends QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  const pool = getPool();
  if (!pool) return [];
  const result = await pool.query<T>(text, params);
  return result.rows;
}
