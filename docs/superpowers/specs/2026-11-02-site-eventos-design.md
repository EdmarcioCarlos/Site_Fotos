# Site de eventos PhotoPRO: especificação

Data: 2026-11-02

## Objetivo

Divulgar os eventos fotografados pela PhotoPRO e levar o visitante ao site externo onde as fotos são vendidas. O site não vende nada. Sucesso: um administrador cadastra um evento sem ajuda técnica, e um visitante no celular chega à galeria de compra em poucos toques.

## Decisões

| Tema | Decisão | Motivo |
| --- | --- | --- |
| Hospedagem | Vercel, Hobby nos testes e Pro antes de divulgar | Escolha do usuário. O Hobby proíbe uso comercial |
| Código | GitHub privado, só com o código | Escolha do usuário |
| Banco | Neon (Postgres), plano Free | Não pausa o projeto por inatividade |
| Banners | Vercel Blob público, com envio direto do navegador | Evita o limite de corpo de requisição das funções |
| Mapa | Endereço digitado, com Maps Embed e link "Como chegar" | Gratuito e sem autocompletar pago |
| Acesso ao painel | Vários usuários, papéis `owner` e `editor` | Escolha do usuário |
| Login | E-mail e senha forte, sem 2FA | Escolha do usuário |
| Visitantes | Nenhum dado coletado | Escolha do usuário |

## Telas

- **Página inicial:** eventos publicados em cartões, do mais recente ao mais antigo.
- **Página do evento:** banner, nome, data, cidade, descrição, botão "Ver e comprar fotos", mapa e "Como chegar".
- **Login:** e-mail e senha.
- **Eventos:** lista com criar, editar, publicar, ocultar e excluir.
- **Formulário do evento:** nome, banner, data, cidade, endereço com mapa, descrição até 280 caracteres, link de venda e publicação.
- **Usuários (só `owner`):** criar editor, gerar nova senha, desativar e reativar.
- **Minha senha:** obrigatória no primeiro acesso.

A data e a cidade foram acrescentadas aos campos pedidos: a data ordena os eventos, e a cidade aparece nos cartões.

## Visual

Baseado na logo: fundo preto, texto branco, vermelho `#CB1718` nos destaques, títulos em fonte condensada fina e a linha pontilhada como divisor.

## Dados

Tabelas em `db/schema.sql`: `events`, `users`, `sessions` e `login_attempts`. O endereço de um evento (`slug`) não muda ao editar, para não quebrar links já compartilhados.

## Segurança

- **Segredos:** só em variáveis de ambiente. O `.gitignore` bloqueia `.env*`, exceto o modelo `.env.example`.
- **Senhas:** scrypt, com mínimo de 12 caracteres, e temporárias de troca obrigatória.
- **Sessões:** token aleatório em cookie `HttpOnly`, `Secure` e `SameSite=Lax`. O banco guarda apenas o hash, o que permite revogar na hora.
- **Autorização:** verificada em toda página, Server Action e rota de envio, não só no layout.
- **Força bruta:** limite persistido no banco, porque a memória não é compartilhada entre funções da Vercel.
- **Entrada:** validação no servidor, SQL sempre parametrizado, link de venda só `https` e banner só do domínio do Blob.
- **Navegador:** CSP, `X-Frame-Options`, `nosniff`, HSTS e `noindex` no painel.

## Cache

As páginas públicas usam ISR de 1 hora e são revalidadas na hora a cada alteração no painel. Isso reduz os acessos ao banco.

## Fora do escopo

Venda no próprio site, galeria de fotos, 2FA, histórico de alterações, recuperação de senha por e-mail e estatísticas de visitas.

## Limitações conhecidas

- A chave do mapa é pública por natureza, e a proteção é a restrição no Google Cloud.
- Um banner enviado em um formulário abandonado fica sem uso no Blob.
- O limite de tentativas usa o IP informado pela Vercel, e um atacante com muitos IPs fica limitado só pelo teto por conta e IP.
