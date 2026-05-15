/**
 * Livelli per "Il Banditore" — Linguaggio · Categorizzazione semantica fine.
 *
 * Dominio: Linguaggio (categoria_id = "linguaggio").
 *
 * Refactor: invece di 6 macro-categorie (animale/vegetale/oggetto/luogo/
 * frutto/pianta) si usano 12 SOTTO-categorie più strette. Questo consente
 * ai livelli alti di chiedere discriminazioni fini DENTRO la stessa macro
 * (mammifero vs uccello vs pesce vs insetto; frutta vs verdura vs fiore
 * vs albero; utensile vs arredo). La sfida lessicale è reale.
 *
 * Leve di difficoltà:
 *   - numero categorie attive (2 → 5)
 *   - granularità: lv bassi mescolano macro distanti, lv alti chiedono
 *     discriminazione fine dentro la stessa macro
 *   - tempo limite per risposta (tLimMs)
 *   - ammissione di item ambigui (delfino, pomodoro, fragola, alloro…)
 *
 * Timer sessione: 60s (Modello A — non visibile, deroga GDD per ridurre ansia).
 */

export const BANDITORE_SESSION_TIMER_MS = 60_000;

export type CategoriaId =
  // animale (4 sotto-categorie)
  | "mammifero"
  | "uccello"
  | "pesce"        // include acquatici nel parlato comune (polpo, granchio…)
  | "insetto"
  // vegetale (4 sotto-categorie)
  | "frutta"
  | "verdura"
  | "fiore"        // fiori ornamentali
  | "albero"       // alberi e grandi arbusti
  // oggetto (2 sotto-categorie)
  | "utensile"     // strumenti d'uso (lavoro, scrittura, navigazione)
  | "arredo"       // mobili e ornamenti da casa
  // luogo (2 sotto-categorie)
  | "edificio"     // luoghi costruiti
  | "paesaggio";   // luoghi naturali

export interface CategoriaDef {
  id:     CategoriaId;
  label:  string;
  bg:     string;
  border: string;
  ink:    string;
}

// Palette poster vintage: tonalità terragne/pastellate, 12 tinte distinguibili.
export const CATEGORIE: Record<CategoriaId, CategoriaDef> = {
  mammifero: { id: "mammifero", label: "Mammifero", bg: "#E8C883", border: "#8C5E2A", ink: "#3B2410" },
  uccello:   { id: "uccello",   label: "Uccello",   bg: "#BFD3D8", border: "#4D7A87", ink: "#122D33" },
  pesce:     { id: "pesce",     label: "Pesce",     bg: "#9DCBC4", border: "#2F6E66", ink: "#0F2A26" },
  insetto:   { id: "insetto",   label: "Insetto",   bg: "#C9B5D4", border: "#5E4878", ink: "#2E1E40" },
  frutta:    { id: "frutta",    label: "Frutta",    bg: "#E5A89A", border: "#8B3A2E", ink: "#3B130C" },
  verdura:   { id: "verdura",   label: "Verdura",   bg: "#A8C089", border: "#4D6E3A", ink: "#1E3214" },
  fiore:     { id: "fiore",     label: "Fiore",     bg: "#E2B8C2", border: "#8A4858", ink: "#3F1820" },
  albero:    { id: "albero",    label: "Albero",    bg: "#9DBFA6", border: "#2F5A45", ink: "#0F2A1E" },
  utensile:  { id: "utensile",  label: "Utensile",  bg: "#B8C6D9", border: "#3F5C8A", ink: "#172441" },
  arredo:    { id: "arredo",    label: "Arredo",    bg: "#D9C2A0", border: "#806240", ink: "#2E2010" },
  edificio:  { id: "edificio",  label: "Edificio",  bg: "#D9B89A", border: "#8A4E2E", ink: "#3B1F10" },
  paesaggio: { id: "paesaggio", label: "Paesaggio", bg: "#ACC9D8", border: "#3F6B86", ink: "#143142" },
};

export interface BanditoreLevelConfig {
  livello:        number;
  /** Categorie attive in questo livello (2-5). L'ordine si rispecchia nei bottoni. */
  categorie:      readonly CategoriaId[];
  tLimMs:         number;
  isiMs:          number;
  /**
   * Se true, possono apparire item con più categorie attive: il giocatore
   * deve scegliere la DOMINANTE (prima nella lista item.categorie).
   */
  ammettiAmbigui: boolean;
}

export const BANDITORE_LEVELS: readonly BanditoreLevelConfig[] = [
  // lv 1: macro distanti (animale vs oggetto), 2 cat, lento
  { livello:  1, categorie: ["mammifero", "utensile"],                                  tLimMs: 6000, isiMs: 900, ammettiAmbigui: false },
  // lv 2: entra uccello (prima sotto-discriminazione animale)
  { livello:  2, categorie: ["mammifero", "uccello", "utensile"],                       tLimMs: 5500, isiMs: 800, ammettiAmbigui: false },
  // lv 3: si aggiungono i luoghi (edificio)
  { livello:  3, categorie: ["mammifero", "uccello", "edificio"],                       tLimMs: 5000, isiMs: 800, ammettiAmbigui: false },
  // lv 4: entra il cibo (frutta), 4 cat
  { livello:  4, categorie: ["mammifero", "uccello", "frutta", "edificio"],             tLimMs: 4500, isiMs: 700, ammettiAmbigui: false },
  // lv 5: si separa verdura da frutta (4 cat con overlap cibo-cibo)
  { livello:  5, categorie: ["mammifero", "frutta", "verdura", "utensile"],             tLimMs: 4500, isiMs: 700, ammettiAmbigui: false },
  // lv 6: 5 categorie miste, ritmo medio
  { livello:  6, categorie: ["mammifero", "uccello", "frutta", "verdura", "utensile"],  tLimMs: 4000, isiMs: 600, ammettiAmbigui: false },
  // lv 7: discriminazione sub-animale (3 sotto-animali) + 2 vegetali
  { livello:  7, categorie: ["mammifero", "uccello", "pesce", "frutta", "fiore"],       tLimMs: 3800, isiMs: 600, ammettiAmbigui: false },
  // lv 8: TUTTE le sotto-categorie animali (mammifero/uccello/pesce/insetto) + frutta
  //       qui il giocatore deve fare tassonomia animale fine
  { livello:  8, categorie: ["mammifero", "uccello", "pesce", "insetto", "frutta"],     tLimMs: 3500, isiMs: 550, ammettiAmbigui: false },
  // lv 9: TUTTE le sotto-categorie vegetali (frutta/verdura/fiore/albero) + arredo
  //       + AMBIGUI: pomodoro/zucchina→verdura, fragola→frutta, alloro→albero
  { livello:  9, categorie: ["frutta", "verdura", "fiore", "albero", "arredo"],         tLimMs: 3500, isiMs: 500, ammettiAmbigui: true  },
  // lv 10: mix difficile — sub-animale + sub-oggetto + sub-luogo, tutti ambigui
  //        delfino/balena→mammifero, polpo→pesce, ventaglio→utensile vs arredo…
  { livello: 10, categorie: ["mammifero", "pesce", "utensile", "arredo", "edificio"],   tLimMs: 3200, isiMs: 450, ammettiAmbigui: true  },
] as const;

export function getBanditoreLevel(livello: number): BanditoreLevelConfig {
  return BANDITORE_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

export function getBanditoreMechanicWarning(
  livelloPrec: number | null,
  livello: number,
): { titolo: string; testo: string } | null {
  if (livelloPrec !== null && livelloPrec <= 1 && livello === 2) {
    return {
      titolo: "Anche gli uccelli",
      testo:
        "Da questo livello compare la categoria “Uccello”. " +
        "Attenzione: i pipistrelli volano ma non sono uccelli.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 3 && livello === 4) {
    return {
      titolo: "Arriva la frutta",
      testo:
        "Si aggiunge la categoria “Frutta”. Quattro bottoni in tutto: " +
        "leggi bene il nome del lotto prima di scegliere.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 4 && livello === 5) {
    return {
      titolo: "Frutta e verdura distinte",
      testo:
        "“Frutta” e “Verdura” sono due categorie separate. " +
        "La mela è frutta, il carciofo è verdura.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 6 && livello === 7) {
    return {
      titolo: "Mammiferi, uccelli, pesci",
      testo:
        "Gli animali si dividono per tipo: mammifero, uccello, pesce. " +
        "Il delfino è un mammifero, non un pesce.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 7 && livello === 8) {
    return {
      titolo: "Anche gli insetti",
      testo:
        "Si aggiunge “Insetto”. Ora ci sono quattro tipi di animale: " +
        "mammifero, uccello, pesce, insetto. Lotto per lotto, vai con calma.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 8 && livello === 9) {
    return {
      titolo: "Il mondo vegetale, in dettaglio",
      testo:
        "Adesso si distinguono frutta, verdura, fiore e albero. " +
        "L'olivo è un albero, la fragola è frutta, la rosa è un fiore.",
    };
  }
  if (livelloPrec !== null && livelloPrec <= 9 && livello === 10) {
    return {
      titolo: "Lotti ambigui",
      testo:
        "Alcuni lotti potrebbero entrare in più categorie. " +
        "Scegli quella più ovvia per uso comune: il pomodoro è verdura, " +
        "il polpo è pesce, l'anfora è arredo.",
    };
  }
  return null;
}
