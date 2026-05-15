/**
 * Livelli per "Il Vivaio" — Flessibilità attentiva · Task switching inferenziale.
 *
 * Dominio: Funzioni Esecutive (categoria_id = "esecutive").
 * Modello: A (timer-based) — 60s di sessione, trial liberi a flusso continuo.
 *
 * Sei dimensioni di stimolo (sbloccate progressivamente):
 *   1. colore — colore dei petali
 *   2. forma  — margherita / tulipano / girasole
 *   3. numero — 1, 2, 3 fiori sulla carta
 *   4. taglia — piccolo, medio, grande
 *   5. gambo  — colore del gambo + foglia (sbloccato lv 7+)
 *   6. sfondo — tinta dello sfondo della carta/tile (sbloccato lv 9+)
 *
 * I 3 mazzi di riferimento sono un quadrato latino indipendente su ciascuna
 * dimensione: per ogni dim, i 3 valori sono distribuiti uno per mazzo.
 */

export const VIVAIO_SESSION_TIMER_MS = 60_000;

export type Dimensione = "colore" | "forma" | "numero" | "taglia" | "gambo" | "sfondo";

export type Colore = "rosa" | "giallo" | "lavanda";
export type Forma  = "margherita" | "tulipano" | "girasole";
export type Numero = 1 | 2 | 3;
export type Taglia = "piccolo" | "medio" | "grande";
export type Gambo  = "verde" | "oliva" | "secco";
export type Sfondo = "panna" | "salvia" | "cielo";

/** Etichette user-facing per le dimensioni (l'id interno resta invariato). */
export const DIMENSIONE_LABEL: Record<Dimensione, string> = {
  colore: "colore",
  forma:  "tipo",
  numero: "numero",
  taglia: "taglia",
  gambo:  "gambo",
  sfondo: "sfondo",
};

export const COLORI: readonly Colore[] = ["rosa", "giallo", "lavanda"];
export const FORME:  readonly Forma[]  = ["margherita", "tulipano", "girasole"];
export const NUMERI: readonly Numero[] = [1, 2, 3];
export const TAGLIE: readonly Taglia[] = ["piccolo", "medio", "grande"];
export const GAMBI:  readonly Gambo[]  = ["verde", "oliva", "secco"];
export const SFONDI: readonly Sfondo[] = ["panna", "salvia", "cielo"];

/** Palette petali. */
export const COLORE_PALETTE: Record<Colore, { fill: string; stroke: string; light: string }> = {
  rosa:    { fill: "#F9A8D4", stroke: "#9D174D", light: "#FCE7F3" },
  giallo:  { fill: "#FCD34D", stroke: "#92400E", light: "#FEF3C7" },
  lavanda: { fill: "#C4B5FD", stroke: "#5B21B6", light: "#EDE9FE" },
};

/** Palette gambo: colore dello stelo + della foglia. */
export const GAMBO_PALETTE: Record<Gambo, { stem: string; leaf: string }> = {
  verde:  { stem: "#15803D", leaf: "#22C55E" }, // verde foresta + verde brillante
  oliva:  { stem: "#65A30D", leaf: "#A3CC4A" }, // oliva scuro + oliva chiaro
  secco:  { stem: "#92400E", leaf: "#C2A05B" }, // marrone legnoso + ocra
};

/** Palette sfondi della carta/tile. */
export const SFONDO_PALETTE: Record<Sfondo, string> = {
  panna:  "#FAF3E0",
  salvia: "#E2EBDA",
  cielo:  "#DDE7F0",
};

/** Scala visiva per dimensione taglia. */
export const TAGLIA_SCALE: Record<Taglia, number> = {
  piccolo: 0.72,
  medio:   1.00,
  grande:  1.30,
};

export interface VivaioLevelConfig {
  livello:      number;
  regoleAttive: readonly Dimensione[];
  switchMin:    number;
  switchMax:    number;
  tLimMs:       number;
  isiMs:        number;
}

export const VIVAIO_LEVELS: readonly VivaioLevelConfig[] = [
  // lv 1–2: 2 dim
  { livello:  1, regoleAttive: ["colore", "forma"],                                                  switchMin: 5, switchMax: 7, tLimMs: 10000, isiMs: 600 },
  { livello:  2, regoleAttive: ["colore", "forma"],                                                  switchMin: 5, switchMax: 6, tLimMs:  9000, isiMs: 600 },
  // lv 3–4: + numero
  { livello:  3, regoleAttive: ["colore", "forma", "numero"],                                        switchMin: 5, switchMax: 6, tLimMs:  8000, isiMs: 550 },
  { livello:  4, regoleAttive: ["colore", "forma", "numero"],                                        switchMin: 4, switchMax: 6, tLimMs:  7000, isiMs: 500 },
  // lv 5–6: + taglia
  { livello:  5, regoleAttive: ["colore", "forma", "numero", "taglia"],                              switchMin: 4, switchMax: 5, tLimMs:  6000, isiMs: 450 },
  { livello:  6, regoleAttive: ["colore", "forma", "numero", "taglia"],                              switchMin: 4, switchMax: 5, tLimMs:  5500, isiMs: 400 },
  // lv 7–8: + gambo
  { livello:  7, regoleAttive: ["colore", "forma", "numero", "taglia", "gambo"],                     switchMin: 4, switchMax: 5, tLimMs:  5000, isiMs: 400 },
  { livello:  8, regoleAttive: ["colore", "forma", "numero", "taglia", "gambo"],                     switchMin: 3, switchMax: 4, tLimMs:  4500, isiMs: 350 },
  // lv 9–10: + sfondo
  { livello:  9, regoleAttive: ["colore", "forma", "numero", "taglia", "gambo", "sfondo"],           switchMin: 3, switchMax: 4, tLimMs:  4000, isiMs: 350 },
  { livello: 10, regoleAttive: ["colore", "forma", "numero", "taglia", "gambo", "sfondo"],           switchMin: 3, switchMax: 4, tLimMs:  3500, isiMs: 300 },
] as const;

export function getVivaioLevel(livello: number): VivaioLevelConfig {
  return VIVAIO_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getVivaioMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec !== null && livelloPrec <= 2 && livello === 3) {
    return {
      titolo: "Una regola in più",
      testo: "Da questo livello la regola può riguardare anche il numero di fiori.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 4 && livello === 5) {
    return {
      titolo: "Anche la taglia conta",
      testo: "Da ora la regola può essere la grandezza dei fiori (piccoli, medi o grandi).",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 6 && livello === 7) {
    return {
      titolo: "Il gambo",
      testo: "Adesso può contare anche il colore del gambo e della foglia. Osserva bene.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 8 && livello === 9) {
    return {
      titolo: "Anche lo sfondo",
      testo: "Da ora può contare anche il colore dello sfondo della carta.",
    };
  }
  return null;
}
