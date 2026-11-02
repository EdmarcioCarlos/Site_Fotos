// Prévia local: sobe um banco temporário em memória com eventos de exemplo e o site.
// Nada é gravado em disco nem enviado para fora. Tudo some ao fechar com Ctrl+C.
// Com --so-banco, sobe apenas o banco (usado para testar o build de produção).
import { spawn } from "node:child_process";
import { readFileSync } from "node:fs";
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { generatePassword, hashPassword } from "../src/lib/password.ts";

const PORT = 54329;
const EMAIL = "demo@photopro.local";

const db = new PGlite();
await db.exec(readFileSync("db/schema.sql", "utf8"));

const password = generatePassword();
await db.query(
  `INSERT INTO users (email, name, password_hash, role, must_change_password)
   VALUES ($1, 'Demonstração', $2, 'owner', false)`,
  [EMAIL, await hashPassword(password)],
);

const events = [
  ["copa-de-futebol-exemplo-2026", "Copa de Futebol (exemplo)", "Final da copa com cobertura completa, da entrada dos times à premiação.", "Estádio Morenão", "Campo Grande - MS", "2026-10-25", "futebol", true],
  ["media-day-volei-exemplo-2026", "Media Day Vôlei (exemplo)", "Sessão de fotos oficiais das equipes e dos atletas antes da temporada.", "Ginásio Guanandizão", "Campo Grande - MS", "2026-09-12", "volei", true],
  ["encontro-corporativo-exemplo-2026", "Encontro Corporativo (exemplo)", "Evento oculto: aparece só no painel, para testar o botão Publicar.", "Centro de Convenções Rubens Gil de Camillo", "Campo Grande - MS", "2026-08-03", "corporativo", false],
];
for (const [slug, name, description, address, city, date, image, published] of events) {
  await db.query(
    `INSERT INTO events
       (slug, name, description, address, city, event_date, banner_url, sales_url, published)
     VALUES ($1, $2, $3, $4, $5, $6, $7, 'https://www.instagram.com/photopro.ms/', $8)`,
    [slug, name, description, address, city, date, `/demo/${image}.jpg`, published],
  );
}

const server = new PGLiteSocketServer({ db, port: PORT, host: "127.0.0.1", maxConnections: 20 });
await server.start();

console.log(`
  Prévia do site:  http://localhost:3000
  Painel:          http://localhost:3000/admin
  E-mail:          ${EMAIL}
  Senha:           ${password}

  Os dados são de exemplo e somem ao fechar (Ctrl+C).
  Enviar banners exige o Vercel Blob, então criar eventos só funciona com ele configurado.
`);

function stop(code = 0) {
  server.stop().finally(() => process.exit(code));
}
process.on("SIGINT", () => stop());

if (!process.argv.includes("--so-banco")) {
  const next = spawn(process.execPath, ["node_modules/next/dist/bin/next", "dev"], {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: `postgres://postgres:postgres@127.0.0.1:${PORT}/postgres?sslmode=disable`,
    },
  });
  next.on("exit", (code) => stop(code ?? 0));
}
