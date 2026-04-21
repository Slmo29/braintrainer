-- Aggiunge colonna giorni alla tabella medaglie
ALTER TABLE medaglie ADD COLUMN IF NOT EXISTS giorni INTEGER;

-- Svuota i record precedenti
TRUNCATE TABLE user_medaglie;
DELETE FROM medaglie;

-- Inserisce le medaglie streak coerenti con il frontend
INSERT INTO medaglie (id, nome, giorni, tipo, condizione) VALUES
  ('giorno-1',   'Primo giorno',            1,   'streak', '{"tipo": "streak", "valore": 1}'::jsonb),
  ('giorni-2',   '2 giorni consecutivi',    2,   'streak', '{"tipo": "streak", "valore": 2}'::jsonb),
  ('giorni-3',   '3 giorni consecutivi',    3,   'streak', '{"tipo": "streak", "valore": 3}'::jsonb),
  ('giorni-7',   '7 giorni consecutivi',    7,   'streak', '{"tipo": "streak", "valore": 7}'::jsonb),
  ('giorni-10',  '10 giorni consecutivi',   10,  'streak', '{"tipo": "streak", "valore": 10}'::jsonb),
  ('giorni-14',  '14 giorni consecutivi',   14,  'streak', '{"tipo": "streak", "valore": 14}'::jsonb),
  ('giorni-28',  '28 giorni consecutivi',   28,  'streak', '{"tipo": "streak", "valore": 28}'::jsonb),
  ('giorni-50',  '50 giorni consecutivi',   50,  'streak', '{"tipo": "streak", "valore": 50}'::jsonb),
  ('giorni-100', '100 giorni consecutivi',  100, 'streak', '{"tipo": "streak", "valore": 100}'::jsonb),
  ('giorni-200', '200 giorni consecutivi',  200, 'streak', '{"tipo": "streak", "valore": 200}'::jsonb),
  ('giorni-365', '365 giorni consecutivi',  365, 'streak', '{"tipo": "streak", "valore": 365}'::jsonb);
