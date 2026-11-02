import { describe, expect, it } from "vitest";
import { generatePassword, hashPassword, passwordProblem, verifyPassword } from "@/lib/password";

describe("senhas", () => {
  it("não guarda a senha em texto e confere corretamente", async () => {
    const hash = await hashPassword("uma frase bem longa");
    expect(hash).not.toContain("uma frase");
    expect(await verifyPassword("uma frase bem longa", hash)).toBe(true);
    expect(await verifyPassword("outra frase bem longa", hash)).toBe(false);
  });

  it("gera hashes diferentes para a mesma senha", async () => {
    expect(await hashPassword("mesma senha aqui")).not.toBe(await hashPassword("mesma senha aqui"));
  });

  it("recusa hash em formato desconhecido", async () => {
    expect(await verifyPassword("qualquer", "formato-invalido")).toBe(false);
  });

  it("exige senha forte", () => {
    const email = "marcio@exemplo.com";
    expect(passwordProblem("curta", email)).not.toBeNull();
    expect(passwordProblem("aaaaaaaaaaaaaaaa", email)).not.toBeNull();
    expect(passwordProblem("minha-marcio-senha", email)).not.toBeNull();
    expect(passwordProblem("xx123456yyzzww", email)).not.toBeNull();
    expect(passwordProblem("cavalo azul correu longe", email)).toBeNull();
  });

  it("senhas geradas passam na própria regra", () => {
    expect(passwordProblem(generatePassword(), "a@b.com")).toBeNull();
  });
});
