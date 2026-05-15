/**
 * Generazione deterministica delle mappe per "Il Postino del Borgo".
 *
 * Una mappa = griglia rows × cols di nodi. Ogni nodo ha una decorazione
 * (casa/bottega/fontana/...). Gli archi tra nodi adiacenti (4-conn.) possono
 * essere "open", "oneway" (transitabili in una sola direzione), "closed"
 * (sbarra/lavori) o "stairs" (scalinate impercorribili, decorative).
 *
 * Vincoli garantiti dal generatore:
 *   1. Esiste sempre un percorso valido dal postino a tutti i destinatari.
 *   2. L'ottimo (shortest path) è calcolato a posteriori in `pathfinding.ts`.
 *   3. I cambi dinamici (L6+) chiudono/aprono un singolo arco e vengono
 *      pianificati in modo che resti sempre raggiungibile l'obiettivo.
 *
 * Tutto è deterministico per la coppia (livello, varianteId).
 */

import type {
  PostinoLevelConfig, DecorationKind, EdgeKind,
} from "./levels";
import {
  shortestPathLength, edgeKey, isReachable,
} from "./pathfinding";

// ── RNG seeded ───────────────────────────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── Modello mappa ────────────────────────────────────────────────────────────

export interface NodeId { row: number; col: number; }

export interface VillageNode {
  row: number;
  col: number;
  decor: DecorationKind;
  /** "P" = postino, "D{n}" = destinatario, undefined = transitabile generico. */
  ruolo?: "postino" | "destinatario";
  /** Indice 1-based del destinatario (solo se ruolo === "destinatario"). */
  destinatarioIdx?: number;
}

export interface VillageEdge {
  fromRow: number; fromCol: number;
  toRow:   number; toCol:   number;
  /** Stato iniziale dell'arco. */
  kind: EdgeKind;
  /** Solo per oneway: direzione consentita. Da from→to. */
}

export interface DynamicEdgeChange {
  /** Dopo quanti passi (1-based) del postino lungo il percorso. */
  triggerStep: number;
  /** Arco da modificare (chiavi normalizzate). */
  edgeKey: string;
  /** Nuovo stato (closed o open). */
  newKind: EdgeKind;
}

export interface VillageMap {
  rows: number;
  cols: number;
  nodes: VillageNode[][];                 // [row][col]
  /** Mappa key→edge; key = `${minRow},${minCol}|${maxRow},${maxCol}` */
  edges: Map<string, VillageEdge>;
  postino: NodeId;
  destinatari: NodeId[];
  /** Cap di passi (oltre l'ottimo + tolleranza). 0 = no cap. */
  capPassi: number;
  /** Cambi dinamici (L6+). */
  cambi: DynamicEdgeChange[];
  /** Lunghezza ottima del percorso (calcolata dal generatore). */
  ottimo: number;
}

// ── Generatore ───────────────────────────────────────────────────────────────

const DECOR_POOL: readonly DecorationKind[] = [
  "casa", "casa_alta", "bottega", "albero", "casa", "loggia", "casa_alta",
];
const DECOR_RARI: readonly DecorationKind[] = [
  "fontana", "piazza", "chiesa", "campanile", "pozzo", "torre",
];

export function generaMappa(
  cfg: PostinoLevelConfig,
  varianteId: number,
): VillageMap {
  const seed = (cfg.livello * 1009 + varianteId * 7919) >>> 0;
  const rng  = mulberry32(seed);

  const { rows, cols } = cfg;

  // 1. Genera tutti gli archi adiacenti come "open" inizialmente.
  const edges = new Map<string, VillageEdge>();
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (r + 1 < rows) {
        const k = edgeKey({ row: r, col: c }, { row: r + 1, col: c });
        edges.set(k, { fromRow: r, fromCol: c, toRow: r + 1, toCol: c, kind: "open" });
      }
      if (c + 1 < cols) {
        const k = edgeKey({ row: r, col: c }, { row: r, col: c + 1 });
        edges.set(k, { fromRow: r, fromCol: c, toRow: r, toCol: c + 1, kind: "open" });
      }
    }
  }

  // 2. Scegli postino + destinatari su nodi distinti e ben distanziati.
  const tutteCelle: NodeId[] = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) tutteCelle.push({ row: r, col: c });
  const celleShuffle = shuffle(tutteCelle, rng);

  // Postino in un angolo per coerenza visiva.
  const angoli: NodeId[] = [
    { row: 0,        col: 0        },
    { row: 0,        col: cols - 1 },
    { row: rows - 1, col: 0        },
    { row: rows - 1, col: cols - 1 },
  ];
  const postino = pick(angoli, rng);

  // Destinatari: prendi nodi a distanza ≥ 2 dal postino e fra loro.
  const destinatari: NodeId[] = [];
  for (const candidato of celleShuffle) {
    if (destinatari.length === cfg.nDestinatari) break;
    if (candidato.row === postino.row && candidato.col === postino.col) continue;
    const distP = Math.abs(candidato.row - postino.row) + Math.abs(candidato.col - postino.col);
    if (distP < 2) continue;
    const tooClose = destinatari.some(d =>
      Math.abs(d.row - candidato.row) + Math.abs(d.col - candidato.col) < 2,
    );
    if (tooClose) continue;
    destinatari.push(candidato);
  }
  // Fallback: se l'algoritmo greedy non ha raggiunto il numero richiesto
  // (mappa piccola), allenta il vincolo di distanza.
  for (const candidato of celleShuffle) {
    if (destinatari.length === cfg.nDestinatari) break;
    if (candidato.row === postino.row && candidato.col === postino.col) continue;
    if (destinatari.some(d => d.row === candidato.row && d.col === candidato.col)) continue;
    destinatari.push(candidato);
  }

  // 3. Applica vincoli (closed, stairs, oneway) preservando la connettività
  //    dal postino a TUTTI i destinatari.
  const punti = [postino, ...destinatari];
  const tryApplyConstraint = (newKind: EdgeKind): boolean => {
    const keys = shuffle(Array.from(edges.keys()), rng);
    for (const k of keys) {
      const e = edges.get(k)!;
      if (e.kind !== "open") continue;
      // Non bloccare archi incidenti su nodi pendenti (con un solo vicino
      // aperto): rischia di isolarli.
      const tentativo = { ...e, kind: newKind };
      edges.set(k, tentativo);
      const ok = puntiTuttiRaggiungibili(rows, cols, edges, punti);
      if (ok) return true;
      edges.set(k, e);
    }
    return false;
  };

  for (let i = 0; i < cfg.nChiusi;     i++) tryApplyConstraint("closed");
  for (let i = 0; i < cfg.nScalinate;  i++) tryApplyConstraint("stairs");
  for (let i = 0; i < cfg.nSensiUnici; i++) tryApplyConstraint("oneway");

  // 4. Decorazioni per ogni nodo.
  const nodes: VillageNode[][] = [];
  for (let r = 0; r < rows; r++) {
    const riga: VillageNode[] = [];
    for (let c = 0; c < cols; c++) {
      let decor: DecorationKind = pick(DECOR_POOL, rng);
      // Sparse pinch di decorazioni "rare" per dare carattere.
      if (rng() < 0.18) decor = pick(DECOR_RARI, rng);
      riga.push({ row: r, col: c, decor });
    }
    nodes.push(riga);
  }
  // Marca ruoli (sovrascrivendo la decorazione con "piazza"/"bottega"
  // tematiche per maggiore leggibilità — il colore della pin distingue).
  nodes[postino.row][postino.col].ruolo = "postino";
  nodes[postino.row][postino.col].decor = "loggia";
  destinatari.forEach((d, i) => {
    nodes[d.row][d.col].ruolo = "destinatario";
    nodes[d.row][d.col].destinatarioIdx = i + 1;
    // Alterna decorazioni iconiche sui destinatari per riconoscibilità.
    const iconic: DecorationKind[] = ["chiesa", "bottega", "fontana", "campanile", "pozzo", "torre"];
    nodes[d.row][d.col].decor = iconic[i % iconic.length];
  });

  // 5. Calcola l'ottimo (più breve percorso che tocca tutti i destinatari).
  const ottimo = computeOttimo(rows, cols, edges, postino, destinatari);

  // 6. Cambi dinamici (L6+): pianifica 1–2 cambi che avvengono dopo step
  //    intermedi. Per ogni cambio scegli un arco "open" o "closed" lontano
  //    dal postino e verifica che la mappa risultante resti risolvibile.
  const cambi: DynamicEdgeChange[] = [];
  if (cfg.conCambiDinamici) {
    const nCambi = cfg.livello >= 8 ? 2 : 1;
    const stepCandidati = nCambi === 2 ? [2, 4] : [3];
    const giàUsati = new Set<string>();
    for (let i = 0; i < nCambi; i++) {
      const archiCandidati = shuffle(Array.from(edges.entries()), rng);
      for (const [k, e] of archiCandidati) {
        if (giàUsati.has(k)) continue;
        if (e.kind !== "open" && e.kind !== "closed") continue;
        const nuovo: EdgeKind = e.kind === "open" ? "closed" : "open";
        const backup = e.kind;
        edges.set(k, { ...e, kind: nuovo });
        const ok = puntiTuttiRaggiungibili(rows, cols, edges, punti);
        edges.set(k, { ...e, kind: backup });
        if (ok) {
          cambi.push({
            triggerStep: stepCandidati[i],
            edgeKey: k,
            newKind: nuovo,
          });
          giàUsati.add(k);
          break;
        }
      }
    }
  }

  // 7. Cap passi: ottimo + passiBonus. Se passiBonus = 0 → cap dissimulato
  //    grande (essenzialmente illimitato).
  const capPassi = cfg.passiBonus > 0 ? ottimo + cfg.passiBonus : ottimo * 3 + 12;

  return {
    rows, cols, nodes, edges,
    postino, destinatari,
    capPassi, cambi, ottimo,
  };
}

// ── Utilities locali ─────────────────────────────────────────────────────────

function puntiTuttiRaggiungibili(
  rows: number, cols: number,
  edges: Map<string, VillageEdge>,
  punti: NodeId[],
): boolean {
  // Il postino è punti[0]; verifica che ogni destinatario sia raggiungibile.
  const start = punti[0];
  for (let i = 1; i < punti.length; i++) {
    if (!isReachable(rows, cols, edges, start, punti[i])) return false;
  }
  return true;
}

/**
 * Calcola la lunghezza ottima del percorso che parte dal postino e tocca
 * tutti i destinatari in qualsiasi ordine (TSP open su grafo dei distinatari
 * + postino, distanze pairwise via BFS).
 *
 * Per N ≤ 6 destinatari come da specifica, l'enumerazione brute-force delle
 * permutazioni (max 720) è banale.
 */
function computeOttimo(
  rows: number, cols: number,
  edges: Map<string, VillageEdge>,
  postino: NodeId,
  destinatari: NodeId[],
): number {
  const punti = [postino, ...destinatari];
  const N = punti.length;
  const dist: number[][] = [];
  for (let i = 0; i < N; i++) {
    dist.push([]);
    for (let j = 0; j < N; j++) {
      if (i === j) { dist[i].push(0); continue; }
      const d = shortestPathLength(rows, cols, edges, punti[i], punti[j]);
      dist[i].push(d);
    }
  }
  // Permutazioni dei destinatari (indici 1..N-1).
  const idx = Array.from({ length: N - 1 }, (_, i) => i + 1);
  let best = Infinity;
  const permute = (arr: number[], k: number) => {
    if (k === arr.length) {
      let s = dist[0][arr[0]];
      for (let i = 0; i < arr.length - 1; i++) s += dist[arr[i]][arr[i + 1]];
      if (s < best) best = s;
      return;
    }
    for (let i = k; i < arr.length; i++) {
      [arr[k], arr[i]] = [arr[i], arr[k]];
      permute(arr, k + 1);
      [arr[k], arr[i]] = [arr[i], arr[k]];
    }
  };
  if (idx.length > 0) permute(idx, 0); else best = 0;
  return Number.isFinite(best) ? best : 0;
}
