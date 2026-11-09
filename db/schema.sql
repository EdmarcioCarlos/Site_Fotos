-- Estrutura do banco. Pode ser executado mais de uma vez: npm run db:migrate

CREATE TABLE IF NOT EXISTS users (
  id                   uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email                text NOT NULL UNIQUE,
  name                 text NOT NULL,
  password_hash        text NOT NULL,
  role                 text NOT NULL CHECK (role IN ('owner', 'editor')),
  active               boolean NOT NULL DEFAULT true,
  must_change_password boolean NOT NULL DEFAULT true,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Guarda apenas o hash do token da sessão: um vazamento do banco não dá acesso ao painel.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id    uuid NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id);

CREATE TABLE IF NOT EXISTS login_attempts (
  key            text PRIMARY KEY,
  failures       integer NOT NULL,
  window_started timestamptz NOT NULL
);

CREATE TABLE IF NOT EXISTS events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text NOT NULL UNIQUE,
  name        varchar(120) NOT NULL,
  description varchar(280) NOT NULL,
  address     varchar(300) NOT NULL,
  city        varchar(100) NOT NULL,
  event_date  date NOT NULL,
  banner_url  text NOT NULL,
  sales_url   text NOT NULL,
  published   boolean NOT NULL DEFAULT false,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS events_published_date_idx ON events (published, event_date DESC);

ALTER TABLE events ADD COLUMN IF NOT EXISTS details text NOT NULL DEFAULT '';
ALTER TABLE events ADD COLUMN IF NOT EXISTS hide_ads boolean NOT NULL DEFAULT false;

-- Configurações globais do site (chave-valor)
CREATE TABLE IF NOT EXISTS site_settings (
  key   text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Modalidades/Categorias de eventos
CREATE TABLE IF NOT EXISTS categories (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name        varchar(80) NOT NULL UNIQUE,
  slug        varchar(80) NOT NULL UNIQUE,
  description text NOT NULL DEFAULT '',
  color       varchar(7) NOT NULL DEFAULT '#cb1718',
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Adiciona categoria aos eventos
ALTER TABLE events ADD COLUMN IF NOT EXISTS category_id uuid REFERENCES categories (id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS events_category_idx ON events (category_id);

-- Categorias padrão (exemplos iniciais, podem ser editadas/excluídas no painel)
INSERT INTO categories (name, slug, description, color) VALUES
  ('Futebol', 'futebol', 'Eventos de futebol e campeonatos', '#cb1718'),
  ('Vôlei', 'volei', 'Eventos de vôlei e torneios', '#2563eb'),
  ('Airsoft', 'airsoft', 'Eventos de airsoft e jogos táticos', '#16a34a'),
  ('Corporativo', 'corporativo', 'Eventos empresariais e corporativos', '#7c3aed')
ON CONFLICT (slug) DO NOTHING;
