BEGIN;

-- Aggiunge colonna metriche JSONB nullable per dati engine-specifici (es. Flanker: rt_medio, accuratezzaValutativa, …)
ALTER TABLE public.sessioni
  ADD COLUMN IF NOT EXISTS metriche jsonb;

-- Aggiunge CHECK constraint su livello (1–20); se la colonna esiste già senza constraint, lo aggiunge
ALTER TABLE public.sessioni
  ADD CONSTRAINT sessioni_livello_check CHECK (livello BETWEEN 1 AND 20);

-- Indice composto full per query "ultime sessioni di questo esercizio per questo utente" (fetchUltimoLivelloEsercizio)
CREATE INDEX IF NOT EXISTS idx_sessioni_user_esercizio_created
  ON public.sessioni (user_id, esercizio_id, created_at DESC);

COMMIT;
