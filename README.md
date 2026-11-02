# PhotoPRO Eventos

Vitrine de eventos fotografados pela PhotoPRO. Cada evento leva o visitante ao site onde as fotos são vendidas. O painel de ADM fica em `/admin`.

Feito com Next.js, Neon (Postgres), Vercel Blob e Google Maps Embed.

## Ver o site no computador

Precisa do [Node.js](https://nodejs.org) (versão LTS).

```powershell
npm install
npm run demo
```

Abra `http://localhost:3000`. O e-mail e a senha do painel aparecem no terminal. A demonstração usa um banco temporário em memória, que some ao fechar com `Ctrl+C`. Enviar banners e criar eventos exige o Vercel Blob configurado.

## Publicar na Vercel

1. **Projeto:** importe este repositório na Vercel.
2. **Banco:** em Storage, adicione o Neon. Isso cria a variável `DATABASE_URL`.
3. **Banners:** em Storage, crie um Blob store público. Isso cria a variável `BLOB_READ_WRITE_TOKEN`.
4. **Mapa:** no Google Cloud, ative a Maps Embed API e crie uma chave restrita ao domínio do site e somente a essa API. Salve-a na Vercel como `NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY`.
5. **Primeiro acesso:** salve na Vercel, em Production, as variáveis `BOOTSTRAP_ADMIN_EMAIL`, `BOOTSTRAP_ADMIN_NAME` e `BOOTSTRAP_ADMIN_PASSWORD_HASH` (gerado com `hashPassword`, de `src/lib/password.ts`). Elas só têm efeito enquanto não existe responsável, e a senha temporária é trocada no primeiro login.
6. **Deploy:** publique e entre em `/admin`. Cada publicação cria as tabelas que faltarem antes do build (`vercel.json`).

**Antes de divulgar o site, migre a conta da Vercel para o plano Pro.** O plano Hobby não permite uso comercial.

## Segurança

- **Segredos:** ficam só nas variáveis de ambiente da Vercel e no `.env.local`, que o Git ignora. Nunca coloque valores reais no `.env.example`.
- **Chave do mapa:** ela aparece no navegador por natureza. Por isso, a restrição no Google Cloud é obrigatória.
- **Senhas:** guardadas com scrypt, mínimo de 12 caracteres, com troca obrigatória da senha temporária.
- **Sessões:** o banco guarda só o hash do token, em cookie `HttpOnly`, `Secure` e `SameSite=Lax`, com validade de 7 dias. Desativar uma pessoa encerra o acesso na hora.
- **Tentativas de login:** bloqueio de 15 minutos após 5 erros na mesma conta e IP, ou 20 erros no mesmo IP.
- **Permissões:** o responsável gerencia usuários e eventos. Editores gerenciam só eventos.
- **Links e imagens:** o link de venda só aceita `https`. Banners só aceitam JPG, PNG e WebP de até 10 MB, sem SVG.

### Recomendado no GitHub

Em **Settings → Advanced Security**, ative **Secret scanning** e **Push protection**, se estiverem disponíveis para o repositório. Mantenha o repositório privado.

### Se um segredo vazar

Troque o segredo no serviço de origem primeiro, porque apagar o commit não basta. Depois, atualize o valor na Vercel e no `.env.local`.

## Tarefas comuns

| Tarefa | Como fazer |
| --- | --- |
| Adicionar uma pessoa ao painel | Painel → Usuários |
| Recuperar o acesso do responsável | `npm run admin:create -- email "Nome"` |
| Rodar os testes | `npm test` |
| Conferir os tipos | `npm run typecheck` |
