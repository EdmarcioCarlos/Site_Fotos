// Roda a cada publicação na Vercel (vercel.json) e pode ser executado mais de uma vez.
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

  // Primeiro acesso: só age enquanto não existe responsável, nunca altera uma conta existente.
  const { BOOTSTRAP_ADMIN_EMAIL: email, BOOTSTRAP_ADMIN_NAME: name, BOOTSTRAP_ADMIN_PASSWORD_HASH: hash } =
    process.env;
  if (email && name && hash) {
    const { rowCount } = await client.query(
      `INSERT INTO users (email, name, password_hash, role, must_change_password)
       SELECT $1, $2, $3, 'owner', true
       WHERE NOT EXISTS (SELECT 1 FROM users WHERE role = 'owner')
       ON CONFLICT (email) DO NOTHING`,
      [email.trim().toLowerCase(), name, hash],
    );
    console.log(rowCount ? "Responsável criado." : "Responsável já existe.");
  }
} finally {
  await client.end();
}
