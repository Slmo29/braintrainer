-- ─── Estende user_levels per la logica di progressione GDD shared/03 ─────────
--
-- La tabella esistente (migration 20260421000003) ha solo livello_corrente.
-- La progressione inter-livello richiede:
--
--   ultime_accuratezze            : ultime 3 accuratezze valutative del dominio
--                                   (esclusi trial bonus, vedi shared/03-progression.md).
--                                   FLOAT8[] cresce fino a 3 elementi; la logica
--                                   app mantiene solo gli ultimi 3 (FIFO).
--                                   Decisione: promozione se tutti e 3 >= 80%;
--                                   retrocessione se 2 consecutivi con almeno 1 < 60%.
--
--   sessioni_sotto_60_consecutive : contatore "sessioni consecutive con almeno un
--                                   esercizio < 60%". Resettato a 0 quando una
--                                   sessione supera il 60%. Retrocessione quando = 2.
--
-- La logica di promozione/retrocessione è implementata in lib/sync.ts;
-- queste colonne sono il solo stato persistente necessario oltre al livello.

ALTER TABLE user_levels
  ADD COLUMN IF NOT EXISTS ultime_accuratezze          FLOAT8[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS sessioni_sotto_60_consecutive INT    NOT NULL DEFAULT 0;

-- Commento descrittivo sulle soglie (non vincoli DB, gestiti a livello app):
-- Promozione : tutti e 3 in ultime_accuratezze >= 0.80
-- Mantenimento: almeno uno < 0.80 ma nessuno < 0.60
-- Retrocessione: sessioni_sotto_60_consecutive >= 2
COMMENT ON COLUMN user_levels.ultime_accuratezze IS
  'Ultime 3 accuratezze valutative del dominio (0.0–1.0). Array FIFO, max 3 elementi.';
COMMENT ON COLUMN user_levels.sessioni_sotto_60_consecutive IS
  'Sessioni consecutive con almeno un esercizio < 60%. Retrocessione a quota 2.';
