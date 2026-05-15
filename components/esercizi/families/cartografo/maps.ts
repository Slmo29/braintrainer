// Definizioni mappe: griglia di intersezioni cols×rows + landmark posizionati su intersezioni.
// Le strade collegano implicitamente ogni intersezione adiacente (orizzontale/verticale).

export type LandmarkType =
  | "fontana"
  | "chiesa"
  | "piazza"
  | "negozio"
  | "albero"
  | "panchina"
  | "torre"
  | "ponte";

export interface Landmark {
  x: number;
  y: number;
  type: LandmarkType;
  /** Nome usato nelle istruzioni testuali (es. "la fontana centrale"). */
  nome: string;
}

export interface MapDef {
  id: string;
  cols: number; // intersezioni in orizzontale
  rows: number; // intersezioni in verticale
  landmarks: Landmark[];
  /** Quartieri (blocchi tra strade) decorativi: x,y = angolo top-left del blocco, color hint. */
  blocchi?: { x: number; y: number; tinta: "rosa" | "ocra" | "verde" | "azzurro" }[];
}

// 10 mappe di complessità crescente
export const MAPS: Record<string, MapDef> = {
  m1: {
    id: "m1",
    cols: 3,
    rows: 3,
    landmarks: [],
    blocchi: [
      { x: 0, y: 0, tinta: "ocra" },
      { x: 1, y: 1, tinta: "rosa" },
    ],
  },
  m2: {
    id: "m2",
    cols: 4,
    rows: 3,
    landmarks: [{ x: 2, y: 1, type: "fontana", nome: "la fontana" }],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "verde" },
      { x: 1, y: 1, tinta: "ocra" },
    ],
  },
  m3: {
    id: "m3",
    cols: 4,
    rows: 4,
    landmarks: [
      { x: 1, y: 1, type: "fontana", nome: "la fontana" },
      { x: 2, y: 2, type: "chiesa", nome: "la chiesa" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 0, y: 2, tinta: "verde" },
      { x: 2, y: 2, tinta: "azzurro" },
    ],
  },
  m4: {
    id: "m4",
    cols: 4,
    rows: 4,
    landmarks: [
      { x: 1, y: 1, type: "fontana", nome: "la fontana" },
      { x: 2, y: 2, type: "chiesa", nome: "la chiesa" },
      { x: 0, y: 3, type: "albero", nome: "il vecchio albero" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "ocra" },
      { x: 1, y: 0, tinta: "rosa" },
      { x: 2, y: 1, tinta: "verde" },
      { x: 0, y: 2, tinta: "azzurro" },
      { x: 2, y: 2, tinta: "rosa" },
    ],
  },
  m5: {
    id: "m5",
    cols: 5,
    rows: 4,
    landmarks: [
      { x: 2, y: 1, type: "piazza", nome: "la piazza" },
      { x: 1, y: 2, type: "fontana", nome: "la fontana" },
      { x: 3, y: 2, type: "negozio", nome: "il negozio" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 3, y: 1, tinta: "verde" },
      { x: 1, y: 2, tinta: "azzurro" },
    ],
  },
  m6: {
    id: "m6",
    cols: 5,
    rows: 5,
    landmarks: [
      { x: 2, y: 2, type: "fontana", nome: "la fontana centrale" },
      { x: 0, y: 1, type: "chiesa", nome: "la chiesa" },
      { x: 4, y: 0, type: "torre", nome: "la torre" },
      { x: 3, y: 4, type: "albero", nome: "il grande albero" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 3, y: 1, tinta: "verde" },
      { x: 1, y: 3, tinta: "azzurro" },
      { x: 3, y: 3, tinta: "rosa" },
    ],
  },
  m7: {
    id: "m7",
    cols: 5,
    rows: 5,
    landmarks: [
      { x: 2, y: 2, type: "piazza", nome: "la piazza" },
      { x: 0, y: 0, type: "torre", nome: "la torre" },
      { x: 4, y: 1, type: "chiesa", nome: "la chiesa" },
      { x: 1, y: 4, type: "fontana", nome: "la fontana" },
      { x: 3, y: 3, type: "negozio", nome: "il negozio" },
    ],
    blocchi: [
      { x: 1, y: 0, tinta: "ocra" },
      { x: 3, y: 0, tinta: "rosa" },
      { x: 0, y: 2, tinta: "verde" },
      { x: 3, y: 1, tinta: "azzurro" },
      { x: 1, y: 2, tinta: "rosa" },
      { x: 2, y: 3, tinta: "ocra" },
    ],
  },
  m8: {
    id: "m8",
    cols: 6,
    rows: 5,
    landmarks: [
      { x: 1, y: 1, type: "fontana", nome: "la fontana" },
      { x: 4, y: 1, type: "chiesa", nome: "la chiesa" },
      { x: 0, y: 3, type: "albero", nome: "il vecchio albero" },
      { x: 2, y: 2, type: "piazza", nome: "la piazza" },
      { x: 5, y: 4, type: "torre", nome: "la torre" },
      { x: 3, y: 4, type: "panchina", nome: "la panchina" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 4, y: 0, tinta: "verde" },
      { x: 1, y: 2, tinta: "azzurro" },
      { x: 3, y: 2, tinta: "rosa" },
      { x: 0, y: 3, tinta: "ocra" },
      { x: 4, y: 3, tinta: "azzurro" },
    ],
  },
  m9: {
    id: "m9",
    cols: 6,
    rows: 6,
    landmarks: [
      { x: 0, y: 0, type: "torre", nome: "la torre" },
      { x: 2, y: 1, type: "fontana", nome: "la fontana" },
      { x: 5, y: 0, type: "ponte", nome: "il ponte" },
      { x: 1, y: 3, type: "chiesa", nome: "la chiesa" },
      { x: 4, y: 2, type: "piazza", nome: "la piazza grande" },
      { x: 3, y: 4, type: "negozio", nome: "il negozio" },
      { x: 5, y: 5, type: "albero", nome: "il grande albero" },
      { x: 2, y: 5, type: "panchina", nome: "la panchina" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 4, y: 0, tinta: "verde" },
      { x: 1, y: 2, tinta: "azzurro" },
      { x: 3, y: 1, tinta: "rosa" },
      { x: 0, y: 4, tinta: "ocra" },
      { x: 2, y: 3, tinta: "verde" },
      { x: 4, y: 4, tinta: "rosa" },
    ],
  },
  m10: {
    id: "m10",
    cols: 6,
    rows: 6,
    landmarks: [
      { x: 1, y: 1, type: "torre", nome: "la torre antica" },
      { x: 4, y: 1, type: "fontana", nome: "la fontana di marmo" },
      { x: 2, y: 3, type: "chiesa", nome: "la chiesa" },
      { x: 5, y: 2, type: "piazza", nome: "la piazza" },
      { x: 0, y: 4, type: "ponte", nome: "il ponte" },
      { x: 3, y: 5, type: "albero", nome: "il vecchio olmo" },
      { x: 5, y: 5, type: "negozio", nome: "il forno" },
      { x: 2, y: 0, type: "panchina", nome: "la panchina del viale" },
    ],
    blocchi: [
      { x: 0, y: 0, tinta: "rosa" },
      { x: 2, y: 0, tinta: "ocra" },
      { x: 4, y: 0, tinta: "verde" },
      { x: 0, y: 2, tinta: "azzurro" },
      { x: 3, y: 2, tinta: "rosa" },
      { x: 1, y: 4, tinta: "ocra" },
      { x: 3, y: 4, tinta: "verde" },
      { x: 4, y: 3, tinta: "azzurro" },
    ],
  },
};

export function getMap(id: string): MapDef {
  const m = MAPS[id];
  if (!m) throw new Error(`Mappa sconosciuta: ${id}`);
  return m;
}
