/**
 * components/esercizi/families/sort-it/sequence.ts
 *
 * Generazione trial per Sort It (percettivo e semantico).
 *
 * Struttura trial: sequenza flat di eventi (carta | switch_banner).
 * Il session component processa gli eventi in ordine senza conoscere la
 * suddivisione in fasi — le bins e la regola sono embedded in ogni evento carta.
 *
 * Percettivo: forme SVG (forma × colore × dimensione), 1 o 2 dimensioni attive.
 * Semantico:  emoji + parola da 8 categorie, pool senza rimpiazzo entro sessione.
 */

import type { SortItLevelConfig, FeedbackModeSI } from "./levels";

// ── Tipi esportati ────────────────────────────────────────────────────────────

export type CartaSI = {
  id: number;
  // Percettivo
  forma?:      string;
  colore?:     string;
  dimensione?: string;
  // Semantico
  parola?:     string;
  emoji?:      string;
  categoria?:  string;
  // Comune
  binCorretto: string;
};

export type EventSI =
  | { tipo: "carta";  carta: CartaSI; bins: string[]; regola: string }
  | { tipo: "switch"; nuovaRegola: string; nuoviBins: string[] };

export type StimoloSortIt = {
  stimulusType: "percettivo" | "semantico";
  eventi:       EventSI[];
  feedbackMode: FeedbackModeSI;
};

export type RispostaSortIt = { corretti: number; totali: number };

// ── Costanti percettivo ───────────────────────────────────────────────────────

export const COLORI = ["Rosso", "Blu", "Verde", "Giallo", "Arancio"] as const;
export const FORME  = ["Cerchio", "Quadrato", "Triangolo", "Stella", "Rombo"] as const;
export const DIMENSIONI = ["Grande", "Piccolo"] as const;

export const COLORE_HEX: Record<string, string> = {
  Rosso: "#EF4444", Blu: "#3B82F6", Verde: "#22C55E",
  Giallo: "#EAB308", Arancio: "#F97316",
};

// ── Pool semantico (8 categorie × 15 item) ───────────────────────────────────

type ItemSem = { parola: string; emoji: string };

export const POOL_SEMANTICO: Record<string, { nome: string; items: ItemSem[] }> = {
  animali: {
    nome: "Animali",
    items: [
      { parola: "cane",      emoji: "🐶" }, { parola: "gatto",    emoji: "🐱" },
      { parola: "pesce",     emoji: "🐟" }, { parola: "uccello",  emoji: "🐦" },
      { parola: "coniglio",  emoji: "🐰" }, { parola: "rana",     emoji: "🐸" },
      { parola: "mucca",     emoji: "🐮" }, { parola: "elefante", emoji: "🐘" },
      { parola: "leone",     emoji: "🦁" }, { parola: "tigre",    emoji: "🐯" },
      { parola: "orso",      emoji: "🐻" }, { parola: "volpe",    emoji: "🦊" },
      { parola: "pinguino",  emoji: "🐧" }, { parola: "maiale",   emoji: "🐷" },
      { parola: "lupo",      emoji: "🐺" },
    ],
  },
  cibo: {
    nome: "Cibo",
    items: [
      { parola: "mela",        emoji: "🍎" }, { parola: "pizza",      emoji: "🍕" },
      { parola: "pane",        emoji: "🍞" }, { parola: "formaggio",  emoji: "🧀" },
      { parola: "pollo",       emoji: "🍗" }, { parola: "torta",      emoji: "🍰" },
      { parola: "carota",      emoji: "🥕" }, { parola: "pasta",      emoji: "🍝" },
      { parola: "cioccolato",  emoji: "🍫" }, { parola: "arancia",    emoji: "🍊" },
      { parola: "fragola",     emoji: "🍓" }, { parola: "uva",        emoji: "🍇" },
      { parola: "limone",      emoji: "🍋" }, { parola: "avocado",    emoji: "🥑" },
      { parola: "broccolo",    emoji: "🥦" },
    ],
  },
  attrezzi: {
    nome: "Attrezzi",
    items: [
      { parola: "martello",    emoji: "🔨" }, { parola: "chiave",     emoji: "🔧" },
      { parola: "forbici",     emoji: "✂️" }, { parola: "sega",       emoji: "🪚" },
      { parola: "vite",        emoji: "🔩" }, { parola: "cacciavite", emoji: "🪛" },
      { parola: "righello",    emoji: "📏" }, { parola: "calamita",   emoji: "🧲" },
      { parola: "torcia",      emoji: "🔦" }, { parola: "scala",      emoji: "🪜" },
      { parola: "cassetta",    emoji: "🧰" }, { parola: "gancio",     emoji: "🪝" },
      { parola: "bullone",     emoji: "⚙️" }, { parola: "trapano",    emoji: "🔩" },
      { parola: "livella",     emoji: "📐" },
    ],
  },
  veicoli: {
    nome: "Veicoli",
    items: [
      { parola: "auto",        emoji: "🚗" }, { parola: "bus",        emoji: "🚌" },
      { parola: "treno",       emoji: "🚂" }, { parola: "aereo",      emoji: "✈️" },
      { parola: "bici",        emoji: "🚲" }, { parola: "razzo",      emoji: "🚀" },
      { parola: "barca",       emoji: "⛵" }, { parola: "elicottero", emoji: "🚁" },
      { parola: "nave",        emoji: "🚢" }, { parola: "moto",       emoji: "🏍️" },
      { parola: "camion",      emoji: "🛻" }, { parola: "ambulanza",  emoji: "🚑" },
      { parola: "taxi",        emoji: "🚕" }, { parola: "tram",       emoji: "🚋" },
      { parola: "monopattino", emoji: "🛴" },
    ],
  },
  natura: {
    nome: "Natura",
    items: [
      { parola: "albero",      emoji: "🌲" }, { parola: "fiore",      emoji: "🌸" },
      { parola: "fungo",       emoji: "🍄" }, { parola: "montagna",   emoji: "⛰️" },
      { parola: "luna",        emoji: "🌙" }, { parola: "stella",     emoji: "⭐" },
      { parola: "sole",        emoji: "☀️" }, { parola: "arcobaleno", emoji: "🌈" },
      { parola: "foglia",      emoji: "🌿" }, { parola: "girasole",   emoji: "🌻" },
      { parola: "cactus",      emoji: "🌵" }, { parola: "rosa",       emoji: "🌹" },
      { parola: "onda",        emoji: "🌊" }, { parola: "neve",       emoji: "❄️" },
      { parola: "vulcano",     emoji: "🌋" },
    ],
  },
  abbigliamento: {
    nome: "Abbigliamento",
    items: [
      { parola: "maglietta",   emoji: "👕" }, { parola: "pantaloni",  emoji: "👖" },
      { parola: "vestito",     emoji: "👗" }, { parola: "scarpa",     emoji: "👟" },
      { parola: "sciarpa",     emoji: "🧣" }, { parola: "guanti",     emoji: "🧤" },
      { parola: "cappello",    emoji: "🎩" }, { parola: "cappotto",   emoji: "🧥" },
      { parola: "berretto",    emoji: "🧢" }, { parola: "camicia",    emoji: "👔" },
      { parola: "calzini",     emoji: "🧦" }, { parola: "borsa",      emoji: "👜" },
      { parola: "cintura",     emoji: "🩲" }, { parola: "stivale",    emoji: "👢" },
      { parola: "impermeabile",emoji: "🥼" },
    ],
  },
  sport: {
    nome: "Sport",
    items: [
      { parola: "calcio",      emoji: "⚽" }, { parola: "tennis",     emoji: "🎾" },
      { parola: "basket",      emoji: "🏀" }, { parola: "nuoto",      emoji: "🏊" },
      { parola: "ciclismo",    emoji: "🚴" }, { parola: "boxe",       emoji: "🥊" },
      { parola: "sci",         emoji: "⛷️" }, { parola: "golf",       emoji: "🏌️" },
      { parola: "surf",        emoji: "🏄" }, { parola: "judo",       emoji: "🥋" },
      { parola: "tiro",        emoji: "🎯" }, { parola: "ginnastica", emoji: "🤸" },
      { parola: "pallavolo",   emoji: "🏐" }, { parola: "hockey",     emoji: "🏒" },
      { parola: "rugby",       emoji: "🏉" },
    ],
  },
  arredo: {
    nome: "Arredo",
    items: [
      { parola: "divano",      emoji: "🛋️" }, { parola: "sedia",      emoji: "🪑" },
      { parola: "letto",       emoji: "🛏️" }, { parola: "porta",      emoji: "🚪" },
      { parola: "pianta",      emoji: "🪴" }, { parola: "quadro",     emoji: "🖼️" },
      { parola: "orologio",    emoji: "🕰️" }, { parola: "lampada",    emoji: "💡" },
      { parola: "specchio",    emoji: "🪞" }, { parola: "finestra",   emoji: "🪟" },
      { parola: "tappeto",     emoji: "🪣" }, { parola: "scaffale",   emoji: "📚" },
      { parola: "armadio",     emoji: "🗄️" }, { parola: "tavolino",   emoji: "🪵" },
      { parola: "cassetto",    emoji: "🗃️" },
    ],
  },
};

const CAT_KEYS = Object.keys(POOL_SEMANTICO);

// ── Helper ────────────────────────────────────────────────────────────────────

function shuffled<T>(arr: readonly T[], rng: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function pick<T>(arr: readonly T[], n: number, rng: () => number): T[] {
  return shuffled(arr, rng).slice(0, n);
}

// ── Generazione percettivo ────────────────────────────────────────────────────

function generaFasePercettiva(
  nCarte: number,
  nCategorie: number,
  dimensioneAttiva: "colore" | "forma",
  cardIdStart: number,
  rng: () => number,
): { eventi: EventSI[]; nextId: number } {
  const bins =
    dimensioneAttiva === "colore"
      ? pick(COLORI, nCategorie, rng)
      : pick(FORME, nCategorie, rng);

  const regola =
    dimensioneAttiva === "colore"
      ? `Ordina per COLORE: ${bins.join(" · ")}`
      : `Ordina per FORMA: ${bins.join(" · ")}`;

  // Genera nCarte card bilanciate sui bins
  const binList: string[] = [];
  for (let i = 0; i < nCarte; i++) binList.push(bins[i % bins.length]);
  const binsShuffled = shuffled(binList, rng);

  let id = cardIdStart;
  const eventi: EventSI[] = binsShuffled.map((bin) => {
    const carta: CartaSI = {
      id: id++,
      colore:     dimensioneAttiva === "colore" ? bin : pick(COLORI as readonly string[], 1, rng)[0],
      forma:      dimensioneAttiva === "forma"  ? bin : pick(FORME as readonly string[], 1, rng)[0],
      dimensione: pick(DIMENSIONI as readonly string[], 1, rng)[0],
      binCorretto: bin,
    };
    return { tipo: "carta", carta, bins: [...bins], regola };
  });

  return { eventi, nextId: id };
}

// ── Generazione semantico ─────────────────────────────────────────────────────

function generaFaseSemantica(
  nCarte: number,
  nCategorie: number,
  catKeys: string[],          // pool di chiavi disponibili per questa fase
  usedItems: Map<string, Set<string>>, // parola già usate per categoria
  cardIdStart: number,
  rng: () => number,
): { eventi: EventSI[]; nextId: number } {
  const chosenKeys = pick(catKeys, nCategorie, rng);
  const bins = chosenKeys.map((k) => POOL_SEMANTICO[k].nome);
  const regola = bins.join(" / ");

  const binList: string[] = [];
  for (let i = 0; i < nCarte; i++) binList.push(bins[i % bins.length]);
  const binsShuffled = shuffled(binList, rng);

  let id = cardIdStart;
  const eventi: EventSI[] = binsShuffled.map((nomeCategoria) => {
    const catKey = chosenKeys[bins.indexOf(nomeCategoria)];
    const allItems = POOL_SEMANTICO[catKey].items;
    const used = usedItems.get(catKey) ?? new Set<string>();
    const available = allItems.filter((it) => !used.has(it.parola));
    const item = (available.length > 0 ? available : allItems)[
      Math.floor(rng() * (available.length > 0 ? available.length : allItems.length))
    ];
    used.add(item.parola);
    usedItems.set(catKey, used);

    const carta: CartaSI = {
      id: id++,
      parola: item.parola,
      emoji: item.emoji,
      categoria: nomeCategoria,
      binCorretto: nomeCategoria,
    };
    return { tipo: "carta", carta, bins: [...bins], regola };
  });

  return { eventi, nextId: id };
}

// ── Generatore trial principale ───────────────────────────────────────────────

export function generaTrialSortIt(
  level: SortItLevelConfig,
  tipo: "percettivo" | "semantico",
  switchOgniN: number | null,
  usedSemantic: Map<string, Set<string>>,
  rng: () => number,
): StimoloSortIt {
  const { nCategorie, stimoliPerCategoria, feedbackMode } = level;
  const totalCarte = nCategorie * stimoliPerCategoria;

  // Calcola dimensioni delle fasi
  const faseSizes: number[] = [];
  if (!switchOgniN) {
    faseSizes.push(totalCarte);
  } else {
    let rem = totalCarte;
    while (rem > 0) {
      faseSizes.push(Math.min(switchOgniN, rem));
      rem -= switchOgniN;
    }
  }

  const eventi: EventSI[] = [];
  let cardId = 0;

  if (tipo === "percettivo") {
    // Determina dimensioni disponibili: 1 (lv 1-6) o 2 (lv 7-10)
    const usaDueDimensioni = nCategorie >= 3 && switchOgniN !== null && switchOgniN <= 3;
    const dimensioni: ("colore" | "forma")[] = usaDueDimensioni
      ? ["colore", "forma"]
      : ["colore"];

    faseSizes.forEach((nCarte, faseIdx) => {
      const dimensione = dimensioni[faseIdx % dimensioni.length];
      if (faseIdx > 0) {
        // Calcola la prossima regola/bins per il banner
        const nextDim = dimensioni[faseIdx % dimensioni.length];
        const nextBins = nextDim === "colore"
          ? pick(COLORI, nCategorie, rng)
          : pick(FORME, nCategorie, rng);
        const nuovaRegola = nextDim === "colore"
          ? `Ordina per COLORE: ${nextBins.join(" · ")}`
          : `Ordina per FORMA: ${nextBins.join(" · ")}`;
        eventi.push({ tipo: "switch", nuovaRegola, nuoviBins: nextBins });
      }
      const { eventi: faseEventi, nextId } = generaFasePercettiva(nCarte, nCategorie, dimensione, cardId, rng);
      cardId = nextId;
      eventi.push(...faseEventi);
    });
  } else {
    // Semantico: cicla attraverso i gruppi di categorie
    const catPool = shuffled(CAT_KEYS, rng);
    let catOffset = 0;

    faseSizes.forEach((nCarte, faseIdx) => {
      // Seleziona nCategorie chiavi dalla pool ciclica
      const available = catPool.slice(catOffset, catOffset + nCategorie);
      const keysForFase = available.length >= nCategorie
        ? available
        : [...available, ...catPool.slice(0, nCategorie - available.length)];
      catOffset = (catOffset + nCategorie) % catPool.length;

      if (faseIdx > 0) {
        const previewBins = keysForFase.map((k) => POOL_SEMANTICO[k].nome);
        eventi.push({
          tipo: "switch",
          nuovaRegola: previewBins.join(" / "),
          nuoviBins: previewBins,
        });
      }

      const { eventi: faseEventi, nextId } = generaFaseSemantica(
        nCarte, nCategorie, keysForFase, usedSemantic, cardId, rng,
      );
      cardId = nextId;
      eventi.push(...faseEventi);
    });
  }

  return { stimulusType: tipo, eventi, feedbackMode };
}
