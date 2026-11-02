// Cria o responsável pelo painel, ou recupera o acesso dele se a senha for perdida.
// Uso: npm run admin:create -- email@exemplo.com "Nome"
import { existsSync } from "node:fs";
import pg from "pg";
import { generatePassword, hashPassword } from "../src/lib/password.ts";

if (existsSync(".env.local")) process.loadEnvFile(".env.local");

const [rawEmail, name] = process.argv.slice(2);
const email = rawEmail?.trim().toLowerCase();
if (!email?.includes("@") || !name?.trim() || !process.env.DATABASE_URL) {
  console.error('Uso: npm run admin:create -- email@exemplo.com "Nome" (com DATABASE_URL no .env.local)');
  process.exit(1);
}

const password = generatePassword();
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });
await client.connect();
try {
  const { rows } = await client.query(
    `INSERT INTO users (email, name, password_hash, role, active, must_change_password)
     VALUES ($1, $2, $3, 'owner', true, true)
     ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, password_hash = EXCLUDED.password_hash,
       role = 'owner', active = true, must_change_password = true
     RETURNING id`,
    [email, name.trim(), await hashPassword(password)],
  );
  await client.query(`DELETE FROM sessions WHERE user_id = $1`, [rows[0].id]);
  console.log(`Acesso de ${email} pronto.`);
  console.log(`Senha temporária (aparece só agora, será trocada no primeiro login): ${password}`);
} finally {
  await client.end();
}
