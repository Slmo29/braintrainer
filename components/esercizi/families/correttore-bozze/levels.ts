/**
 * Livelli per "Il Correttore di Bozze" — Linguaggio · Rilevamento errori semantici e sintattici.
 *
 * Modello A: timer di sessione 60s + T.Lim per trial (per evitare che l'utente
 * resti bloccato su una singola bozza per tutta la sessione). Allo scadere del
 * T.Lim la bozza è contata come omissione (errore non trovato).
 *
 * Curva difficoltà:
 *   - lv 1-2:  frasi brevi, errori semantici evidenti (T.Lim largo)
 *   - lv 3-5:  frasi medie, errori semantici meno ovvi
 *   - lv 6-8:  frasi lunghe, errori semantici sottili
 *   - lv 9-10: frasi complesse, errori semantici sottili o sintattici (T.Lim più stretto)
 */

export const CORRETTORE_SESSION_TIMER_MS = 60_000;

export interface CorrettoreLevelConfig {
  livello:       number;
  /** Tipo di errori ammessi nel pool del livello. */
  tipiErrore:    readonly ("semantico" | "sintattico")[];
  /** Fascia di difficoltà degli item (0-9). */
  difficoltaMin: number;
  difficoltaMax: number;
  /** Tempo limite per singola bozza in ms. Allo scadere → omissione. */
  tLimMs:        number;
}

export const CORRETTORE_LEVELS: readonly CorrettoreLevelConfig[] = [
  // lv 1-2: frasi brevi, errori palesi
  { livello:  1, tipiErrore: ["semantico"],                difficoltaMin: 0, difficoltaMax: 1, tLimMs: 12_000 },
  { livello:  2, tipiErrore: ["semantico"],                difficoltaMin: 0, difficoltaMax: 2, tLimMs: 11_000 },
  // lv 3-5: frasi medie
  { livello:  3, tipiErrore: ["semantico"],                difficoltaMin: 1, difficoltaMax: 3, tLimMs: 11_000 },
  { livello:  4, tipiErrore: ["semantico"],                difficoltaMin: 2, difficoltaMax: 4, tLimMs: 10_000 },
  { livello:  5, tipiErrore: ["semantico"],                difficoltaMin: 3, difficoltaMax: 5, tLimMs: 10_000 },
  // lv 6-7: frasi lunghe, errori semantici molto sottili (parole vicine, non opposte)
  { livello:  6, tipiErrore: ["semantico"],                difficoltaMin: 4, difficoltaMax: 6, tLimMs: 11_000 },
  { livello:  7, tipiErrore: ["semantico"],                difficoltaMin: 5, difficoltaMax: 7, tLimMs: 11_000 },
  // lv 8-10: anche sintattici (consecutio, reggenze, concordanza), errori fini
  { livello:  8, tipiErrore: ["semantico", "sintattico"],  difficoltaMin: 6, difficoltaMax: 8, tLimMs: 10_000 },
  { livello:  9, tipiErrore: ["semantico", "sintattico"],  difficoltaMin: 7, difficoltaMax: 9, tLimMs: 9_000  },
  { livello: 10, tipiErrore: ["semantico", "sintattico"],  difficoltaMin: 8, difficoltaMax: 9, tLimMs: 9_000  },
] as const;

export function getCorrettoreLevel(livello: number): CorrettoreLevelConfig {
  return CORRETTORE_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}
