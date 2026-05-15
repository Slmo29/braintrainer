/**
 * "L'Analogo" — analogie verbali visuali.
 * 10 livelli progressivi: oppositiva → funzionale → categoriale → astratta.
 */

export type TipoAnalogia = "oppositiva" | "funzionale" | "categoriale" | "astratta";

export interface AnalogoLevelConfig {
  livello:          number;
  tLimMs:           number;
  tipo:             TipoAnalogia;
  /** Difficoltà distrattori: bassa = lontani, alta = semanticamente vicini. */
  distrattoriDuri:  boolean;
  trialsPerSession: number;
}

export const SESSION_TIMER_MS = 60_000;
export const FLOOR_TLIM_ANALOGO = 2500;

export const ANALOGO_LEVELS: readonly AnalogoLevelConfig[] = [
  { livello:  1, tLimMs: 9000, tipo: "oppositiva",  distrattoriDuri: false, trialsPerSession: 8  },
  { livello:  2, tLimMs: 8000, tipo: "oppositiva",  distrattoriDuri: false, trialsPerSession: 9  },
  { livello:  3, tLimMs: 7000, tipo: "oppositiva",  distrattoriDuri: true,  trialsPerSession: 10 },
  { livello:  4, tLimMs: 8000, tipo: "funzionale",  distrattoriDuri: false, trialsPerSession: 10 },
  { livello:  5, tLimMs: 7000, tipo: "funzionale",  distrattoriDuri: false, trialsPerSession: 11 },
  { livello:  6, tLimMs: 6500, tipo: "funzionale",  distrattoriDuri: true,  trialsPerSession: 12 },
  { livello:  7, tLimMs: 7000, tipo: "categoriale", distrattoriDuri: false, trialsPerSession: 12 },
  { livello:  8, tLimMs: 6000, tipo: "categoriale", distrattoriDuri: true,  trialsPerSession: 13 },
  { livello:  9, tLimMs: 7000, tipo: "astratta",    distrattoriDuri: false, trialsPerSession: 12 },
  { livello: 10, tLimMs: 6000, tipo: "astratta",    distrattoriDuri: true,  trialsPerSession: 13 },
];

export function getAnalogoLevel(livello: number): AnalogoLevelConfig {
  const idx = Math.min(10, Math.max(1, livello)) - 1;
  return ANALOGO_LEVELS[idx];
}
