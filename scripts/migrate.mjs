import { existsSync, readFileSync } from "node:fs";
import pg from "pg";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");
if (!process.env.DATABASE_URL) {
  console.error("Defina DATABASE_URL no .env.local");
  process.exit(1);
}

const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  await client.query(readFileSync("db/schema.sql", "utf8"));
  console.log("Banco atualizado.");
} finally {
  await client.end();
}
