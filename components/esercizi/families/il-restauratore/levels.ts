/**
 * Livelli per "Il Restauratore" — Visuospaziali · Find the differences su dipinti.
 *
 * Dominio: Visuospaziali (categoria_id = "visuospaziali").
 * Modello: B (trial-based) — 3 trial valutativi per sessione (3 dipinti),
 * niente timer di sessione.
 *
 * Flow per trial:
 *   1. Due versioni del dipinto affiancate (Originale vs Da Restaurare).
 *   2. Il giocatore tocca le differenze su uno qualsiasi dei due dipinti.
 *   3. Quando tutte le differenze sono trovate i dipinti si "illuminano"
 *      come restaurati, poi parte il trial successivo.
 *
 * Progressione 10 livelli:
 *   - differenze per dipinto: 3 → 8
 *   - dipinti: da composizioni semplici (natura morta a 6 oggetti) a
 *     dense (paesaggi con orizzonte, figure, dettagli).
 *   - tipi di modifica:
 *       lv 1–3: solo "color" (cromatiche grandi e leggibili)
 *       lv 4–5: + "scale" e "moved"
 *       lv 6–7: + "added" / "removed" (elementi presenti/assenti)
 *       lv 8–10: + "rotate" (modifiche sottili di orientamento/proporzione)
 */

export type RestauroPaintingId = "natura_morta" | "paesaggio" | "ritratto";

export type RestauroDiffType =
  | "color"
  | "moved"
  | "scale"
  | "rotate"
  | "added"
  | "removed";

export interface RestauratoreLevelConfig {
  livello: number;
  /** Numero di differenze tra le due versioni del dipinto. */
  nDifferenze: number;
  /** Pool di dipinti che possono essere proposti per il livello. */
  dipintiAmmessi: readonly RestauroPaintingId[];
  /** Tipi di modifica possibili per il livello. */
  tipiAmmessi: readonly RestauroDiffType[];
  /**
   * Intensità delle modifiche cromatiche/scala (0.5 = poco percettibili,
   * 1.0 = molto evidenti). Modula `cromaShift` e `scaleShift` nel mutation
   * engine così le prime differenze sono molto leggibili.
   */
  intensita: number;
}

export const RESTAURATORE_LEVELS: readonly RestauratoreLevelConfig[] = [
  { livello:  1, nDifferenze: 3, dipintiAmmessi: ["natura_morta"],                              tipiAmmessi: ["color"],                                                       intensita: 1.00 },
  { livello:  2, nDifferenze: 3, dipintiAmmessi: ["natura_morta", "paesaggio"],                  tipiAmmessi: ["color"],                                                       intensita: 0.90 },
  { livello:  3, nDifferenze: 4, dipintiAmmessi: ["natura_morta", "paesaggio"],                  tipiAmmessi: ["color", "scale"],                                              intensita: 0.85 },
  { livello:  4, nDifferenze: 5, dipintiAmmessi: ["natura_morta", "paesaggio"],                  tipiAmmessi: ["color", "scale", "moved"],                                     intensita: 0.80 },
  { livello:  5, nDifferenze: 5, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved"],                                     intensita: 0.75 },
  { livello:  6, nDifferenze: 6, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved", "added", "removed"],                 intensita: 0.70 },
  { livello:  7, nDifferenze: 6, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved", "added", "removed"],                 intensita: 0.65 },
  { livello:  8, nDifferenze: 7, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved", "added", "removed", "rotate"],       intensita: 0.55 },
  { livello:  9, nDifferenze: 7, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved", "added", "removed", "rotate"],       intensita: 0.45 },
  { livello: 10, nDifferenze: 8, dipintiAmmessi: ["natura_morta", "paesaggio", "ritratto"],      tipiAmmessi: ["color", "scale", "moved", "added", "removed", "rotate"],       intensita: 0.40 },
] as const;

export const RESTAURATORE_TRIAL_VALUTATIVI = 3;

export function getRestauratoreLevel(livello: number): RestauratoreLevelConfig {
  return RESTAURATORE_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getRestauratoreMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec !== null && livelloPrec <= 3 && livello === 4) {
    return {
      titolo: "Anche posizioni e dimensioni",
      testo: "Da questo livello le differenze non sono più solo nei colori: un oggetto può essere più piccolo, più grande o spostato.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 5 && livello === 6) {
    return {
      titolo: "Elementi aggiunti e rimossi",
      testo: "Da ora alcuni elementi possono comparire in un dipinto e mancare nell'altro. Cerca anche ciò che c'è di troppo o di meno.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 7 && livello === 8) {
    return {
      titolo: "Dettagli sottili",
      testo: "Le differenze diventano più discrete: piccole rotazioni, ombre, proporzioni minute. Prenditi tutto il tempo che serve.",
    };
  }
  return null;
}

export const RESTAURATORE_PALETTE = {
  bg:         "#F2E9D5",   // pergamena chiara
  bgDeep:     "#E8DCC2",
  ink:        "#3A2A18",
  inkSoft:    "#7A6242",
  frame:      "#8C6A3D",   // cornice museale
  frameDark:  "#5A4423",
  ok:         "#15803D",
  found:      "#0E7A3A",
  hint:       "#B45309",
  shimmer:    "#F2D188",
} as const;
