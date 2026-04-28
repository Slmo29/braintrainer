/**
 * components/esercizi/families/go-nogo/levels.ts
 *
 * Configurazione livelli per Go/No-Go Cromatico (Famiglia 12, esercizio_id: go_nogo_cromatico).
 *
 * Dominio cognitivo: Funzioni Esecutive — inibizione motoria selettiva.
 * Prima istanza di Modello B in produzione: sessione termina per conteggio
 * trial (trialValutativi = sequenceLength), non per timer fisso.
 *
 * Decisioni implementative:
 *   - Lv 1–13 first-pass (regola singola). Lv 14–20 (congiunzione) → step separato post Tier 1.
 *   - 6 coppie colore GDD implementate (2 per saliency). Selezione runtime nell'engine.
 *   - ISI inter-trial = 0 (flusso continuo, deroga GDD shared/02-trial-flow.md).
 *     TrialFlow consuma: tLimMs = config.tLimMs, isiMs = 0, feedbackType = "error-only".
 *   - trialValutativi = config.sequenceLength (Modello B).
 *
 * Selezione coppia attiva per sessione: responsabilità dell'engine, non di questo file.
 * L'engine al mount seleziona random tra coppieAmmesse escludendo l'ultima usata.
 *
 * TODO lv 14–20:
 *   - Congiunzione (colore + forma): FormaGoNogo, stimoli SVG multi-forma.
 *   - Warning cambio meccanica al lv 14 (getGoNogoMechanicWarning).
 *   - Estendere GoNogoLevelConfig con formeAmmesse.
 *
 * TODO clinico bonus condition:
 *   TrialFlow approssima "ge90pct_go_correct AND ge90pct_nogo_correct negli ultimi N trial"
 *   (GDD §microProgression.bonusCondition) con la condizione standard "3 consecutivi corretti".
 *   Approssimazione consapevole documentata. Non introduce errori di correttezza, sottostima
 *   leggermente la frequenza dei trial bonus.
 *
 * Riferimento: docs/gdd/families/go-nogo.md
 */

import type { MicroProgressioneConfig } from "@/lib/exercise-types";

// ── Tipo colore ────────────────────────────────────────────────────────────────
// 8 colori totali: 2 "go base" (verde, blu) condivisi tra le saliency,
// 6 "nogo specifici" che variano per saliency.

export type ColoreGoNogo =
  | "verde"    // go base — saliency alta e media
  | "rosso"    // nogo — saliency alta
  | "blu"      // go base — saliency alta e media
  | "arancio"  // nogo — saliency alta
  | "giallo"   // nogo — saliency media
  | "viola"    // nogo — saliency media
  | "turchese" // nogo — saliency bassa
  | "azzurro"; // nogo — saliency bassa

// ── Hex CSS per ciascun colore (forma su surface #FFFFFF) ─────────────────────
// Tutti i valori passano WCAG AA (≥ 4.5:1 su bianco).
// giallo: #D97706 (amber-600, 4.7:1) — yellow-400 #FACC15 (1.9:1) non passa.
// turchese: teal-700 #0F766E (4.9:1) — teal-600 #0D9488 (3.5:1) non passa.
// azzurro: sky-700 #0369A1 (5.9:1) — sky-600 #0284C7 (3.6:1) non passa.
//   sky-700 è visivamente distinto da blu-600 #2563EB (tonalità azzurra vs blu reale).

export const COLORE_CSS_GO_NOGO: Record<ColoreGoNogo, string> = {
  verde:    "#16A34A",  // green-600   5.4:1
  rosso:    "#DC2626",  // red-600     4.5:1
  blu:      "#2563EB",  // blue-600    5.0:1
  arancio:  "#EA580C",  // orange-600  4.6:1
  giallo:   "#D97706",  // amber-600   4.7:1
  viola:    "#7C3AED",  // violet-600  5.5:1
  turchese: "#0F766E",  // teal-700    4.9:1
  azzurro:  "#0369A1",  // sky-700     5.9:1
};

// ── Coppia colore go/nogo ──────────────────────────────────────────────────────

export interface CoppiaColore {
  readonly go:   ColoreGoNogo;
  readonly nogo: ColoreGoNogo;
}

// ── Costanti coppie (GDD §Salianza distinzione) ───────────────────────────────
// Naming: <go>/<nogo> iniziali. Fonte letterale dal GDD:
//   Alta: "verde vs rosso; blu vs arancio"
//   Media: "verde vs giallo; blu vs viola"
//   Bassa: "verde vs turchese; blu vs azzurro"

const COPPIA_VR:  CoppiaColore = { go: "verde", nogo: "rosso"    }; // alta
const COPPIA_BA:  CoppiaColore = { go: "blu",   nogo: "arancio"  }; // alta
const COPPIA_VG:  CoppiaColore = { go: "verde", nogo: "giallo"   }; // media
const COPPIA_BV:  CoppiaColore = { go: "blu",   nogo: "viola"    }; // media
const COPPIA_VT:  CoppiaColore = { go: "verde", nogo: "turchese" }; // bassa
const COPPIA_BAZ: CoppiaColore = { go: "blu",   nogo: "azzurro"  }; // bassa

// ── Configurazione livello ────────────────────────────────────────────────────

export interface GoNogoLevelConfig {
  livello: number;
  /** Numero di stimoli per sessione (Modello B: trialValutativi = sequenceLength). */
  sequenceLength: number;
  /** Finestra di risposta per trial (ms). Corrisponde a isiMs della tabella GDD.
   *  TrialFlow: tLimMs = this.tLimMs, isiMs = 0 (flusso continuo). */
  tLimMs: number;
  saliency: "alta" | "media" | "bassa";
  /**
   * Coppie colore go/nogo ammesse a questo livello.
   * L'engine seleziona random tra le coppie all'inizio di ogni sessione,
   * escludendo l'ultima coppia usata per impedire ripetizione consecutiva.
   * Per lv 1–13: sempre 2 coppie (una per saliency level).
   */
  coppieAmmesse: readonly [CoppiaColore, CoppiaColore] | readonly [CoppiaColore];
}

// ── Micro-progressione (costanti di famiglia) ─────────────────────────────────
// see docs/gdd/families/go-nogo.md §Micro-progressione
// Parametro modulato: tLimMs (= ISI del GDD).

export const MICRO_PROGRESSIONE_GO_NOGO = {
  delta:    -50,   // GDD: −50ms ISI per trial bonus
  maxDelta: 2,     // GDD: max 2 step (−100ms totale)
  limite:   600,   // GDD: floor 600ms
} satisfies Omit<MicroProgressioneConfig, "valoreBase">;

// ── Warning cambio meccanica ──────────────────────────────────────────────────

/**
 * TODO lv 14–20: implementare warning cambio meccanica al lv 14
 * (regola singola → congiunzione, GDD §Cambio meccanica → schermata di avviso).
 * Per first-pass lv 1–13 nessun cambio meccanica → ritorna sempre null.
 */
export function getGoNogoMechanicWarning(
  _livelloPrec: number | null,
  _livelloCorrente: number,
): { titolo: string; testo: string } | null {
  return null;
}

// ── Tabella livelli ───────────────────────────────────────────────────────────
/**
 * Tabella livelli Go/No-Go cromatico (lv 1–13 first-pass, regola singola).
 * Fonte: docs/gdd/families/go-nogo.md §Tabella livelli (condivisa).
 *
 * Lv 14–20 (congiunzione, 2 dimensioni colore+forma) NON implementati
 * in first-pass. Da aggiungere come step separato post Tier 1.
 *
 * Tabella GDD letterale (colonne: Lv | SeqLen | ISI ms | Salianza | Regola):
 *   1  | 40  | 1500 | alta  | singola
 *   2  | 50  | 1400 | alta  | singola
 *   3  | 60  | 1300 | alta  | singola
 *   4  | 70  | 1300 | alta  | singola
 *   5  | 80  | 1200 | alta  | singola
 *   6  | 90  | 1200 | media | singola
 *   7  | 100 | 1100 | media | singola
 *   8  | 100 | 1100 | media | singola
 *   9  | 110 | 1000 | media | singola
 *   10 | 120 | 1000 | media | singola
 *   11 | 120 | 950  | bassa | singola
 *   12 | 130 | 950  | bassa | singola
 *   13 | 140 | 900  | bassa | singola
 *
 * Mapping saliency → coppieAmmesse (GDD §Salianza distinzione):
 *   alta:  [verde/rosso, blu/arancio]
 *   media: [verde/giallo, blu/viola]
 *   bassa: [verde/turchese, blu/azzurro]
 */
export const GO_NOGO_LEVELS: readonly GoNogoLevelConfig[] = [
  { livello: 1,  sequenceLength: 40,  tLimMs: 1500, saliency: "alta",  coppieAmmesse: [COPPIA_VR, COPPIA_BA]  },
  { livello: 2,  sequenceLength: 50,  tLimMs: 1400, saliency: "alta",  coppieAmmesse: [COPPIA_VR, COPPIA_BA]  },
  { livello: 3,  sequenceLength: 60,  tLimMs: 1300, saliency: "alta",  coppieAmmesse: [COPPIA_VR, COPPIA_BA]  },
  { livello: 4,  sequenceLength: 70,  tLimMs: 1300, saliency: "alta",  coppieAmmesse: [COPPIA_VR, COPPIA_BA]  },
  { livello: 5,  sequenceLength: 80,  tLimMs: 1200, saliency: "alta",  coppieAmmesse: [COPPIA_VR, COPPIA_BA]  },
  { livello: 6,  sequenceLength: 90,  tLimMs: 1200, saliency: "media", coppieAmmesse: [COPPIA_VG, COPPIA_BV]  },
  { livello: 7,  sequenceLength: 100, tLimMs: 1100, saliency: "media", coppieAmmesse: [COPPIA_VG, COPPIA_BV]  },
  { livello: 8,  sequenceLength: 100, tLimMs: 1100, saliency: "media", coppieAmmesse: [COPPIA_VG, COPPIA_BV]  },
  { livello: 9,  sequenceLength: 110, tLimMs: 1000, saliency: "media", coppieAmmesse: [COPPIA_VG, COPPIA_BV]  },
  { livello: 10, sequenceLength: 120, tLimMs: 1000, saliency: "media", coppieAmmesse: [COPPIA_VG, COPPIA_BV]  },
  { livello: 11, sequenceLength: 120, tLimMs:  950, saliency: "bassa", coppieAmmesse: [COPPIA_VT, COPPIA_BAZ] },
  { livello: 12, sequenceLength: 130, tLimMs:  950, saliency: "bassa", coppieAmmesse: [COPPIA_VT, COPPIA_BAZ] },
  { livello: 13, sequenceLength: 140, tLimMs:  900, saliency: "bassa", coppieAmmesse: [COPPIA_VT, COPPIA_BAZ] },
] as const;

/**
 * Lookup diretto per livello (1-based). Preferire questo a GO_NOGO_LEVELS[livello - 1].
 * @throws RangeError se livello è fuori da 1–13 (first-pass).
 */
export function getGoNogoLevel(livello: number): GoNogoLevelConfig {
  const cfg = GO_NOGO_LEVELS[livello - 1];
  if (!cfg) throw new RangeError(`Go/No-Go: livello ${livello} fuori range 1–13`);
  return cfg;
}
