/**
 * Livelli per "Il Maestro di Bottega" — Linguaggio · Denominazione su definizione.
 *
 * Dominio: Linguaggio (categoria_id = "linguaggio").
 *
 * Costrutto: recupero lessicale da definizione (naming-by-definition). Il
 * maestro mostra la definizione di un oggetto/concetto e il giocatore deve
 * trovare la parola esatta.
 *
 * Due modalità:
 *   - "scelta": 4 opzioni (lv 1-3, livelli base)
 *   - "libera": campo di testo (lv 4-10, livelli avanzati)
 *
 * Curva di difficoltà:
 *   - frequenza/comunità della parola (concreta e quotidiana → astratta/colta)
 *   - distanza semantica dei distrattori (solo scelta multipla)
 *   - tempo limite per trial
 *
 * Timer sessione: 60s (Modello A).
 */

export const MAESTRO_SESSION_TIMER_MS = 60_000;

export type ModalitaMaestro = "scelta" | "libera";

export interface MaestroLevelConfig {
  livello:       number;
  modalita:      ModalitaMaestro;
  /** Numero opzioni in modalità "scelta". Ignorato in "libera". */
  numOpzioni:    4;
  tLimMs:        number;
  isiMs:         number;
  /** Fascia di difficoltà degli item (0-9). */
  difficoltaMin: number;
  difficoltaMax: number;
}

export const MAESTRO_LEVELS: readonly MaestroLevelConfig[] = [
  // lv 1-3: scelta multipla, oggetti concreti quotidiani
  { livello:  1, modalita: "scelta", numOpzioni: 4, tLimMs: 12000, isiMs: 600, difficoltaMin: 0, difficoltaMax: 1 },
  { livello:  2, modalita: "scelta", numOpzioni: 4, tLimMs: 11000, isiMs: 600, difficoltaMin: 0, difficoltaMax: 2 },
  { livello:  3, modalita: "scelta", numOpzioni: 4, tLimMs: 10000, isiMs: 550, difficoltaMin: 1, difficoltaMax: 3 },
  // lv 4-6: risposta libera, oggetti quotidiani
  { livello:  4, modalita: "libera", numOpzioni: 4, tLimMs: 14000, isiMs: 550, difficoltaMin: 2, difficoltaMax: 4 },
  { livello:  5, modalita: "libera", numOpzioni: 4, tLimMs: 13000, isiMs: 500, difficoltaMin: 3, difficoltaMax: 5 },
  { livello:  6, modalita: "libera", numOpzioni: 4, tLimMs: 12000, isiMs: 500, difficoltaMin: 4, difficoltaMax: 6 },
  // lv 7-8: parole meno comuni / mestieri
  { livello:  7, modalita: "libera", numOpzioni: 4, tLimMs: 12000, isiMs: 500, difficoltaMin: 5, difficoltaMax: 7 },
  { livello:  8, modalita: "libera", numOpzioni: 4, tLimMs: 11000, isiMs: 450, difficoltaMin: 6, difficoltaMax: 8 },
  // lv 9-10: lessico ricco, concetti astratti
  { livello:  9, modalita: "libera", numOpzioni: 4, tLimMs: 11000, isiMs: 450, difficoltaMin: 7, difficoltaMax: 9 },
  { livello: 10, modalita: "libera", numOpzioni: 4, tLimMs: 10000, isiMs: 400, difficoltaMin: 8, difficoltaMax: 9 },
] as const;

export function getMaestroLevel(livello: number): MaestroLevelConfig {
  return MAESTRO_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getMaestroMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec !== null && livelloPrec <= 3 && livello === 4) {
    return {
      titolo: "Ora si scrive la risposta",
      testo:
        "Da questo livello non ci sono più le quattro opzioni: il maestro " +
        "ti chiede di scrivere tu stesso la parola nella casella. " +
        "Non importano accenti o maiuscole, l'importante è la parola giusta.",
    };
  }
  return null;
}
