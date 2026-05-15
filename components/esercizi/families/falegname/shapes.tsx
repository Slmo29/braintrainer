"use client";

/**
 * Sagome SVG dei "pezzi di legno" per Il Falegname.
 *
 * Tutti i percorsi sono progettati nel viewBox 0 0 200 200, centrati attorno
 * a (100, 100). Asimmetrici per design (la rotazione e lo specchio devono
 * essere visivamente distinguibili).
 *
 * Stile: silhouette piena in tonalità legno + ombreggiatura sottile per
 * suggerire venature. Niente foto, niente raster: solo path vettoriali.
 */

import type { CSSProperties, FC, SVGProps } from "react";

// Palette legno (intagliato) — toni caldi saturati su sfondo scuro
const LEGNO_BASE   = "#E8B96B"; // miele caldo
const LEGNO_SCURO  = "#9E6730"; // noce
const LEGNO_BORDO  = "#2A150A"; // bruciato (bordo carboncino)
const LEGNO_LUCE   = "#F7DCA0"; // luce dorata sul bordo

export type ShapeId =
  // Complessità 1 — lettere stilizzate intagliate (paradigma Cooper & Shepard)
  | "lettera_R" | "lettera_F" | "lettera_G" | "lettera_J" | "lettera_L" | "lettera_P"
  | "lettera_K" | "lettera_Z"
  // Complessità 2 — utensili da bottega
  | "chiave_inglese" | "martello" | "accetta" | "cacciavite"
  | "pialla" | "squadra"
  // Complessità 3 — lame, ancore, animali (forme organiche/complesse)
  | "sega" | "coltello" | "scalpello" | "falce"
  | "ancora" | "foglia"
  | "pesce" | "gatto" | "uccello" | "cavallo";

export type GruppoSemantico = "lettere" | "utensili" | "lame" | "animali" | "natura";

/** Banda di complessità per stratificare il pool per livello. */
export type Complessita = 1 | 2 | 3;

export interface ShapeMeta {
  id:          ShapeId;
  nome:        string;
  gruppo:      GruppoSemantico;
  /** 1 = semplice (lettere), 2 = utensili medi, 3 = complesse (lame/animali). */
  complessita: Complessita;
  /** Path principale (silhouette piena). */
  d:        string;
  /** Path secondario per dettaglio interno (venatura/ombra). Opzionale. */
  dettagli?: string[];
  /**
   * Path "variante": stesso oggetto con piccole modifiche a una caratteristica
   * (es. ganasce più strette, manico più corto, coda più piccola).
   * Usato come distrattore "near-miss" dal livello 3 in poi.
   *
   * Descrizione della modifica per QA — non rendered all'utente.
   */
  variante:    { d: string; dettagli?: string[]; descr: string };
  /**
   * Seconda variante con modifica diversa (es. su altra caratteristica).
   * Usata ai livelli alti (9–10) per costruire trial con 2 near-miss.
   */
  variante2?: { d: string; dettagli?: string[]; descr: string };
}

// ── Path SVG (viewBox 0 0 200 200) ─────────────────────────────────────────

const SHAPES: Record<ShapeId, ShapeMeta> = {
  // ── LETTERE INTAGLIATE (complessità 1 — paradigma Cooper & Shepard) ──────
  // Asimmetriche sull'asse Y → la specchiata è chiaramente distinguibile
  // dalla ruotata. Adatte ai livelli iniziali e per insegnare lo specchio.
  lettera_R: {
    id: "lettera_R", nome: "R", gruppo: "lettere", complessita: 1,
    d: "M 50 30 L 110 30 L 138 38 L 152 56 L 152 88 L 138 106 L 116 114 L 138 132 L 158 170 L 130 170 L 112 138 L 96 122 L 80 122 L 80 170 L 50 170 Z M 80 56 L 80 96 L 112 96 L 124 88 L 124 64 L 112 56 Z",
    variante:  { descr: "gambo più lungo", d: "M 50 30 L 110 30 L 138 38 L 152 56 L 152 88 L 138 106 L 116 114 L 138 132 L 168 184 L 138 184 L 118 144 L 96 122 L 80 122 L 80 184 L 50 184 Z M 80 56 L 80 96 L 112 96 L 124 88 L 124 64 L 112 56 Z" },
    variante2: { descr: "pancia più piccola", d: "M 50 30 L 108 30 L 130 38 L 142 54 L 142 78 L 130 92 L 112 100 L 132 116 L 158 170 L 130 170 L 112 124 L 96 110 L 80 110 L 80 170 L 50 170 Z M 80 56 L 80 84 L 104 84 L 116 76 L 116 62 L 104 56 Z" },
  },
  lettera_F: {
    id: "lettera_F", nome: "F", gruppo: "lettere", complessita: 1,
    d: "M 50 30 L 150 30 L 150 58 L 80 58 L 80 88 L 134 88 L 134 116 L 80 116 L 80 170 L 50 170 Z",
    variante:  { descr: "barra centrale più corta", d: "M 50 30 L 150 30 L 150 58 L 80 58 L 80 88 L 118 88 L 118 116 L 80 116 L 80 170 L 50 170 Z" },
    variante2: { descr: "barra superiore più corta", d: "M 50 30 L 132 30 L 132 58 L 80 58 L 80 88 L 134 88 L 134 116 L 80 116 L 80 170 L 50 170 Z" },
  },
  lettera_G: {
    id: "lettera_G", nome: "G", gruppo: "lettere", complessita: 1,
    d: "M 100 28 L 134 32 L 158 50 L 168 78 L 168 90 L 140 90 L 140 82 L 130 64 L 110 56 L 88 64 L 76 86 L 76 116 L 88 138 L 110 146 L 130 138 L 138 124 L 110 124 L 110 100 L 168 100 L 168 158 L 144 162 L 132 152 L 108 170 L 76 168 L 50 150 L 38 116 L 38 80 L 56 50 Z",
    variante:  { descr: "barra interna più corta", d: "M 100 28 L 134 32 L 158 50 L 168 78 L 168 90 L 140 90 L 140 82 L 130 64 L 110 56 L 88 64 L 76 86 L 76 116 L 88 138 L 110 146 L 130 138 L 138 124 L 124 124 L 124 100 L 168 100 L 168 158 L 144 162 L 132 152 L 108 170 L 76 168 L 50 150 L 38 116 L 38 80 L 56 50 Z" },
    variante2: { descr: "apertura più stretta", d: "M 100 28 L 134 32 L 158 50 L 168 78 L 168 90 L 140 90 L 140 82 L 130 64 L 114 58 L 92 66 L 80 88 L 80 116 L 92 138 L 114 146 L 130 138 L 138 124 L 110 124 L 110 100 L 168 100 L 168 158 L 144 162 L 132 152 L 108 170 L 76 168 L 50 150 L 38 116 L 38 80 L 56 50 Z" },
  },
  lettera_J: {
    id: "lettera_J", nome: "J", gruppo: "lettere", complessita: 1,
    d: "M 78 30 L 148 30 L 148 58 L 134 58 L 134 130 L 124 158 L 96 172 L 64 168 L 42 152 L 30 122 L 58 116 L 68 134 L 86 142 L 102 134 L 106 116 L 106 58 L 78 58 Z",
    variante:  { descr: "uncino più piccolo", d: "M 78 30 L 148 30 L 148 58 L 134 58 L 134 130 L 124 154 L 102 166 L 76 162 L 56 148 L 46 124 L 70 118 L 80 134 L 96 140 L 108 132 L 110 116 L 106 58 L 78 58 Z" },
    variante2: { descr: "barra superiore più larga", d: "M 64 30 L 160 30 L 160 58 L 134 58 L 134 130 L 124 158 L 96 172 L 64 168 L 42 152 L 30 122 L 58 116 L 68 134 L 86 142 L 102 134 L 106 116 L 106 58 L 64 58 Z" },
  },
  lettera_L: {
    id: "lettera_L", nome: "L", gruppo: "lettere", complessita: 1,
    d: "M 50 30 L 80 30 L 80 142 L 160 142 L 160 170 L 50 170 Z",
    variante:  { descr: "barra orizzontale più corta", d: "M 50 30 L 80 30 L 80 142 L 138 142 L 138 170 L 50 170 Z" },
    variante2: { descr: "asta verticale più corta", d: "M 50 50 L 80 50 L 80 142 L 160 142 L 160 170 L 50 170 Z" },
  },
  lettera_P: {
    id: "lettera_P", nome: "P", gruppo: "lettere", complessita: 1,
    d: "M 50 30 L 116 30 L 142 38 L 158 56 L 158 92 L 142 110 L 116 118 L 80 118 L 80 170 L 50 170 Z M 80 56 L 80 92 L 116 92 L 128 84 L 128 64 L 116 56 Z",
    variante:  { descr: "pancia più grande", d: "M 50 30 L 122 30 L 148 38 L 164 60 L 164 98 L 148 116 L 122 124 L 80 124 L 80 170 L 50 170 Z M 80 56 L 80 98 L 122 98 L 134 90 L 134 64 L 122 56 Z" },
    variante2: { descr: "asta più lunga", d: "M 50 30 L 116 30 L 142 38 L 158 56 L 158 92 L 142 110 L 116 118 L 80 118 L 80 184 L 50 184 Z M 80 56 L 80 92 L 116 92 L 128 84 L 128 64 L 116 56 Z" },
  },
  lettera_K: {
    id: "lettera_K", nome: "K", gruppo: "lettere", complessita: 1,
    d: "M 50 30 L 80 30 L 80 90 L 134 30 L 168 30 L 110 96 L 172 170 L 138 170 L 90 112 L 80 122 L 80 170 L 50 170 Z",
    variante:  { descr: "gambe più aperte", d: "M 50 30 L 80 30 L 80 86 L 142 30 L 178 30 L 116 100 L 184 170 L 146 170 L 92 112 L 80 124 L 80 170 L 50 170 Z" },
    variante2: { descr: "asta più stretta", d: "M 50 30 L 74 30 L 74 90 L 134 30 L 168 30 L 110 96 L 172 170 L 138 170 L 88 112 L 74 124 L 74 170 L 50 170 Z" },
  },
  lettera_Z: {
    id: "lettera_Z", nome: "Z", gruppo: "lettere", complessita: 1,
    d: "M 40 30 L 162 30 L 162 56 L 84 140 L 162 140 L 162 170 L 40 170 L 40 144 L 118 60 L 40 60 Z",
    variante:  { descr: "diagonale più ripida", d: "M 40 30 L 162 30 L 162 50 L 70 142 L 162 142 L 162 170 L 40 170 L 40 150 L 132 58 L 40 58 Z" },
    variante2: { descr: "barre più corte", d: "M 50 30 L 152 30 L 152 56 L 84 140 L 152 140 L 152 170 L 50 170 L 50 144 L 118 60 L 50 60 Z" },
  },

  // ── UTENSILI ─────────────────────────────────────────────────────────────
  chiave_inglese: {
    id: "chiave_inglese", nome: "chiave inglese", gruppo: "utensili", complessita: 2,
    d: "M 60 24 L 90 24 L 102 36 L 102 50 L 86 50 L 86 62 L 100 62 L 100 78 L 86 78 L 86 92 L 112 118 L 138 144 L 152 158 L 158 172 L 152 184 L 138 188 L 124 182 L 110 168 L 84 142 L 70 128 L 56 128 L 56 110 L 70 110 L 70 96 L 56 96 L 56 80 L 70 80 L 70 66 L 60 56 Z",
    dettagli: ["M 76 96 L 80 110 L 70 110 Z"],
    // Ganasce più strette: 86 → 90, 100 → 94 (apertura più chiusa).
    variante: {
      descr: "ganasce più strette",
      d: "M 60 24 L 90 24 L 102 36 L 102 50 L 90 50 L 90 62 L 94 62 L 94 78 L 90 78 L 90 92 L 112 118 L 138 144 L 152 158 L 158 172 L 152 184 L 138 188 L 124 182 L 110 168 L 84 142 L 70 128 L 56 128 L 56 110 L 70 110 L 70 96 L 56 96 L 56 80 L 70 80 L 70 66 L 60 56 Z",
      dettagli: ["M 76 96 L 80 110 L 70 110 Z"],
    },
    // Manico più lungo: estende il braccio in basso a destra.
    variante2: {
      descr: "manico più lungo",
      d: "M 60 24 L 90 24 L 102 36 L 102 50 L 86 50 L 86 62 L 100 62 L 100 78 L 86 78 L 86 92 L 112 118 L 138 144 L 162 168 L 172 184 L 162 194 L 146 194 L 132 184 L 110 168 L 84 142 L 70 128 L 56 128 L 56 110 L 70 110 L 70 96 L 56 96 L 56 80 L 70 80 L 70 66 L 60 56 Z",
    },
  },
  martello: {
    id: "martello", nome: "martello", gruppo: "utensili", complessita: 2,
    d: "M 38 36 L 96 36 L 110 44 L 124 36 L 158 36 L 168 46 L 168 78 L 158 88 L 126 88 L 116 80 L 110 84 L 110 168 L 118 178 L 118 186 L 86 186 L 86 178 L 94 168 L 94 84 L 86 80 L 76 88 L 38 88 Z",
    dettagli: ["M 110 88 L 110 84 M 154 46 L 154 78"],
    // Testa più corta: 38 → 54 a sinistra.
    variante: {
      descr: "testa più corta a sinistra",
      d: "M 54 36 L 96 36 L 110 44 L 124 36 L 158 36 L 168 46 L 168 78 L 158 88 L 126 88 L 116 80 L 110 84 L 110 168 L 118 178 L 118 186 L 86 186 L 86 178 L 94 168 L 94 84 L 86 80 L 76 88 L 54 88 Z",
      dettagli: ["M 110 88 L 110 84"],
    },
    // Manico più tozzo (largo): 86/94 → 80/100.
    variante2: {
      descr: "manico più largo",
      d: "M 38 36 L 96 36 L 110 44 L 124 36 L 158 36 L 168 46 L 168 78 L 158 88 L 126 88 L 116 80 L 110 84 L 110 168 L 122 178 L 122 186 L 78 186 L 78 178 L 90 168 L 90 84 L 86 80 L 76 88 L 38 88 Z",
    },
  },
  accetta: {
    id: "accetta", nome: "accetta", gruppo: "utensili", complessita: 2,
    d: "M 60 20 L 122 20 L 168 56 L 174 74 L 168 94 L 138 110 L 126 110 L 116 98 L 110 98 L 110 168 L 118 180 L 118 188 L 88 188 L 88 180 L 96 168 L 96 98 L 88 98 L 70 100 L 60 88 Z",
    dettagli: ["M 122 28 L 156 56 L 160 74 L 152 88 L 132 96 L 120 96 L 108 84 L 108 30 Z"],
    // Lama più piccola: 168/174/168 → 156/162/156.
    variante: {
      descr: "lama più piccola",
      d: "M 60 20 L 122 20 L 156 50 L 162 70 L 156 88 L 134 104 L 126 104 L 116 96 L 110 96 L 110 168 L 118 180 L 118 188 L 88 188 L 88 180 L 96 168 L 96 96 L 88 96 L 70 100 L 60 88 Z",
      dettagli: ["M 122 28 L 148 52 L 152 68 L 144 82 L 130 92 L 120 92 L 108 80 L 108 30 Z"],
    },
    // Manico più corto: 168/188 → 150/170.
    variante2: {
      descr: "manico più corto",
      d: "M 60 20 L 122 20 L 168 56 L 174 74 L 168 94 L 138 110 L 126 110 L 116 98 L 110 98 L 110 150 L 118 164 L 118 170 L 88 170 L 88 164 L 96 150 L 96 98 L 88 98 L 70 100 L 60 88 Z",
    },
  },
  cacciavite: {
    id: "cacciavite", nome: "cacciavite", gruppo: "utensili", complessita: 2,
    d: "M 76 24 L 124 24 L 134 36 L 134 78 L 124 88 L 116 88 L 116 130 L 122 134 L 122 160 L 110 174 L 110 188 L 90 188 L 90 174 L 78 160 L 78 134 L 84 130 L 84 88 L 76 88 L 66 78 L 66 36 Z",
    dettagli: ["M 76 36 L 124 36 M 76 56 L 124 56 M 76 78 L 124 78"],
    // Impugnatura più corta: 24 → 40.
    variante: {
      descr: "impugnatura più corta",
      d: "M 76 40 L 124 40 L 134 50 L 134 80 L 124 88 L 116 88 L 116 130 L 122 134 L 122 160 L 110 174 L 110 188 L 90 188 L 90 174 L 78 160 L 78 134 L 84 130 L 84 88 L 76 88 L 66 80 L 66 50 Z",
      dettagli: ["M 76 50 L 124 50 M 76 70 L 124 70"],
    },
    // Punta più larga: 78/122 → 72/128.
    variante2: {
      descr: "punta più larga",
      d: "M 76 24 L 124 24 L 134 36 L 134 78 L 124 88 L 116 88 L 116 130 L 128 134 L 128 160 L 114 174 L 114 188 L 86 188 L 86 174 L 72 160 L 72 134 L 84 130 L 84 88 L 76 88 L 66 78 L 66 36 Z",
    },
  },
  pialla: {
    id: "pialla", nome: "pialla", gruppo: "utensili", complessita: 2,
    d: "M 18 96 L 36 80 L 76 78 L 110 92 L 154 96 L 184 102 L 184 130 L 170 142 L 132 142 L 110 138 L 86 142 L 38 142 L 22 132 Z M 80 60 L 110 60 L 122 76 L 110 92 L 80 92 L 70 76 Z",
    dettagli: ["M 36 110 L 184 110 M 60 130 L 64 130 L 64 134 L 60 134 Z", "M 140 130 L 144 130 L 144 134 L 140 134 Z"],
    variante:  { descr: "impugnatura più alta", d: "M 18 96 L 36 80 L 76 78 L 110 92 L 154 96 L 184 102 L 184 130 L 170 142 L 132 142 L 110 138 L 86 142 L 38 142 L 22 132 Z M 78 44 L 112 44 L 124 70 L 112 92 L 78 92 L 66 70 Z" },
    variante2: { descr: "base più corta a destra", d: "M 18 96 L 36 80 L 76 78 L 110 92 L 144 96 L 170 102 L 170 130 L 156 142 L 130 142 L 110 138 L 86 142 L 38 142 L 22 132 Z M 80 60 L 110 60 L 122 76 L 110 92 L 80 92 L 70 76 Z" },
  },
  squadra: {
    id: "squadra", nome: "squadra a L", gruppo: "utensili", complessita: 2,
    d: "M 30 30 L 60 30 L 60 140 L 180 140 L 180 170 L 30 170 Z",
    dettagli: ["M 80 140 L 80 158 M 100 140 L 100 158 M 120 140 L 120 158 M 140 140 L 140 158 M 160 140 L 160 158", "M 60 60 L 50 60 M 60 80 L 50 80 M 60 100 L 50 100 M 60 120 L 50 120"],
    variante:  { descr: "braccio orizzontale più corto", d: "M 30 30 L 60 30 L 60 140 L 150 140 L 150 170 L 30 170 Z" },
    variante2: { descr: "braccio verticale più corto", d: "M 30 60 L 60 60 L 60 140 L 180 140 L 180 170 L 30 170 Z" },
  },

  // ── LAME ─────────────────────────────────────────────────────────────────
  sega: {
    id: "sega", nome: "sega", gruppo: "lame", complessita: 3,
    d: "M 18 64 L 156 64 L 168 70 L 178 84 L 182 102 L 178 118 L 168 130 L 156 134 L 38 134 L 24 124 L 22 110 L 18 100 Z M 40 134 L 36 142 L 42 148 L 42 158 L 36 164 L 42 170 L 42 180 L 36 184 L 30 178 L 30 168 L 24 162 L 30 156 L 30 146 L 36 140 Z",
    dettagli: ["M 18 70 L 26 64 L 34 70 L 42 64 L 50 70 L 58 64 L 66 70 L 74 64 L 82 70 L 90 64 L 98 70 L 106 64 L 114 70 L 122 64 L 130 70 L 138 64 L 146 70 L 154 64"],
    // Lama più corta: 18 → 50.
    variante: {
      descr: "lama più corta",
      d: "M 50 64 L 156 64 L 168 70 L 178 84 L 182 102 L 178 118 L 168 130 L 156 134 L 60 134 L 50 124 L 48 110 L 50 100 Z M 62 134 L 58 142 L 64 148 L 64 158 L 58 164 L 64 170 L 64 180 L 58 184 L 52 178 L 52 168 L 46 162 L 52 156 L 52 146 L 58 140 Z",
      dettagli: ["M 50 70 L 58 64 L 66 70 L 74 64 L 82 70 L 90 64 L 98 70 L 106 64 L 114 70 L 122 64 L 130 70 L 138 64 L 146 70 L 154 64"],
    },
    // Impugnatura più grande: handle in basso allargato.
    variante2: {
      descr: "impugnatura più grande",
      d: "M 18 64 L 156 64 L 168 70 L 178 84 L 182 102 L 178 118 L 168 130 L 156 134 L 38 134 L 24 124 L 22 110 L 18 100 Z M 38 134 L 30 144 L 40 150 L 40 164 L 28 170 L 40 178 L 40 192 L 30 196 L 22 188 L 22 174 L 14 166 L 22 158 L 22 144 L 30 138 Z",
      dettagli: ["M 18 70 L 26 64 L 34 70 L 42 64 L 50 70 L 58 64 L 66 70 L 74 64 L 82 70 L 90 64 L 98 70 L 106 64 L 114 70 L 122 64 L 130 70 L 138 64 L 146 70 L 154 64"],
    },
  },
  coltello: {
    id: "coltello", nome: "coltello", gruppo: "lame", complessita: 3,
    d: "M 12 88 L 130 76 L 144 82 L 144 102 L 132 108 L 124 108 L 124 118 L 158 118 L 174 124 L 184 134 L 184 152 L 174 162 L 158 168 L 124 168 L 110 158 L 110 108 L 12 100 Z",
    dettagli: ["M 130 124 L 174 124 M 130 138 L 174 138 M 130 152 L 174 152"],
    // Punta più smussata: 12 → 28.
    variante: {
      descr: "punta più smussata",
      d: "M 28 84 L 130 76 L 144 82 L 144 102 L 132 108 L 124 108 L 124 118 L 158 118 L 174 124 L 184 134 L 184 152 L 174 162 L 158 168 L 124 168 L 110 158 L 110 108 L 28 104 Z",
      dettagli: ["M 130 124 L 174 124 M 130 138 L 174 138 M 130 152 L 174 152"],
    },
    // Impugnatura più larga: 184/174 → 192/180.
    variante2: {
      descr: "impugnatura più larga",
      d: "M 12 88 L 130 76 L 144 82 L 144 102 L 132 108 L 124 108 L 124 116 L 158 116 L 178 124 L 192 138 L 192 156 L 178 168 L 158 172 L 124 172 L 110 158 L 110 108 L 12 100 Z",
    },
  },
  scalpello: {
    id: "scalpello", nome: "scalpello", gruppo: "lame", complessita: 3,
    d: "M 18 84 L 88 84 L 96 92 L 96 110 L 88 118 L 18 118 L 12 110 L 12 92 Z M 96 86 L 156 86 L 156 116 L 96 116 Z M 156 92 L 182 102 L 156 112 Z",
    dettagli: ["M 36 84 L 36 118 M 56 84 L 56 118 M 76 84 L 76 118"],
    // Lama più larga (più alta): 86/116 → 80/122.
    variante: {
      descr: "lama più larga",
      d: "M 18 84 L 88 84 L 96 92 L 96 110 L 88 118 L 18 118 L 12 110 L 12 92 Z M 96 80 L 156 80 L 156 122 L 96 122 Z M 156 86 L 182 102 L 156 118 Z",
      dettagli: ["M 36 84 L 36 118 M 56 84 L 56 118 M 76 84 L 76 118"],
    },
    // Impugnatura più corta: 18 → 34.
    variante2: {
      descr: "impugnatura più corta",
      d: "M 34 84 L 88 84 L 96 92 L 96 110 L 88 118 L 34 118 L 28 110 L 28 92 Z M 96 86 L 156 86 L 156 116 L 96 116 Z M 156 92 L 182 102 L 156 112 Z",
      dettagli: ["M 50 84 L 50 118 M 72 84 L 72 118"],
    },
  },
  falce: {
    id: "falce", nome: "falce", gruppo: "lame", complessita: 3,
    d: "M 30 152 L 50 152 L 78 138 L 110 110 L 138 76 L 156 44 L 168 22 L 184 32 L 174 60 L 156 96 L 130 130 L 100 158 L 70 172 L 40 174 L 30 172 Z M 40 168 L 70 168 L 96 156 L 122 132 L 146 102 L 162 72 L 172 50 L 168 42 L 156 64 L 138 92 L 116 118 L 92 138 L 68 150 L 44 154 Z",
    // Curva meno profonda (più dritta).
    variante: {
      descr: "lama meno curva",
      d: "M 30 152 L 50 150 L 84 138 L 118 116 L 146 86 L 162 54 L 174 30 L 188 38 L 178 62 L 162 96 L 138 128 L 108 152 L 76 168 L 44 174 L 30 172 Z M 44 168 L 72 168 L 100 156 L 128 134 L 150 106 L 166 76 L 174 54 L 170 46 L 160 64 L 142 90 L 120 116 L 96 134 L 72 148 L 48 154 Z",
    },
    // Manico più lungo.
    variante2: {
      descr: "manico più lungo",
      d: "M 20 168 L 50 156 L 78 138 L 110 110 L 138 76 L 156 44 L 168 22 L 184 32 L 174 60 L 156 96 L 130 130 L 100 158 L 70 178 L 30 188 L 18 184 Z",
    },
  },

  // ── NATURA (oggetti naturali/simbolici asimmetrici) ──────────────────────
  // L'ancora ha tradizionalmente simmetria sinistra-destra, ma qui ne uso
  // una versione "anticata" con un braccio del rampino più curvo dell'altro
  // (intaglio artigianale) per garantire asimmetria utile alla rotazione.
  ancora: {
    id: "ancora", nome: "ancora", gruppo: "natura", complessita: 3,
    d: "M 96 22 L 110 22 L 116 28 L 116 38 L 110 44 L 110 60 L 138 60 L 138 76 L 110 76 L 110 134 L 138 130 L 156 116 L 168 96 L 184 102 L 174 130 L 152 152 L 122 168 L 110 170 L 110 184 L 96 184 L 96 168 L 82 166 L 56 152 L 32 130 L 22 102 L 38 96 L 50 116 L 68 130 L 96 134 L 96 76 L 70 76 L 70 60 L 96 60 L 96 44 L 90 38 L 90 28 Z",
    dettagli: ["M 60 138 L 78 152 L 96 156 M 110 156 L 130 150 L 146 138"],
    variante:  { descr: "rampino più piccolo", d: "M 96 22 L 110 22 L 116 28 L 116 38 L 110 44 L 110 60 L 138 60 L 138 76 L 110 76 L 110 130 L 130 126 L 144 114 L 156 100 L 168 108 L 156 128 L 138 144 L 116 156 L 110 158 L 110 184 L 96 184 L 96 158 L 88 156 L 68 144 L 50 128 L 36 108 L 50 100 L 60 114 L 76 126 L 96 130 L 96 76 L 70 76 L 70 60 L 96 60 L 96 44 L 90 38 L 90 28 Z" },
    variante2: { descr: "asta più lunga", d: "M 96 22 L 110 22 L 116 28 L 116 38 L 110 44 L 110 60 L 138 60 L 138 76 L 110 76 L 110 148 L 138 144 L 156 130 L 168 110 L 184 116 L 174 144 L 152 166 L 122 182 L 110 184 L 110 196 L 96 196 L 96 184 L 82 180 L 56 166 L 32 144 L 22 116 L 38 110 L 50 130 L 68 144 L 96 148 L 96 76 L 70 76 L 70 60 L 96 60 L 96 44 L 90 38 L 90 28 Z" },
  },
  foglia: {
    id: "foglia", nome: "foglia", gruppo: "natura", complessita: 3,
    d: "M 100 26 L 122 38 L 144 60 L 158 88 L 164 118 L 158 148 L 142 168 L 122 180 L 116 182 L 116 188 L 104 188 L 104 168 L 88 162 L 70 144 L 54 116 L 50 88 L 56 64 L 70 46 L 88 32 Z",
    dettagli: ["M 104 36 L 104 168 M 80 60 L 104 84 M 124 70 L 104 90 M 80 100 L 104 116 M 124 110 L 104 124 M 84 134 L 104 146"],
    variante:  { descr: "punta più affusolata", d: "M 100 12 L 122 36 L 144 60 L 158 88 L 164 118 L 158 148 L 142 168 L 122 180 L 116 182 L 116 188 L 104 188 L 104 168 L 88 162 L 70 144 L 54 116 L 50 88 L 56 64 L 70 46 L 88 30 Z" },
    variante2: { descr: "stelo più corto", d: "M 100 26 L 122 38 L 144 60 L 158 88 L 164 118 L 158 148 L 142 168 L 122 178 L 116 178 L 116 184 L 104 184 L 104 174 L 88 168 L 70 150 L 54 122 L 50 92 L 56 66 L 70 46 L 88 32 Z" },
  },

  // ── ANIMALI ──────────────────────────────────────────────────────────────
  pesce: {
    id: "pesce", nome: "pesce", gruppo: "animali", complessita: 3,
    d: "M 30 100 L 50 78 L 80 68 L 116 70 L 144 86 L 156 100 L 174 76 L 184 70 L 184 130 L 174 124 L 156 100 L 144 114 L 116 130 L 80 132 L 50 122 L 30 100 Z",
    dettagli: ["M 60 96 L 64 96 L 64 100 L 60 100 Z", "M 86 80 L 94 88 L 86 96 Z"],
    // Coda più piccola: 174/184 → 164/170.
    variante: {
      descr: "coda più piccola",
      d: "M 30 100 L 50 78 L 80 68 L 116 70 L 144 86 L 156 100 L 164 84 L 170 80 L 170 120 L 164 116 L 156 100 L 144 114 L 116 130 L 80 132 L 50 122 L 30 100 Z",
      dettagli: ["M 60 96 L 64 96 L 64 100 L 60 100 Z", "M 86 80 L 94 88 L 86 96 Z"],
    },
    // Corpo più alto (più tondo).
    variante2: {
      descr: "corpo più tondo",
      d: "M 30 100 L 50 68 L 80 58 L 116 60 L 144 80 L 156 100 L 174 76 L 184 70 L 184 130 L 174 124 L 156 100 L 144 120 L 116 140 L 80 142 L 50 132 L 30 100 Z",
    },
  },
  gatto: {
    id: "gatto", nome: "gatto", gruppo: "animali", complessita: 3,
    d: "M 60 184 L 60 100 L 50 84 L 58 60 L 76 72 L 92 70 L 92 36 L 112 56 L 120 60 L 134 58 L 142 80 L 144 110 L 156 124 L 168 144 L 170 168 L 158 160 L 148 142 L 138 154 L 138 184 Z",
    dettagli: ["M 96 86 L 100 86 L 100 90 L 96 90 Z", "M 116 86 L 120 86 L 120 90 L 116 90 Z"],
    // Orecchio più corto: 92 36 → 96 50.
    variante: {
      descr: "orecchio più corto",
      d: "M 60 184 L 60 100 L 50 84 L 58 60 L 76 72 L 92 70 L 96 50 L 112 60 L 120 60 L 134 58 L 142 80 L 144 110 L 156 124 L 168 144 L 170 168 L 158 160 L 148 142 L 138 154 L 138 184 Z",
      dettagli: ["M 96 86 L 100 86 L 100 90 L 96 90 Z", "M 116 86 L 120 86 L 120 90 L 116 90 Z"],
    },
    // Coda più corta: 168/170 → 160/162.
    variante2: {
      descr: "coda più corta",
      d: "M 60 184 L 60 100 L 50 84 L 58 60 L 76 72 L 92 70 L 92 36 L 112 56 L 120 60 L 134 58 L 142 80 L 144 110 L 156 124 L 160 138 L 162 162 L 154 156 L 148 142 L 138 154 L 138 184 Z",
    },
  },
  uccello: {
    id: "uccello", nome: "uccello", gruppo: "animali", complessita: 3,
    d: "M 24 110 L 38 96 L 56 86 L 78 82 L 78 64 L 96 78 L 116 82 L 134 92 L 148 110 L 152 130 L 178 138 L 180 146 L 158 146 L 148 142 L 142 156 L 128 168 L 110 170 L 92 164 L 76 152 L 62 134 L 48 124 L 36 124 L 28 122 Z",
    dettagli: ["M 86 102 L 90 102 L 90 106 L 86 106 Z", "M 56 110 L 76 116 M 76 132 L 96 138"],
    // Becco più corto: 24/38 → 36/46.
    variante: {
      descr: "becco più corto",
      d: "M 36 110 L 46 96 L 56 86 L 78 82 L 78 64 L 96 78 L 116 82 L 134 92 L 148 110 L 152 130 L 178 138 L 180 146 L 158 146 L 148 142 L 142 156 L 128 168 L 110 170 L 92 164 L 76 152 L 62 134 L 48 124 L 40 122 L 36 122 Z",
      dettagli: ["M 86 102 L 90 102 L 90 106 L 86 106 Z"],
    },
    // Coda più lunga: 178/180 → 188/192.
    variante2: {
      descr: "coda più lunga",
      d: "M 24 110 L 38 96 L 56 86 L 78 82 L 78 64 L 96 78 L 116 82 L 134 92 L 148 110 L 152 130 L 188 138 L 192 150 L 158 150 L 148 144 L 142 156 L 128 168 L 110 170 L 92 164 L 76 152 L 62 134 L 48 124 L 36 124 L 28 122 Z",
    },
  },
  cavallo: {
    id: "cavallo", nome: "cavallo", gruppo: "animali", complessita: 3,
    d: "M 30 70 L 46 60 L 64 64 L 76 78 L 88 84 L 110 86 L 140 92 L 158 104 L 168 122 L 168 146 L 174 168 L 178 184 L 166 184 L 158 168 L 152 152 L 140 152 L 138 168 L 142 184 L 130 184 L 124 168 L 118 150 L 96 148 L 86 168 L 88 184 L 76 184 L 70 168 L 66 150 L 58 140 L 50 124 L 50 108 L 42 96 L 32 88 Z",
    dettagli: ["M 50 76 L 54 76 L 54 80 L 50 80 Z", "M 38 70 L 30 64 M 32 74 L 24 74"],
    // Zampe più corte: 184 → 168.
    variante: {
      descr: "zampe più corte",
      d: "M 30 70 L 46 60 L 64 64 L 76 78 L 88 84 L 110 86 L 140 92 L 158 104 L 168 122 L 168 146 L 174 160 L 178 168 L 166 168 L 158 158 L 152 152 L 140 152 L 138 162 L 142 168 L 130 168 L 124 162 L 118 150 L 96 148 L 86 162 L 88 168 L 76 168 L 70 162 L 66 150 L 58 140 L 50 124 L 50 108 L 42 96 L 32 88 Z",
      dettagli: ["M 50 76 L 54 76 L 54 80 L 50 80 Z", "M 38 70 L 30 64 M 32 74 L 24 74"],
    },
    // Collo/criniera più curvi (testa più alta): 30 70 / 46 60 → 22 56 / 40 46.
    variante2: {
      descr: "collo più alto",
      d: "M 22 56 L 40 46 L 60 54 L 76 78 L 88 84 L 110 86 L 140 92 L 158 104 L 168 122 L 168 146 L 174 168 L 178 184 L 166 184 L 158 168 L 152 152 L 140 152 L 138 168 L 142 184 L 130 184 L 124 168 L 118 150 L 96 148 L 86 168 L 88 184 L 76 184 L 70 168 L 66 150 L 58 140 L 50 124 L 50 108 L 42 88 L 30 76 Z",
    },
  },
};

export const SHAPE_LIST: ShapeMeta[] = Object.values(SHAPES);

export function getShape(id: ShapeId): ShapeMeta {
  return SHAPES[id];
}

export function shapesByGruppo(gruppo: GruppoSemantico): ShapeMeta[] {
  return SHAPE_LIST.filter((s) => s.gruppo === gruppo);
}

export function shapesByComplessita(bande: readonly Complessita[]): ShapeMeta[] {
  return SHAPE_LIST.filter((s) => bande.includes(s.complessita));
}

// ── Componenti di rendering ────────────────────────────────────────────────

/** Quale "versione" della sagoma renderizzare. */
export type ShapeRenderKind = "base" | "variante" | "variante2";

interface PezzoLegnoProps extends Omit<SVGProps<SVGSVGElement>, "transform"> {
  shapeId:    ShapeId;
  /** Versione da renderizzare. Default "base". */
  kind?:      ShapeRenderKind;
  /** Rotazione 2D nel piano (gradi). */
  rotZ?:      number;
  /** Rotazioni 3D (gradi). Applicate via CSS transform. */
  rotX?:      number;
  rotY?:      number;
  /** Specchio orizzontale (target specchiato → distrattore L7+). */
  specchio?:  boolean;
  /** Dimensione lato (px). */
  size?:      number;
  /** Stile extra (per highlight su selezione). */
  styleExtra?: CSSProperties;
}

/**
 * Renderizza un pezzo di legno con rotazione/specchio dati.
 * Il path è disegnato in tinta legno con un sottile bordo scuro per il
 * "bisello dell'intaglio" e poche striature interne per simulare la venatura.
 */
export const PezzoLegno: FC<PezzoLegnoProps> = ({
  shapeId, kind = "base", rotZ = 0, rotX = 0, rotY = 0, specchio = false,
  size = 140, styleExtra, ...rest
}) => {
  const meta = getShape(shapeId);
  // Selezione path/dettagli in base alla versione.
  const fallback = meta.variante;
  const variantData =
    kind === "variante"  ? meta.variante :
    kind === "variante2" ? (meta.variante2 ?? fallback) :
                           null;
  const pathD       = variantData ? variantData.d        : meta.d;
  const pathDettagli = variantData ? variantData.dettagli : meta.dettagli;

  // CSS transform combinato. perspective() rende visibile la rotazione 3D.
  // L'ordine è importante: scaleX(-1) per primo applica il mirror "alla
  // sagoma originale", poi rotazioni nel mondo trasformato.
  const transform = [
    rotX !== 0 || rotY !== 0 ? "perspective(520px)" : "",
    specchio ? "scaleX(-1)" : "",
    rotY !== 0 ? `rotateY(${rotY}deg)` : "",
    rotX !== 0 ? `rotateX(${rotX}deg)` : "",
    rotZ !== 0 ? `rotate(${rotZ}deg)` : "",
  ].filter(Boolean).join(" ");

  return (
    <svg
      viewBox="0 0 200 200"
      width={size}
      height={size}
      style={{
        transform,
        transformStyle: "preserve-3d",
        display: "block",
        ...styleExtra,
      }}
      {...rest}
    >
      <defs>
        <linearGradient id={`grad-${shapeId}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"  stopColor={LEGNO_LUCE}  />
          <stop offset="55%" stopColor={LEGNO_BASE}  />
          <stop offset="100%" stopColor={LEGNO_SCURO} />
        </linearGradient>
      </defs>
      <path
        d={pathD}
        fill={`url(#grad-${shapeId})`}
        stroke={LEGNO_BORDO}
        strokeWidth={2.2}
        strokeLinejoin="round"
      />
      {pathDettagli?.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke={LEGNO_BORDO}
          strokeOpacity={0.55}
          strokeWidth={1.6}
          strokeLinecap="round"
        />
      ))}
    </svg>
  );
};
