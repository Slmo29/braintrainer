-- ─── Redesign tabella esercizi secondo GDD shared/07-catalog.md ─────────────
--
-- La vecchia tabella usava un modello (id, livello, difficolta, config) che
-- non è compatibile con le specifiche GDD: livelli sono per-utente, ogni
-- esercizio ha un id fisso, parametri strutturati per famiglia.
--
-- Dipendenze da gestire prima del DROP:
--   sessioni.esercizio_id → esercizi(id)
--   esercizi_del_giorno.esercizio_id → esercizi(id)

-- ─── 1. Svuota esercizi_del_giorno (dati di rotazione, ricreabili) ───────────
TRUNCATE TABLE esercizi_del_giorno;

-- ─── 2. Rimuovi esercizi con CASCADE (drop FK su sessioni e edg) ──────────────
DROP TABLE IF EXISTS esercizi CASCADE;

-- ─── 3. Crea nuova tabella esercizi ──────────────────────────────────────────
--
-- Colonne chiave:
--   id               : slug GDD (es. 'sequence_tap_numeri_forward')
--   famiglia         : nome famiglia (es. 'Sequence Tap')
--   nome             : nome italiano visualizzato in app
--   categoria_id     : FK a categorie (slug dominio cognitivo)
--   memoria_type     : 'mbt' | 'mlt' | null (null per esercizi non di memoria)
--   modello_sessione : 'timer' = 90/120s fisso | 'completamento' = N trial fissi
--   session_timer_sec: durata sessione in secondi (90 o 120); NULL se completamento
--   trials_per_session: trial per sessione; NULL se timer
--   params           : JSONB con parametri per-livello della famiglia (popolato
--                      quando il game engine della famiglia viene implementato)
--   ordine_in_famiglia: posizione all'interno della famiglia per ordinamento UI
--
CREATE TABLE esercizi (
  id                   TEXT        PRIMARY KEY,
  famiglia             TEXT        NOT NULL,
  nome                 TEXT        NOT NULL,
  categoria_id         TEXT        NOT NULL REFERENCES categorie(id),
  memoria_type         TEXT        CHECK (memoria_type IN ('mbt', 'mlt')),
  modello_sessione     TEXT        NOT NULL DEFAULT 'timer'
                                   CHECK (modello_sessione IN ('timer', 'completamento')),
  session_timer_sec    INT         CHECK (session_timer_sec IN (90, 120)),
  trials_per_session   INT,
  params               JSONB       NOT NULL DEFAULT '{}',
  attivo               BOOLEAN     NOT NULL DEFAULT TRUE,
  ordine_in_famiglia   INT         NOT NULL DEFAULT 0,
  created_at           TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ─── 4. RLS ──────────────────────────────────────────────────────────────────
ALTER TABLE esercizi ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read esercizi" ON esercizi FOR SELECT USING (true);

-- ─── 5. Ripristina FK su sessioni (NOT VALID: non valida righe storiche) ─────
--
-- Le sessioni storiche hanno esercizio_id che puntano ai vecchi ID e non
-- corrispondono al nuovo catalogo. NOT VALID garantisce integrità referenziale
-- solo per i nuovi insert, lasciando intatto lo storico.
--
ALTER TABLE sessioni
  ADD CONSTRAINT sessioni_esercizio_id_fkey
  FOREIGN KEY (esercizio_id) REFERENCES esercizi(id)
  NOT VALID;

-- ─── 6. Ripristina FK su esercizi_del_giorno ─────────────────────────────────
ALTER TABLE esercizi_del_giorno
  ADD CONSTRAINT esercizi_del_giorno_esercizio_id_fkey
  FOREIGN KEY (esercizio_id) REFERENCES esercizi(id);
