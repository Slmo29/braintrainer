// Tutte le durate sono in millisecondi (ms). Nessuna eccezione.
// sessionDurationMs usa valori letterali 90_000 | 120_000 — nessun campo in secondi.

import type { MicroProgressioneConfig } from "@/lib/exercise-types";

// ── Tipi stimolo ──────────────────────────────────────────────────────────────

export type Direzione = "sinistra" | "destra";

export interface FlankerStimolo {
  centrale: Direzione;
  /**
   * Lunghezza = nFlankers del livello corrente (2, 4 o 6).
   * Tutti gli elementi sono identici tra loro: o tutti === centrale (congruente)
   * o tutti !== centrale (incongruente). Non costruire FlankerStimolo manualmente:
   * usare generaPool in sequence.ts.
   */
  flankers: Direzione[];
  /**
   * Sempre uguale a (flankers[0] === centrale).
   * Ridondante ma utile per analytics (congruent_error_rate) senza ricalcolo.
   * Impostato da generaPool — non costruire FlankerStimolo manualmente.
   */
  congruente: boolean;
}

// ── Configurazione livello ────────────────────────────────────────────────────

export interface FlankerLevelConfig {
  /** Numero di livello (1–20). Esplicito per debug e lookup diretto. */
  livello: number;
  /** T.Lim risposta singolo trial (ms). È anche valoreBase per la micro-progressione. */
  tLimMs: number;
  /**
   * Proporzione di trial incongruenti all'interno di un blocco bilanciato.
   * Tutti i valori della tabella GDD sono multipli di 0.05.
   * Il bilanciamento avviene su blocchi di 20 trial (non 10) — vedi sequence.ts.
   */
  incongruentRatio: number;
  /**
   * Numero totale di frecce flanker (simmetriche: nFlankers / 2 per lato).
   * Cresce in 3 step: 2 (lv 1–5) → 4 (lv 6–15) → 6 (lv 16–20).
   */
  nFlankers: 2 | 4 | 6;
  /** Timer di sessione. see docs/gdd/families/flanker-task.md §Timer di sessione */
  sessionDurationMs: 90_000 | 120_000;
}

// ── Micro-progressione (costanti di famiglia) ──────────────────────────────────

/**
 * Parametri statici di micro-progressione per Flanker Task.
 * valoreBase non è incluso: dipende dal tLimMs del livello corrente e viene
 * iniettato dal game engine al momento della costruzione di MicroProgressioneConfig.
 * see docs/gdd/families/flanker-task.md §Micro-progressione
 */
export const MICRO_PROGRESSIONE_FLANKER = {
  delta:    -100,  // −100ms T.Lim per trial bonus
  maxDelta: 2,     // max −200ms oltre base (2 step)
  limite:   600,   // floor assoluto: T.Lim non scende sotto 600ms
} satisfies Omit<MicroProgressioneConfig, "valoreBase">;

// ── Warning cambio meccanica ──────────────────────────────────────────────────
// see docs/gdd/shared/02-trial-flow.md §Cambi di livello con cambio di meccanica
//
// I messaggi descrivono lo STATO CORRENTE (non la direzione del cambio):
// la stessa stringa funziona sia per promozione (4→6) che per regressione (6→4).

export const FLANKER_NFLANKERS_MESSAGES: Record<2 | 4 | 6, { titolo: string; testo: string }> = {
  2: { titolo: "Una freccia per lato",  testo: "Ora c'è 1 freccia per ogni lato. Guarda solo quella al centro." },
  4: { titolo: "Due frecce per lato",   testo: "Ora ci sono 2 frecce per ogni lato. Guarda solo quella al centro." },
  6: { titolo: "Tre frecce per lato",   testo: "Ora ci sono 3 frecce per ogni lato. Guarda solo quella al centro." },
};

/**
 * Restituisce il messaggio di avviso da mostrare al TrialFlow se il numero di
 * flanker è cambiato rispetto all'ultima sessione (promozione O regressione).
 * Restituisce null se non c'è cambio meccanica o se è la prima sessione.
 *
 * @param livelloPrec    livello dell'ultima sessione; null = prima sessione
 * @param livelloCorrente livello attuale
 */
export function getFlankerMechanicWarning(
  livelloPrec: number | null,
  livelloCorrente: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec === null) return null;
  const nPrev = getFlankerLevel(livelloPrec).nFlankers;
  const nCorr = getFlankerLevel(livelloCorrente).nFlankers;
  if (nPrev === nCorr) return null;
  return FLANKER_NFLANKERS_MESSAGES[nCorr];
}

// ── Tabella livelli (fonte: docs/gdd/families/flanker-task.md §Tabella livelli) ──

export const FLANKER_LEVELS: readonly FlankerLevelConfig[] = [
  { livello: 1,  tLimMs: 3000, incongruentRatio: 0.20, nFlankers: 2, sessionDurationMs: 90_000  },
  { livello: 2,  tLimMs: 2800, incongruentRatio: 0.20, nFlankers: 2, sessionDurationMs: 90_000  },
  { livello: 3,  tLimMs: 2600, incongruentRatio: 0.25, nFlankers: 2, sessionDurationMs: 90_000  },
  { livello: 4,  tLimMs: 2400, incongruentRatio: 0.25, nFlankers: 2, sessionDurationMs: 90_000  },
  { livello: 5,  tLimMs: 2200, incongruentRatio: 0.30, nFlankers: 2, sessionDurationMs: 90_000  },
  { livello: 6,  tLimMs: 2000, incongruentRatio: 0.30, nFlankers: 4, sessionDurationMs: 90_000  },
  { livello: 7,  tLimMs: 1900, incongruentRatio: 0.35, nFlankers: 4, sessionDurationMs: 90_000  },
  { livello: 8,  tLimMs: 1800, incongruentRatio: 0.35, nFlankers: 4, sessionDurationMs: 90_000  },
  { livello: 9,  tLimMs: 1700, incongruentRatio: 0.40, nFlankers: 4, sessionDurationMs: 90_000  },
  { livello: 10, tLimMs: 1600, incongruentRatio: 0.40, nFlankers: 4, sessionDurationMs: 90_000  },
  { livello: 11, tLimMs: 1500, incongruentRatio: 0.45, nFlankers: 4, sessionDurationMs: 120_000 },
  { livello: 12, tLimMs: 1400, incongruentRatio: 0.45, nFlankers: 4, sessionDurationMs: 120_000 },
  { livello: 13, tLimMs: 1300, incongruentRatio: 0.50, nFlankers: 4, sessionDurationMs: 120_000 },
  { livello: 14, tLimMs: 1200, incongruentRatio: 0.50, nFlankers: 4, sessionDurationMs: 120_000 },
  { livello: 15, tLimMs: 1100, incongruentRatio: 0.55, nFlankers: 4, sessionDurationMs: 120_000 },
  { livello: 16, tLimMs: 1000, incongruentRatio: 0.55, nFlankers: 6, sessionDurationMs: 120_000 },
  { livello: 17, tLimMs:  950, incongruentRatio: 0.60, nFlankers: 6, sessionDurationMs: 120_000 },
  { livello: 18, tLimMs:  900, incongruentRatio: 0.60, nFlankers: 6, sessionDurationMs: 120_000 },
  { livello: 19, tLimMs:  850, incongruentRatio: 0.65, nFlankers: 6, sessionDurationMs: 120_000 },
  { livello: 20, tLimMs:  800, incongruentRatio: 0.70, nFlankers: 6, sessionDurationMs: 120_000 },
] as const;

/**
 * Lookup diretto per livello (1-based). Preferire questo a FLANKER_LEVELS[livello - 1].
 * @throws se livello è fuori da 1–20 (invariante garantito dalla logica adattiva).
 */
export function getFlankerLevel(livello: number): FlankerLevelConfig {
  const cfg = FLANKER_LEVELS[livello - 1];
  if (!cfg) throw new RangeError(`Flanker: livello ${livello} fuori range 1–20`);
  return cfg;
}
