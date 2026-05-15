"use client";

/**
 * Dipinti SVG procedurali per "Il Restauratore".
 *
 * Ogni dipinto è una lista di Element, ciascuno con:
 *   - state base (presente in entrambe le versioni)
 *   - visualType + props per il rendering SVG
 * Il mutation engine produce due "scene" (A = originale, B = restaurato) a
 * partire dallo stesso template applicando N modifiche distinte a N elementi
 * differenti. Ogni differenza espone centerA / centerB per il hit-testing.
 *
 * I dipinti sono renderizzati in un viewBox 200×150 con cornice museale,
 * texture pergamena e palette calda. L'estetica punta su semplicità leggibile
 * per utenti over 60 piuttosto che fotorealismo.
 */

import type { ReactNode } from "react";
import type { RestauroDiffType, RestauroPaintingId, RestauratoreLevelConfig } from "./levels";
import { RESTAURATORE_PALETTE as PAL } from "./levels";

// ─── Tipi ────────────────────────────────────────────────────────────────────

export type VisualType =
  // natura morta
  | "vase" | "apple" | "pear" | "grape" | "leaf" | "candle" | "book" | "lemon" | "plum"
  // paesaggio
  | "sun" | "cloud" | "hill" | "tree" | "house" | "bird" | "moon" | "path" | "bush"
  // ritratto
  | "face" | "hair" | "hat" | "necklace" | "earring" | "collar" | "drape" | "brooch";

export interface ElementState {
  /** Tipo visivo: determina la primitiva SVG da disegnare. */
  visualType: VisualType;
  /** Centro nel sistema viewBox (0–200, 0–150). */
  x: number;
  y: number;
  /** Dimensione (raggio o lato indicativo) — tipicamente 8–30. */
  size: number;
  rotation: number;       // gradi
  color: string;          // colore principale (per elementi con palette propria, ignorato)
  present: boolean;
}

export interface SceneElement {
  id: string;
  state: ElementState;
}

export interface Scene {
  templateId: RestauroPaintingId;
  background: ReactNode;  // sfondo statico (cielo, parete, drappo)
  elements: SceneElement[];
}

export interface Difference {
  elementId: string;
  type: RestauroDiffType;
  centerA: { x: number; y: number } | null;
  centerB: { x: number; y: number } | null;
}

export interface TrialScene {
  templateId: RestauroPaintingId;
  background: ReactNode;
  elementsA: SceneElement[];
  elementsB: SceneElement[];
  differences: Difference[];
}

// ─── RNG helpers ─────────────────────────────────────────────────────────────

function pickOne<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}
function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ─── Palette per i tipi visivi (colori "originali") ──────────────────────────

const COLOR_SWAPS: Record<string, readonly string[]> = {
  apple:    ["#C0392B", "#E67E22", "#7D9C2A", "#A93226"],
  pear:     ["#B7C45A", "#A88E3D", "#D4B852", "#6F8C2C"],
  grape:    ["#5D3A6B", "#7B4F8C", "#3E2A52", "#8E6BA0"],
  lemon:    ["#E1B643", "#D4A12A", "#C99229", "#EAD45E"],
  plum:     ["#5B2D45", "#7F3F5B", "#3E1F31", "#9B567A"],
  leaf:     ["#3F6B2E", "#557A38", "#6B8B3C", "#2F5C25"],
  vase:     ["#B0623F", "#874A2C", "#6B3A1F", "#A55438"],
  candle:   ["#E5D5A1", "#D8C282", "#C4A45E", "#EFE3B6"],
  book:     ["#4E3621", "#6F4A2C", "#3B2716", "#8A5E36"],
  sun:      ["#E8A33C", "#D78B23", "#F0B85B", "#C77818"],
  moon:     ["#E8DCB5", "#D5C28E", "#F0E6C8"],
  cloud:    ["#F2E9D5", "#E8D9B8", "#E0CC9A"],
  hill:     ["#5B7A3B", "#446028", "#6E8C4C", "#385022"],
  tree:     ["#33561F", "#48721F", "#28471A", "#5C7A2E"],
  bush:     ["#48721F", "#5C7A2E", "#3A5C18"],
  house:    ["#D9A063", "#B27842", "#E8B07A", "#945C2E"],
  bird:     ["#2E2418", "#3D2F1F", "#5A4830"],
  path:     ["#B89364", "#A07A4B", "#C9A57A"],
  face:     ["#E8C19A", "#D4A077", "#C28E63"],
  hair:     ["#3B2412", "#5A3820", "#4A2C18"],
  hat:      ["#2A1A0F", "#3D2418", "#5A2D1B"],
  necklace: ["#D9A437", "#E8B848", "#C49126"],
  earring:  ["#E8B848", "#F0CC5E"],
  collar:   ["#EDE2C8", "#D4C4A2", "#FFF6E0"],
  drape:    ["#6B2B2B", "#4A1F1F", "#8C3E3E"],
  brooch:   ["#A93226", "#D9A437", "#5D3A6B"],
};

function pickDifferentColor(current: string, type: VisualType, rng: () => number): string {
  const palette = COLOR_SWAPS[type] ?? [PAL.ink];
  const others = palette.filter((c) => c.toLowerCase() !== current.toLowerCase());
  if (others.length === 0) return current;
  return pickOne(others, rng);
}

// ─── Template scenes ─────────────────────────────────────────────────────────

const NATURA_MORTA_BG = (
  <>
    {/* tavolo */}
    <rect x={0} y={105} width={200} height={45} fill="#7A4F2A" />
    <rect x={0} y={105} width={200} height={3}  fill="#A66D38" />
    {/* parete */}
    <rect x={0} y={0} width={200} height={105} fill="#D9C49A" />
    <rect x={0} y={102} width={200} height={3} fill="#B89968" opacity={0.5} />
  </>
);

const PAESAGGIO_BG = (
  <>
    {/* cielo */}
    <defs>
      <linearGradient id="sky-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"   stopColor="#C6D7E8" />
        <stop offset="60%"  stopColor="#E8D4B0" />
        <stop offset="100%" stopColor="#F0DDB8" />
      </linearGradient>
    </defs>
    <rect x={0} y={0} width={200} height={110} fill="url(#sky-grad)" />
    {/* terreno base */}
    <rect x={0} y={108} width={200} height={42} fill="#7A6238" />
    <ellipse cx={100} cy={112} rx={140} ry={10} fill="#8E7546" />
  </>
);

const RITRATTO_BG = (
  <>
    <defs>
      <radialGradient id="portrait-grad" cx="50%" cy="50%" r="70%">
        <stop offset="0%"   stopColor="#5A3422" />
        <stop offset="100%" stopColor="#2A1A10" />
      </radialGradient>
    </defs>
    <rect x={0} y={0} width={200} height={150} fill="url(#portrait-grad)" />
  </>
);

interface Template {
  id: RestauroPaintingId;
  background: ReactNode;
  baseElements: SceneElement[];
  /** Pool di elementi opzionali per le mutazioni added/removed. */
  optionalElements: SceneElement[];
}

function natura_morta(): Template {
  return {
    id: "natura_morta",
    background: NATURA_MORTA_BG,
    baseElements: [
      { id: "vase",    state: { visualType: "vase",    x:  60, y:  88, size: 22, rotation: 0, color: "#B0623F", present: true } },
      { id: "apple",   state: { visualType: "apple",   x: 110, y: 100, size: 10, rotation: 0, color: "#C0392B", present: true } },
      { id: "pear",    state: { visualType: "pear",    x: 132, y:  98, size: 10, rotation: 0, color: "#B7C45A", present: true } },
      { id: "grape",   state: { visualType: "grape",   x:  92, y: 100, size:  9, rotation: 0, color: "#5D3A6B", present: true } },
      { id: "leaf",    state: { visualType: "leaf",    x: 152, y:  96, size:  8, rotation: -15, color: "#3F6B2E", present: true } },
      { id: "candle",  state: { visualType: "candle",  x:  30, y:  82, size: 14, rotation: 0, color: "#E5D5A1", present: true } },
      { id: "book",    state: { visualType: "book",    x: 165, y: 100, size: 16, rotation: 8, color: "#4E3621", present: true } },
    ],
    optionalElements: [
      { id: "lemon",   state: { visualType: "lemon",   x:  76, y: 102, size:  8, rotation: 0, color: "#E1B643", present: true } },
      { id: "plum",    state: { visualType: "plum",    x: 122, y: 102, size:  8, rotation: 0, color: "#5B2D45", present: true } },
      { id: "leaf2",   state: { visualType: "leaf",    x:  44, y: 100, size:  7, rotation: 25, color: "#557A38", present: true } },
    ],
  };
}

function paesaggio(): Template {
  return {
    id: "paesaggio",
    background: PAESAGGIO_BG,
    baseElements: [
      { id: "sun",     state: { visualType: "sun",   x: 150, y:  30, size: 14, rotation: 0, color: "#E8A33C", present: true } },
      { id: "cloud1",  state: { visualType: "cloud", x:  40, y:  28, size: 18, rotation: 0, color: "#F2E9D5", present: true } },
      { id: "cloud2",  state: { visualType: "cloud", x:  95, y:  20, size: 14, rotation: 0, color: "#E8D9B8", present: true } },
      { id: "hill1",   state: { visualType: "hill",  x:  45, y: 100, size: 38, rotation: 0, color: "#5B7A3B", present: true } },
      { id: "hill2",   state: { visualType: "hill",  x: 135, y: 105, size: 50, rotation: 0, color: "#446028", present: true } },
      { id: "tree1",   state: { visualType: "tree",  x:  25, y:  98, size: 12, rotation: 0, color: "#33561F", present: true } },
      { id: "tree2",   state: { visualType: "tree",  x: 170, y: 100, size: 11, rotation: 0, color: "#48721F", present: true } },
      { id: "house",   state: { visualType: "house", x: 100, y: 102, size: 14, rotation: 0, color: "#D9A063", present: true } },
    ],
    optionalElements: [
      { id: "bird1",   state: { visualType: "bird",  x:  70, y:  45, size:  5, rotation: 0, color: "#2E2418", present: true } },
      { id: "bird2",   state: { visualType: "bird",  x:  85, y:  50, size:  4, rotation: 0, color: "#2E2418", present: true } },
      { id: "bush",    state: { visualType: "bush",  x:  65, y: 112, size:  8, rotation: 0, color: "#48721F", present: true } },
      { id: "path",    state: { visualType: "path",  x: 100, y: 130, size: 30, rotation: 0, color: "#B89364", present: true } },
    ],
  };
}

function ritratto(): Template {
  return {
    id: "ritratto",
    background: RITRATTO_BG,
    baseElements: [
      { id: "drape",    state: { visualType: "drape",    x: 100, y: 130, size: 80, rotation: 0, color: "#6B2B2B", present: true } },
      { id: "collar",   state: { visualType: "collar",   x: 100, y: 110, size: 35, rotation: 0, color: "#EDE2C8", present: true } },
      { id: "face",     state: { visualType: "face",     x: 100, y:  70, size: 22, rotation: 0, color: "#E8C19A", present: true } },
      { id: "hair",     state: { visualType: "hair",     x: 100, y:  55, size: 28, rotation: 0, color: "#3B2412", present: true } },
      { id: "hat",      state: { visualType: "hat",      x: 100, y:  40, size: 30, rotation: 0, color: "#2A1A0F", present: true } },
      { id: "necklace", state: { visualType: "necklace", x: 100, y:  95, size: 16, rotation: 0, color: "#D9A437", present: true } },
      { id: "earring",  state: { visualType: "earring",  x: 122, y:  74, size:  4, rotation: 0, color: "#E8B848", present: true } },
    ],
    optionalElements: [
      { id: "brooch",   state: { visualType: "brooch",   x:  92, y: 108, size:  5, rotation: 0, color: "#A93226", present: true } },
      { id: "earring2", state: { visualType: "earring",  x:  78, y:  74, size:  4, rotation: 0, color: "#E8B848", present: true } },
    ],
  };
}

const TEMPLATES: Record<RestauroPaintingId, () => Template> = {
  natura_morta,
  paesaggio,
  ritratto,
};

// ─── Mutation engine ─────────────────────────────────────────────────────────

function cloneState(s: ElementState): ElementState {
  return { ...s };
}
function cloneElements(els: SceneElement[]): SceneElement[] {
  return els.map((e) => ({ id: e.id, state: cloneState(e.state) }));
}

export function generaTrialScene(
  cfg: RestauratoreLevelConfig,
  rng: () => number,
): TrialScene {
  const templateId = pickOne(cfg.dipintiAmmessi, rng);
  const tpl = TEMPLATES[templateId]();

  const elementsA = cloneElements(tpl.baseElements);
  const elementsB = cloneElements(tpl.baseElements);

  const differences: Difference[] = [];
  const mutatedIds = new Set<string>();

  const allowsAddRemove =
    cfg.tipiAmmessi.includes("added") || cfg.tipiAmmessi.includes("removed");
  const optionalPool = shuffle([...tpl.optionalElements], rng);
  let optionalCursor = 0;

  let tentativi = 0;
  while (differences.length < cfg.nDifferenze && tentativi < 80) {
    tentativi++;
    const tipo = pickOne(cfg.tipiAmmessi, rng);

    if ((tipo === "added" || tipo === "removed") && allowsAddRemove) {
      if (optionalCursor >= optionalPool.length) continue;
      const opt = optionalPool[optionalCursor++];
      if (mutatedIds.has(opt.id)) continue;
      mutatedIds.add(opt.id);
      if (tipo === "added") {
        elementsB.push({ id: opt.id, state: cloneState(opt.state) });
        differences.push({
          elementId: opt.id, type: "added",
          centerA: null,
          centerB: { x: opt.state.x, y: opt.state.y },
        });
      } else {
        elementsA.push({ id: opt.id, state: cloneState(opt.state) });
        differences.push({
          elementId: opt.id, type: "removed",
          centerA: { x: opt.state.x, y: opt.state.y },
          centerB: null,
        });
      }
      continue;
    }

    // mutazioni su base elements
    const candidati = elementsB.filter((e) => !mutatedIds.has(e.id));
    if (candidati.length === 0) break;
    const elB = pickOne(candidati, rng);
    const elA = elementsA.find((e) => e.id === elB.id);
    if (!elA) continue;

    if (tipo === "color") {
      const nuovo = pickDifferentColor(elB.state.color, elB.state.visualType, rng);
      elB.state.color = nuovo;
    } else if (tipo === "scale") {
      // Scala marcata: oltre la soglia percettiva per essere riconoscibile a colpo d'occhio.
      // intensita 1.0 (lv 1) → ~0.50× o ~1.85×; intensita 0.4 (lv 10) → ~0.62× o ~1.55×.
      const grande = rng() < 0.5;
      const factor = grande
        ? 1.55 + cfg.intensita * 0.30   // 1.55 → 1.85
        : 0.62 - cfg.intensita * 0.12;  // 0.62 → 0.50
      elB.state.size = Math.max(5, elB.state.size * factor);
    } else if (tipo === "moved") {
      const range = 22 + cfg.intensita * 10;
      const dx = (rng() * 2 - 1) * range;
      const dy = (rng() * 2 - 1) * range * 0.6;
      elB.state.x = clamp(elB.state.x + dx, 12, 188);
      elB.state.y = clamp(elB.state.y + dy, 12, 138);
    } else if (tipo === "rotate") {
      const delta = (rng() * 2 - 1) * (30 + cfg.intensita * 10);
      elB.state.rotation = elB.state.rotation + (delta === 0 ? 20 : delta);
    } else {
      continue;
    }

    mutatedIds.add(elB.id);
    differences.push({
      elementId: elB.id,
      type: tipo,
      centerA: { x: elA.state.x, y: elA.state.y },
      centerB: { x: elB.state.x, y: elB.state.y },
    });
  }

  return {
    templateId,
    background: tpl.background,
    elementsA,
    elementsB,
    differences,
  };
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ─── Rendering primitives ────────────────────────────────────────────────────

function ElementShape({ s }: { s: ElementState }) {
  if (!s.present) return null;
  const t = `translate(${s.x} ${s.y}) rotate(${s.rotation})`;

  switch (s.visualType) {
    case "vase":
      return (
        <g transform={t}>
          <path
            d={`M -${s.size * 0.5} ${s.size * 0.7}
                Q -${s.size * 0.85} 0 -${s.size * 0.45} -${s.size * 0.6}
                L  ${s.size * 0.45} -${s.size * 0.6}
                Q  ${s.size * 0.85} 0  ${s.size * 0.5} ${s.size * 0.7}
                Z`}
            fill={s.color}
            stroke={PAL.frameDark}
            strokeWidth={0.5}
          />
          <ellipse cx={0} cy={-s.size * 0.6} rx={s.size * 0.45} ry={s.size * 0.12} fill={shade(s.color, -0.3)} />
        </g>
      );
    case "apple":
    case "plum":
      return (
        <g transform={t}>
          <circle cx={0} cy={0} r={s.size * 0.6} fill={s.color} />
          <ellipse cx={-s.size * 0.18} cy={-s.size * 0.2} rx={s.size * 0.18} ry={s.size * 0.12} fill={shade(s.color, 0.35)} opacity={0.55} />
          <path d={`M 0 -${s.size * 0.55} q ${s.size * 0.25} -${s.size * 0.3} ${s.size * 0.45} -${s.size * 0.1}`} stroke="#3F6B2E" strokeWidth={0.8} fill="none" />
        </g>
      );
    case "pear":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={s.size * 0.2} rx={s.size * 0.55} ry={s.size * 0.7} fill={s.color} />
          <ellipse cx={0} cy={-s.size * 0.35} rx={s.size * 0.32} ry={s.size * 0.4} fill={s.color} />
          <ellipse cx={-s.size * 0.18} cy={0} rx={s.size * 0.15} ry={s.size * 0.25} fill={shade(s.color, 0.3)} opacity={0.5} />
        </g>
      );
    case "lemon":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={0} rx={s.size * 0.7} ry={s.size * 0.5} fill={s.color} />
          <ellipse cx={-s.size * 0.2} cy={-s.size * 0.1} rx={s.size * 0.22} ry={s.size * 0.12} fill={shade(s.color, 0.35)} opacity={0.55} />
        </g>
      );
    case "grape": {
      const r = s.size * 0.28;
      return (
        <g transform={t}>
          {[[-1.0, -0.4], [0, -0.6], [1.0, -0.4], [-0.5, 0.2], [0.5, 0.2], [0, 0.7]].map(([dx, dy], i) => (
            <circle key={i} cx={dx * s.size * 0.5} cy={dy * s.size * 0.5} r={r} fill={s.color} stroke={shade(s.color, -0.3)} strokeWidth={0.3} />
          ))}
        </g>
      );
    }
    case "leaf":
      return (
        <g transform={t}>
          <path
            d={`M 0 0 Q ${s.size * 0.6} -${s.size * 0.9} ${s.size * 1.2} -${s.size * 0.2}
                Q ${s.size * 0.6} ${s.size * 0.4} 0 0 Z`}
            fill={s.color}
            stroke={shade(s.color, -0.3)}
            strokeWidth={0.4}
          />
        </g>
      );
    case "candle":
      return (
        <g transform={t}>
          <rect x={-s.size * 0.25} y={-s.size * 0.4} width={s.size * 0.5} height={s.size * 1.1} fill={s.color} stroke={shade(s.color, -0.3)} strokeWidth={0.3} />
          <ellipse cx={0} cy={-s.size * 0.55} rx={s.size * 0.1} ry={s.size * 0.25} fill="#F2B73B" />
          <ellipse cx={0} cy={-s.size * 0.5} rx={s.size * 0.04} ry={s.size * 0.12} fill="#FFE890" />
        </g>
      );
    case "book":
      return (
        <g transform={t}>
          <rect x={-s.size * 0.5} y={-s.size * 0.15} width={s.size} height={s.size * 0.3} fill={s.color} stroke={shade(s.color, -0.3)} strokeWidth={0.4} />
          <line x1={-s.size * 0.45} y1={0} x2={s.size * 0.45} y2={0} stroke={shade(s.color, 0.25)} strokeWidth={0.3} />
        </g>
      );
    case "sun":
      return (
        <g transform={t}>
          <circle cx={0} cy={0} r={s.size * 0.8} fill={shade(s.color, 0.25)} opacity={0.4} />
          <circle cx={0} cy={0} r={s.size * 0.55} fill={s.color} />
        </g>
      );
    case "moon":
      return (
        <g transform={t}>
          <circle cx={0} cy={0} r={s.size * 0.55} fill={s.color} />
          <circle cx={s.size * 0.2} cy={-s.size * 0.05} r={s.size * 0.45} fill={PAL.ink} opacity={0.0} />
        </g>
      );
    case "cloud":
      return (
        <g transform={t}>
          <ellipse cx={-s.size * 0.4} cy={0} rx={s.size * 0.5} ry={s.size * 0.32} fill={s.color} />
          <ellipse cx={0}             cy={-s.size * 0.1} rx={s.size * 0.6} ry={s.size * 0.4} fill={s.color} />
          <ellipse cx={s.size * 0.45} cy={0} rx={s.size * 0.45} ry={s.size * 0.3} fill={s.color} />
        </g>
      );
    case "hill":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={s.size * 0.6} rx={s.size} ry={s.size * 0.6} fill={s.color} />
          <ellipse cx={-s.size * 0.3} cy={s.size * 0.3} rx={s.size * 0.5} ry={s.size * 0.25} fill={shade(s.color, 0.2)} opacity={0.5} />
        </g>
      );
    case "tree":
      return (
        <g transform={t}>
          <rect x={-s.size * 0.12} y={-s.size * 0.1} width={s.size * 0.24} height={s.size * 0.7} fill="#5A3A1F" />
          <circle cx={0} cy={-s.size * 0.5} r={s.size * 0.7} fill={s.color} />
          <circle cx={-s.size * 0.4} cy={-s.size * 0.25} r={s.size * 0.4} fill={shade(s.color, -0.15)} />
          <circle cx={s.size * 0.4}  cy={-s.size * 0.3} r={s.size * 0.4} fill={shade(s.color, 0.15)} />
        </g>
      );
    case "bush":
      return (
        <g transform={t}>
          <ellipse cx={-s.size * 0.4} cy={0} rx={s.size * 0.45} ry={s.size * 0.4} fill={s.color} />
          <ellipse cx={s.size * 0.3}  cy={s.size * 0.05} rx={s.size * 0.5} ry={s.size * 0.42} fill={shade(s.color, -0.15)} />
          <ellipse cx={0}             cy={-s.size * 0.1} rx={s.size * 0.5} ry={s.size * 0.45} fill={shade(s.color, 0.1)} />
        </g>
      );
    case "house":
      return (
        <g transform={t}>
          <rect x={-s.size * 0.5} y={-s.size * 0.1} width={s.size} height={s.size * 0.7} fill={s.color} stroke={shade(s.color, -0.4)} strokeWidth={0.4} />
          <polygon points={`${-s.size * 0.6},${-s.size * 0.1} ${s.size * 0.6},${-s.size * 0.1} 0,${-s.size * 0.7}`} fill={shade(s.color, -0.3)} stroke={shade(s.color, -0.5)} strokeWidth={0.4} />
          <rect x={-s.size * 0.12} y={s.size * 0.25} width={s.size * 0.24} height={s.size * 0.35} fill={shade(s.color, -0.5)} />
          <rect x={-s.size * 0.4} y={s.size * 0.05} width={s.size * 0.2} height={s.size * 0.2} fill="#E8D8A0" />
        </g>
      );
    case "bird":
      return (
        <g transform={t}>
          <path
            d={`M -${s.size} 0 q ${s.size * 0.5} -${s.size * 0.8} ${s.size} 0 q ${s.size * 0.5} -${s.size * 0.8} ${s.size} 0`}
            stroke={s.color}
            strokeWidth={s.size * 0.25}
            fill="none"
            strokeLinecap="round"
          />
        </g>
      );
    case "path":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={0} rx={s.size} ry={s.size * 0.18} fill={s.color} opacity={0.85} />
        </g>
      );
    case "face":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={0} rx={s.size * 0.75} ry={s.size} fill={s.color} />
          {/* sopracciglia */}
          <path d={`M -${s.size * 0.3} -${s.size * 0.3} q ${s.size * 0.15} -${s.size * 0.08} ${s.size * 0.3} 0`} stroke="#3B2412" strokeWidth={0.5} fill="none" />
          <path d={`M  ${s.size * 0.0} -${s.size * 0.3} q ${s.size * 0.15} -${s.size * 0.08} ${s.size * 0.3} 0`} stroke="#3B2412" strokeWidth={0.5} fill="none" />
          {/* occhi */}
          <ellipse cx={-s.size * 0.2} cy={-s.size * 0.15} rx={s.size * 0.07} ry={s.size * 0.05} fill="#2A1A10" />
          <ellipse cx={ s.size * 0.2} cy={-s.size * 0.15} rx={s.size * 0.07} ry={s.size * 0.05} fill="#2A1A10" />
          {/* naso */}
          <path d={`M 0 -${s.size * 0.05} q -${s.size * 0.05} ${s.size * 0.25} ${s.size * 0.05} ${s.size * 0.3}`} stroke={shade(s.color, -0.3)} strokeWidth={0.5} fill="none" />
          {/* labbra */}
          <path d={`M -${s.size * 0.18} ${s.size * 0.45} q ${s.size * 0.18} ${s.size * 0.08} ${s.size * 0.36} 0`} stroke="#8C3A2A" strokeWidth={0.7} fill="none" />
        </g>
      );
    case "hair":
      return (
        <g transform={t}>
          <path
            d={`M -${s.size * 0.7} 0
                Q -${s.size * 0.8} -${s.size * 0.6} -${s.size * 0.4} -${s.size * 0.8}
                Q 0 -${s.size}             ${s.size * 0.4} -${s.size * 0.8}
                Q ${s.size * 0.8} -${s.size * 0.6} ${s.size * 0.7} 0
                Q ${s.size * 0.4} -${s.size * 0.1} 0 -${s.size * 0.15}
                Q -${s.size * 0.4} -${s.size * 0.1} -${s.size * 0.7} 0 Z`}
            fill={s.color}
          />
        </g>
      );
    case "hat":
      return (
        <g transform={t}>
          <ellipse cx={0} cy={s.size * 0.05} rx={s.size * 0.95} ry={s.size * 0.12} fill={s.color} />
          <path d={`M -${s.size * 0.55} ${s.size * 0.05}
                    Q -${s.size * 0.55} -${s.size * 0.5} 0 -${s.size * 0.5}
                    Q  ${s.size * 0.55} -${s.size * 0.5}  ${s.size * 0.55} ${s.size * 0.05} Z`}
                fill={shade(s.color, 0.15)} />
        </g>
      );
    case "necklace": {
      const r = s.size;
      return (
        <g transform={t}>
          <path d={`M -${r * 0.9} 0 Q 0 ${r * 0.65} ${r * 0.9} 0`} stroke={s.color} strokeWidth={1.2} fill="none" />
          {[-0.6, -0.3, 0, 0.3, 0.6].map((p, i) => (
            <circle key={i} cx={p * r * 0.9} cy={r * 0.5 - Math.abs(p) * r * 0.4} r={0.9} fill={shade(s.color, 0.3)} />
          ))}
        </g>
      );
    }
    case "earring":
      return (
        <g transform={t}>
          <line x1={0} y1={0} x2={0} y2={s.size * 0.4} stroke={shade(s.color, -0.3)} strokeWidth={0.4} />
          <circle cx={0} cy={s.size * 0.6} r={s.size * 0.4} fill={s.color} />
        </g>
      );
    case "brooch":
      return (
        <g transform={t}>
          <circle cx={0} cy={0} r={s.size * 0.8} fill="#D9A437" />
          <circle cx={0} cy={0} r={s.size * 0.45} fill={s.color} />
        </g>
      );
    case "collar":
      return (
        <g transform={t}>
          <path
            d={`M -${s.size} 0 Q 0 ${s.size * 0.45} ${s.size} 0
                L ${s.size * 0.6} ${s.size * 0.3}
                Q 0 ${s.size * 0.1} -${s.size * 0.6} ${s.size * 0.3} Z`}
            fill={s.color}
            stroke={shade(s.color, -0.3)}
            strokeWidth={0.5}
          />
        </g>
      );
    case "drape":
      return (
        <g transform={t}>
          <path
            d={`M -${s.size} -${s.size * 0.2}
                Q -${s.size * 0.5} 0 0 -${s.size * 0.1}
                Q ${s.size * 0.5} 0 ${s.size} -${s.size * 0.2}
                L ${s.size} ${s.size * 0.3}
                L -${s.size} ${s.size * 0.3} Z`}
            fill={s.color}
          />
          {/* pieghe */}
          {[-0.5, 0, 0.5].map((p, i) => (
            <path
              key={i}
              d={`M ${p * s.size} -${s.size * 0.15} L ${p * s.size + 1} ${s.size * 0.3}`}
              stroke={shade(s.color, -0.3)}
              strokeWidth={0.4}
              opacity={0.6}
            />
          ))}
        </g>
      );
  }
}

function shade(hex: string, amount: number): string {
  // amount in [-1, 1]; +brighter, -darker
  const h = hex.replace("#", "");
  if (h.length !== 6) return hex;
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  const mix = (c: number) => {
    const target = amount > 0 ? 255 : 0;
    return Math.round(c + (target - c) * Math.abs(amount));
  };
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(mix(r))}${to2(mix(g))}${to2(mix(b))}`;
}

// ─── Painting view component ─────────────────────────────────────────────────

interface PaintingViewProps {
  background: ReactNode;
  elements: SceneElement[];
  /** Differenze trovate (per disegnare il glow di conferma). Mappa elementId → side trovato. */
  foundOnThisSide: Set<string>;
  /** Tutte le differenze, per posizionare i glow nel sistema corretto del lato. */
  differences: Difference[];
  /** "A" o "B" — determina quale lato si sta visualizzando. */
  side: "A" | "B";
  /** Tutte le differenze sono state trovate: avvia animazione di restauro. */
  restaurato: boolean;
  /** Hint flash temporaneo (id elemento → side). */
  hintIds: Set<string>;
  onClickPoint: (xVB: number, yVB: number) => void;
  ariaLabel: string;
}

export function PaintingView({
  background, elements, foundOnThisSide, differences, side, restaurato, hintIds, onClickPoint, ariaLabel,
}: PaintingViewProps) {
  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = e.currentTarget;
    const pt = svg.createSVGPoint();
    pt.x = e.clientX;
    pt.y = e.clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return;
    const inv = ctm.inverse();
    const transformed = pt.matrixTransform(inv);
    onClickPoint(transformed.x, transformed.y);
  };

  return (
    <div
      style={{
        position: "relative",
        border: `4px solid ${PAL.frame}`,
        borderRadius: 4,
        boxShadow: restaurato
          ? `0 0 0 2px ${PAL.shimmer}, 0 0 18px rgba(242,209,136,0.7)`
          : `inset 0 0 8px rgba(0,0,0,0.18), 0 2px 4px rgba(0,0,0,0.18)`,
        background: PAL.frameDark,
        padding: 2,
        transition: "box-shadow 600ms ease",
      }}
    >
      <svg
        viewBox="0 0 200 150"
        role="img"
        aria-label={ariaLabel}
        onClick={handleClick}
        style={{
          display: "block",
          width: "100%",
          height: "auto",
          cursor: "pointer",
          filter: restaurato ? "saturate(1.18) brightness(1.06)" : undefined,
          transition: "filter 600ms ease",
          touchAction: "manipulation",
        }}
      >
        {background}
        {elements.map((el) => (
          <ElementShape key={`${side}-${el.id}`} s={el.state} />
        ))}

        {/* Markers per differenze trovate */}
        {differences.map((d) => {
          if (!foundOnThisSide.has(d.elementId)) return null;
          const c = side === "A" ? d.centerA : d.centerB;
          if (!c) return null;
          return (
            <g key={`found-${d.elementId}`} pointerEvents="none">
              <circle cx={c.x} cy={c.y} r={11} fill="none" stroke={PAL.ok} strokeWidth={1.8} opacity={0.9} />
              <circle cx={c.x} cy={c.y} r={4}  fill={PAL.ok} opacity={0.85} />
            </g>
          );
        })}

        {/* Hint flash (errore o suggerimento finale) */}
        {differences.map((d) => {
          if (!hintIds.has(d.elementId)) return null;
          const c = side === "A" ? d.centerA : d.centerB;
          if (!c) return null;
          return (
            <circle
              key={`hint-${d.elementId}`}
              cx={c.x}
              cy={c.y}
              r={13}
              fill="none"
              stroke={PAL.hint}
              strokeWidth={2}
              opacity={0.9}
              pointerEvents="none"
            >
              <animate attributeName="opacity" values="0;1;0" dur="1.4s" repeatCount="2" />
              <animate attributeName="r"       values="6;16;6" dur="1.4s" repeatCount="2" />
            </circle>
          );
        })}
      </svg>
    </div>
  );
}
