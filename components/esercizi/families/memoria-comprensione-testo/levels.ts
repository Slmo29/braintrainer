/**
 * components/esercizi/families/memoria-comprensione-testo/levels.ts
 *
 * Livelli per Memoria e Comprensione del Testo — varianti MBT:
 *   memoria_comprensione_fattuale_mbt
 *   memoria_comprensione_inferenziale_mbt
 *
 * Tabella A (condivisa per entrambe le varianti, GDD Famiglia 8).
 * Modello B — sessione a completamento.
 * Micro-progressione: +1 domanda per trial bonus (max +2, ceiling 5).
 */

export interface MCTLevelConfig {
  livello:          number;
  nFrasi:           number;  // lunghezza testo (filtra il pool)
  nDomande:         number;  // domande per trial
  nOpzioni:         number;  // opzioni per domanda (3 o 4)
  trialsPerSession: number;
}

export const MCT_LEVELS: readonly MCTLevelConfig[] = [
  { livello:  1, nFrasi: 3, nDomande: 1, nOpzioni: 3, trialsPerSession: 4 },
  { livello:  2, nFrasi: 3, nDomande: 1, nOpzioni: 3, trialsPerSession: 4 },
  { livello:  3, nFrasi: 4, nDomande: 1, nOpzioni: 3, trialsPerSession: 4 },
  { livello:  4, nFrasi: 4, nDomande: 2, nOpzioni: 3, trialsPerSession: 5 },
  { livello:  5, nFrasi: 4, nDomande: 2, nOpzioni: 3, trialsPerSession: 5 },
  { livello:  6, nFrasi: 5, nDomande: 2, nOpzioni: 3, trialsPerSession: 5 },
  { livello:  7, nFrasi: 5, nDomande: 2, nOpzioni: 4, trialsPerSession: 5 },
  { livello:  8, nFrasi: 5, nDomande: 2, nOpzioni: 4, trialsPerSession: 5 },
  { livello:  9, nFrasi: 6, nDomande: 2, nOpzioni: 4, trialsPerSession: 5 },
  { livello: 10, nFrasi: 6, nDomande: 3, nOpzioni: 4, trialsPerSession: 5 },
];

export const MCT_MICRO_DELTA    = 1;
export const MCT_MICRO_MAX_OVER = 2;

export function getMCTLevel(livello: number): MCTLevelConfig {
  return MCT_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getMCTMechanicWarning(
  livelloPrec: number | undefined,
  livelloCorrente: number,
): string | null {
  if (livelloPrec === 6 && livelloCorrente === 7) {
    return "Da questo livello ogni domanda avrà quattro possibili risposte invece di tre.";
  }
  return null;
}
