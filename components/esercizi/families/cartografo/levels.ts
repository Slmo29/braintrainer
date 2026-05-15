// Configurazione 10 livelli — progressione: lunghezza percorso, mappa, presenza
// "torna indietro", riferimenti a landmark nelle istruzioni, tipo di domanda.

export interface LevelConfig {
  /** id della mappa in maps.ts */
  mapId: string;
  /** numero di passi del percorso */
  steps: number;
  /** consenti istruzione "torna indietro" */
  allowIndietro: boolean;
  /** istruzioni possono riferirsi a landmark ("alla fontana gira a destra") */
  useLandmarkRefs: boolean;
  /** tipo di domanda finale */
  questionType: "position" | "direction" | "both";
  /** numero di opzioni di risposta da mostrare (solo per position) */
  positionOptions: number;
}

export const LEVELS: LevelConfig[] = [
  // L1 — primo contatto, 3×3, 2 passi semplici
  { mapId: "m1", steps: 2, allowIndietro: false, useLandmarkRefs: false, questionType: "position", positionOptions: 3 },
  // L2 — 3×3, 3 passi
  { mapId: "m1", steps: 3, allowIndietro: false, useLandmarkRefs: false, questionType: "position", positionOptions: 4 },
  // L3 — 4×3 con 1 landmark visivo
  { mapId: "m2", steps: 3, allowIndietro: false, useLandmarkRefs: false, questionType: "position", positionOptions: 4 },
  // L4 — 4×4, 4 passi, ancora no indietro
  { mapId: "m3", steps: 4, allowIndietro: false, useLandmarkRefs: false, questionType: "position", positionOptions: 4 },
  // L5 — 4×4, 4 passi + introduzione "torna indietro"
  { mapId: "m4", steps: 4, allowIndietro: true, useLandmarkRefs: false, questionType: "position", positionOptions: 5 },
  // L6 — 5×4, 5 passi, ora chiediamo anche direzione
  { mapId: "m5", steps: 5, allowIndietro: true, useLandmarkRefs: false, questionType: "both", positionOptions: 5 },
  // L7 — 5×5, 5 passi + riferimenti a landmark nelle istruzioni
  { mapId: "m6", steps: 5, allowIndietro: true, useLandmarkRefs: true, questionType: "position", positionOptions: 5 },
  // L8 — 5×5 denso, 6 passi
  { mapId: "m7", steps: 6, allowIndietro: true, useLandmarkRefs: true, questionType: "both", positionOptions: 6 },
  // L9 — 6×5, 7 passi
  { mapId: "m8", steps: 7, allowIndietro: true, useLandmarkRefs: true, questionType: "both", positionOptions: 6 },
  // L10 — 6×6 denso, 8 passi
  { mapId: "m10", steps: 8, allowIndietro: true, useLandmarkRefs: true, questionType: "both", positionOptions: 6 },
];

export const MAX_LIVELLO = LEVELS.length;

/** Trial valutativi per sessione (Modello B completamento). */
export const CARTOGRAFO_TRIAL_VALUTATIVI = 3;
