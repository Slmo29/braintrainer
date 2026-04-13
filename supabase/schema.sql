-- BrainTrainer — Schema DB V2
-- Eseguire su Supabase SQL Editor

-- ─── Utenti senior ───────────────────────────────────────────────────────────
create table if not exists users (
  id               uuid primary key default gen_random_uuid(),
  nome             text not null,
  cognome          text,
  telefono         text unique,
  email            text unique,
  anno_nascita     integer,
  genere           text check (genere in ('M', 'F')),  -- usato per calcolare etichetta relazione in /famigliare
  orario_notifica  time default '09:00',
  canale_notifica  text default 'whatsapp', -- 'whatsapp' | 'sms' | 'email'
  consenso_notifiche boolean default false,
  created_at       timestamptz default now()
);

-- ─── Categorie esercizi ───────────────────────────────────────────────────────
create table if not exists categorie (
  id          text primary key,             -- slug leggibile: 'memoria', 'attenzione', ecc.
  nome        text not null,
  icona       text not null,
  descrizione text,
  colore      text
);

-- ─── Esercizi ────────────────────────────────────────────────────────────────
create table if not exists esercizi (
  id              text primary key,         -- slug leggibile: 'ricorda-parole-1', ecc.
  categoria_id    text references categorie(id),
  titolo          text not null,
  descrizione     text,
  livello         integer not null default 1 check (livello between 1 and 6),
  difficolta      text default 'facile',    -- 'facile' | 'medio' | 'difficile'
  durata_stimata  integer,                  -- secondi
  beneficio       text,
  config          jsonb,
  attivo          boolean default true,
  created_at      timestamptz default now()
);

-- ─── Sessioni di esercizio completate ────────────────────────────────────────
create table if not exists sessioni (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  esercizio_id text references esercizi(id),
  categoria_id text references categorie(id),  -- denormalizzato per query analytics rapide
  score        integer,
  accuratezza  integer,                         -- percentuale 0-100
  durata       integer,                         -- secondi
  completato   boolean default true,
  created_at   timestamptz default now()
);

-- ─── Medaglie definizione ─────────────────────────────────────────────────────
create table if not exists medaglie (
  id          text primary key,             -- slug: 'prima-sfida', 'tre-giorni', ecc.
  nome        text not null,
  descrizione text,
  icona       text,
  tipo        text,
  condizione  jsonb,
  created_at  timestamptz default now()
);

-- ─── Medaglie utente ──────────────────────────────────────────────────────────
create table if not exists user_medaglie (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,
  medaglia_id  text references medaglie(id),
  guadagnata_at timestamptz default now(),
  unique(user_id, medaglia_id)
);

-- ─── Esercizio del giorno ─────────────────────────────────────────────────────
create table if not exists esercizi_del_giorno (
  id           uuid primary key default gen_random_uuid(),
  esercizio_id text references esercizi(id),
  data         date unique default current_date
);

-- ─── Familiari collegati ──────────────────────────────────────────────────────
-- Un familiare è una persona esterna che monitora i progressi dell'utente senior.
-- Viene creato quando accetta l'invito tramite token.
create table if not exists familiari (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid references users(id) on delete cascade,  -- il senior monitorato
  nome         text not null,
  relazione    text not null,          -- 'Figlio', 'Figlia', 'Nipote', ecc.
  telefono     text,
  collegato_at timestamptz default now(),
  permessi     jsonb default '{"attivita": true, "medaglie": true, "progressi": true}'::jsonb,
  created_at   timestamptz default now()
);

-- ─── Inviti familiari ─────────────────────────────────────────────────────────
-- Token monouso inviato via SMS/email per invitare un familiare.
create table if not exists inviti (
  id                  uuid primary key default gen_random_uuid(),
  token               text unique not null,
  mittente_id         uuid references users(id) on delete cascade,
  nome_destinatario   text not null,
  contatto            text not null,   -- email o numero di telefono
  relazione           text not null,
  status              text default 'pending',  -- 'pending' | 'accepted' | 'expired'
  created_at          timestamptz default now(),
  expires_at          timestamptz default (now() + interval '7 days')
);

-- ─── Messaggi familiari ───────────────────────────────────────────────────────
-- Messaggi di incoraggiamento inviati dai familiari al senior.
-- Il mittente è un familiare (non un utente full), il destinatario è il senior.
-- JOIN con familiari per ottenere nome e relazione del mittente.
create table if not exists messaggi (
  id              uuid primary key default gen_random_uuid(),
  familiare_id    uuid references familiari(id) on delete cascade, -- chi invia (il familiare)
  destinatario_id uuid references users(id) on delete cascade,     -- chi riceve (il senior)
  testo           text not null,
  categoria       text,   -- 'Incoraggiamento' | 'Promemoria' | 'Affetto' | 'Celebrazione'
  letto           boolean default false,
  created_at      timestamptz default now()
);

-- ─── RLS — Row Level Security ─────────────────────────────────────────────────

alter table users              enable row level security;
alter table categorie          enable row level security;
alter table esercizi           enable row level security;
alter table sessioni           enable row level security;
alter table medaglie           enable row level security;
alter table user_medaglie      enable row level security;
alter table esercizi_del_giorno enable row level security;
alter table familiari          enable row level security;
alter table inviti             enable row level security;
alter table messaggi           enable row level security;

-- users
create policy "Users: read own profile"   on users for select using (auth.uid() = id);
create policy "Users: update own profile" on users for update using (auth.uid() = id);
create policy "Users: insert own profile" on users for insert with check (auth.uid() = id);

-- sessioni
create policy "Sessioni: read own"   on sessioni for select using (auth.uid() = user_id);
create policy "Sessioni: insert own" on sessioni for insert with check (auth.uid() = user_id);

-- user_medaglie
create policy "Medaglie utente: read own" on user_medaglie for select using (auth.uid() = user_id);

-- familiari — il senior legge/gestisce i propri familiari
create policy "Familiari: read own"   on familiari for select using (auth.uid() = user_id);
create policy "Familiari: insert own" on familiari for insert with check (auth.uid() = user_id);
create policy "Familiari: delete own" on familiari for delete using (auth.uid() = user_id);

-- inviti — il senior gestisce i propri inviti
create policy "Inviti: read own"   on inviti for select using (auth.uid() = mittente_id);
create policy "Inviti: insert own" on inviti for insert with check (auth.uid() = mittente_id);
-- lettura pubblica per token (validazione al click del link)
create policy "Inviti: read by token" on inviti for select using (true);

-- messaggi — il senior legge i messaggi ricevuti; insert aperto (il familiare non ha auth)
create policy "Messaggi: read own"  on messaggi for select using (auth.uid() = destinatario_id);
create policy "Messaggi: insert"    on messaggi for insert with check (true); -- il familiare accede via token, non via auth
create policy "Messaggi: mark read" on messaggi for update using (auth.uid() = destinatario_id);

-- Accesso pubblico in lettura per dati statici
create policy "Public read categorie"          on categorie          for select using (true);
create policy "Public read esercizi"           on esercizi           for select using (true);
create policy "Public read medaglie"           on medaglie           for select using (true);
create policy "Public read esercizi_del_giorno" on esercizi_del_giorno for select using (true);
