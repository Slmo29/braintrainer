-- ─── Backfill user_levels per utenti già registrati ─────────────────────────
--
-- Per ogni utente in users, garantisce l'esistenza di 5 righe in user_levels
-- (una per dominio cognitivo) con livello 1 e stato progressione azzerato.
--
-- Idempotente: INSERT ... ON CONFLICT DO NOTHING — sicuro se già parzialmente
-- applicata o se l'utente ha già alcune righe (es. solo 3 domini su 5).
-- Non sovrascrive righe esistenti (livello e finestra vengono preservati).
--
-- Le due colonne aggiunte dalla migration 20260427000002 (ultime_accuratezze,
-- sessioni_sotto_60_consecutive) hanno DEFAULT su ALTER TABLE, quindi le righe
-- già esistenti sono già corrette senza bisogno di UPDATE.

INSERT INTO user_levels (user_id, categoria_id, livello_corrente, ultime_accuratezze, sessioni_sotto_60_consecutive)
SELECT
  u.id             AS user_id,
  c.id             AS categoria_id,
  1                AS livello_corrente,
  '{}'::float8[]   AS ultime_accuratezze,
  0                AS sessioni_sotto_60_consecutive
FROM
  users u
  CROSS JOIN categorie c
ON CONFLICT (user_id, categoria_id)
  DO NOTHING;
