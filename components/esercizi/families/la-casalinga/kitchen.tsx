"use client";

/**
 * Sprite SVG e palette per "La Casalinga".
 *
 * 15 oggetti da cucina stilizzati ma riconoscibili, su tile a sfondo caldo.
 * Tutti gli oggetti condividono viewBox 64x64 e sono pensati per essere
 * renderizzati in tile cliccabili di lato variabile.
 *
 * La scena cucina è renderizzata come 3 superfici a strisce orizzontali con
 * legno chiaro/scuro alternati e ripiani in legno (mensola + piano cottura +
 * tavolo apparecchiato).
 */

import type { CSSProperties } from "react";

// ── Palette calda ──────────────────────────────────────────────────────────

export const KITCHEN_PALETTE = {
  bg:           "#F4E9D8",   // panna calda — sfondo cucina
  wallTop:      "#E8D7BC",   // muro alto
  wallMid:      "#DCC6A1",   // muro medio
  shelfWood:    "#A56C3F",   // legno mensola
  shelfWoodLt:  "#C68C5D",   // legno mensola (highlight)
  stoveTop:     "#5C4630",   // piano cottura scuro
  stoveBurner:  "#2F2418",   // fornello
  tableCloth:   "#D9C3A0",   // tovaglia
  tableClothLt: "#E8D7BC",
  tile:         "#FBF4E8",   // sfondo slot vuoto (incasso chiaro)
  tileEdge:     "rgba(76,52,28,0.18)",
  ink:          "#3A2A18",
  inkSoft:      "#7A6346",
  ok:           "#15803D",
  err:          "#B91C1C",
  miss:         "#F59E0B",
  candleWax:    "#F2D9A5",
  candleWaxDk:  "#D9B97A",
  flame:        "#F59E0B",
  flameCore:    "#FDE68A",
} as const;

export type ObjectId =
  | "moka" | "tazzina" | "tazza" | "barattolo" | "bottiglia"
  | "libro" | "mestolo" | "ciotola" | "piatto" | "pentola"
  | "saliera" | "mortaio" | "pane" | "mela" | "limone";

export const ALL_OBJECTS: readonly ObjectId[] = [
  "moka", "tazzina", "tazza", "barattolo", "bottiglia",
  "libro", "mestolo", "ciotola", "piatto", "pentola",
  "saliera", "mortaio", "pane", "mela", "limone",
];

// ── Componente singolo sprite ──────────────────────────────────────────────

interface SpriteProps {
  id: ObjectId;
  size?: number;
  flipped?: boolean;
}

export function ObjectSprite({ id, size = 60, flipped = false }: SpriteProps) {
  const style: CSSProperties = {
    width: size,
    height: size,
    display: "block",
    transform: flipped ? "scaleX(-1)" : undefined,
    transition: "transform 200ms ease",
  };
  return (
    <svg viewBox="0 0 64 64" style={style} aria-hidden="true">
      {SPRITE_PATHS[id]}
    </svg>
  );
}

// ── Path SVG per ogni oggetto ──────────────────────────────────────────────

const SPRITE_PATHS: Record<ObjectId, JSX.Element> = {
  moka: (
    <g>
      <path d="M16 34 L48 34 L46 56 L18 56 Z" fill="#C0C0C8" stroke="#3a3a40" strokeWidth="1.2" />
      <path d="M18 36 L46 36 L46 40 L18 40 Z" fill="#2c2c30" />
      <path d="M20 14 L44 14 L46 34 L18 34 Z" fill="#1f1f23" />
      <rect x="28" y="9" width="8" height="6" rx="1" fill="#2c2c30" />
      <path d="M44 22 Q56 24 50 36 L44 32 Z" fill="#1f1f23" stroke="#3a3a40" strokeWidth="1" />
      <circle cx="48" cy="14" r="2" fill="#000" />
    </g>
  ),
  tazzina: (
    <g>
      <ellipse cx="32" cy="54" rx="22" ry="3" fill="#000" opacity="0.08" />
      <path d="M18 36 Q18 50 32 50 Q46 50 46 36 Z" fill="#FBF7EE" stroke="#3A2A18" strokeWidth="1.2" />
      <ellipse cx="32" cy="36" rx="14" ry="3" fill="#fff" stroke="#3A2A18" strokeWidth="1.2" />
      <ellipse cx="32" cy="36" rx="10" ry="2" fill="#5C3A1E" />
      <path d="M46 38 Q56 40 50 46 Q47 44 46 42 Z" fill="none" stroke="#3A2A18" strokeWidth="1.5" />
    </g>
  ),
  tazza: (
    <g>
      <ellipse cx="32" cy="56" rx="20" ry="3" fill="#000" opacity="0.08" />
      <path d="M16 22 L46 22 L44 54 L18 54 Z" fill="#E8C9A8" stroke="#3A2A18" strokeWidth="1.4" />
      <ellipse cx="31" cy="22" rx="15" ry="3" fill="#F4E1C8" stroke="#3A2A18" strokeWidth="1.2" />
      <path d="M46 28 Q58 30 56 42 Q54 44 46 42 Z" fill="none" stroke="#3A2A18" strokeWidth="2" />
      <rect x="22" y="34" width="18" height="3" fill="#A56C3F" opacity="0.5" />
    </g>
  ),
  barattolo: (
    <g>
      <ellipse cx="32" cy="58" rx="18" ry="3" fill="#000" opacity="0.08" />
      <rect x="18" y="14" width="28" height="6" rx="1" fill="#B91C1C" stroke="#3A2A18" strokeWidth="1.2" />
      <path d="M18 20 L46 20 L44 56 L20 56 Z" fill="#FFFFFF" stroke="#3A2A18" strokeWidth="1.2" opacity="0.92" />
      <rect x="22" y="28" width="20" height="12" fill="#F4E1C8" stroke="#3A2A18" strokeWidth="0.8" />
      <text x="32" y="37" textAnchor="middle" fontSize="6.5" fontFamily="Georgia,serif" fill="#3A2A18" fontWeight="700">SALE</text>
    </g>
  ),
  bottiglia: (
    <g>
      <ellipse cx="32" cy="58" rx="12" ry="2.5" fill="#000" opacity="0.08" />
      <rect x="28" y="6" width="8" height="14" fill="#3A5F3A" stroke="#1F2937" strokeWidth="1" />
      <path d="M24 20 Q24 22 28 22 L36 22 Q40 22 40 20 L40 36 Q40 40 36 40 L28 40 Q24 40 24 36 Z" fill="#4A7C4A" stroke="#1F2937" strokeWidth="1.2" />
      <path d="M24 36 L40 36 L40 56 L24 56 Z" fill="#3A5F3A" stroke="#1F2937" strokeWidth="1.2" />
      <rect x="25" y="42" width="14" height="8" fill="#F4E1C8" stroke="#1F2937" strokeWidth="0.6" />
      <text x="32" y="48" textAnchor="middle" fontSize="5.5" fontFamily="Georgia,serif" fill="#3A2A18">OLIO</text>
    </g>
  ),
  libro: (
    <g>
      <path d="M10 50 L54 50 L54 56 L10 56 Z" fill="#7A4B2A" stroke="#3A2A18" strokeWidth="1" />
      <rect x="12" y="20" width="40" height="30" fill="#B91C1C" stroke="#3A2A18" strokeWidth="1.2" />
      <rect x="14" y="22" width="36" height="26" fill="#FBF7EE" />
      <line x1="32" y1="22" x2="32" y2="48" stroke="#3A2A18" strokeWidth="0.8" />
      <line x1="18" y1="28" x2="28" y2="28" stroke="#7A6346" strokeWidth="0.7" />
      <line x1="18" y1="32" x2="28" y2="32" stroke="#7A6346" strokeWidth="0.7" />
      <line x1="18" y1="36" x2="28" y2="36" stroke="#7A6346" strokeWidth="0.7" />
      <line x1="36" y1="28" x2="46" y2="28" stroke="#7A6346" strokeWidth="0.7" />
      <line x1="36" y1="32" x2="46" y2="32" stroke="#7A6346" strokeWidth="0.7" />
      <line x1="36" y1="36" x2="46" y2="36" stroke="#7A6346" strokeWidth="0.7" />
    </g>
  ),
  mestolo: (
    <g>
      <path d="M18 50 L40 26 L48 32 L26 56 Z" fill="#A56C3F" stroke="#3A2A18" strokeWidth="1.2" />
      <ellipse cx="44" cy="20" rx="12" ry="9" fill="#C68C5D" stroke="#3A2A18" strokeWidth="1.4" transform="rotate(-30 44 20)" />
      <ellipse cx="44" cy="20" rx="8" ry="5.5" fill="#7A4B2A" transform="rotate(-30 44 20)" />
    </g>
  ),
  ciotola: (
    <g>
      <ellipse cx="32" cy="56" rx="22" ry="3" fill="#000" opacity="0.08" />
      <path d="M10 34 Q10 54 32 54 Q54 54 54 34 Z" fill="#3A5F8A" stroke="#1F2937" strokeWidth="1.4" />
      <ellipse cx="32" cy="34" rx="22" ry="4.5" fill="#5980B0" stroke="#1F2937" strokeWidth="1.2" />
      <ellipse cx="32" cy="34" rx="18" ry="3.2" fill="#F4E1C8" />
      <path d="M16 36 Q24 30 32 36 Q40 30 48 36" fill="none" stroke="#A56C3F" strokeWidth="1.2" />
    </g>
  ),
  piatto: (
    <g>
      <ellipse cx="32" cy="36" rx="28" ry="9" fill="#F4E8D2" stroke="#3A2A18" strokeWidth="1.4" />
      <ellipse cx="32" cy="36" rx="22" ry="6.5" fill="#FFFFFF" stroke="#3A2A18" strokeWidth="0.9" />
      <ellipse cx="32" cy="36" rx="14" ry="3.8" fill="none" stroke="#A56C3F" strokeWidth="1.2" strokeDasharray="3 2" />
    </g>
  ),
  pentola: (
    <g>
      <ellipse cx="32" cy="56" rx="22" ry="3" fill="#000" opacity="0.08" />
      <rect x="12" y="26" width="40" height="28" rx="2" fill="#2F2418" stroke="#000" strokeWidth="1.2" />
      <ellipse cx="32" cy="26" rx="20" ry="4" fill="#444038" stroke="#000" strokeWidth="1.2" />
      <rect x="4"  y="30" width="10" height="3" fill="#444038" stroke="#000" strokeWidth="0.8" />
      <rect x="50" y="30" width="10" height="3" fill="#444038" stroke="#000" strokeWidth="0.8" />
      <path d="M14 38 Q32 42 50 38" fill="none" stroke="#666" strokeWidth="0.6" opacity="0.7" />
    </g>
  ),
  saliera: (
    <g>
      <ellipse cx="32" cy="58" rx="12" ry="2.5" fill="#000" opacity="0.08" />
      <rect x="22" y="10" width="20" height="6" rx="1" fill="#7A6346" stroke="#3A2A18" strokeWidth="1" />
      <circle cx="27" cy="13" r="0.9" fill="#3A2A18" />
      <circle cx="32" cy="13" r="0.9" fill="#3A2A18" />
      <circle cx="37" cy="13" r="0.9" fill="#3A2A18" />
      <path d="M22 16 L42 16 L40 56 L24 56 Z" fill="#FBF7EE" stroke="#3A2A18" strokeWidth="1.2" />
      <ellipse cx="32" cy="28" rx="6" ry="2" fill="#fff" />
    </g>
  ),
  mortaio: (
    <g>
      <ellipse cx="32" cy="56" rx="22" ry="3" fill="#000" opacity="0.08" />
      <path d="M14 36 Q14 54 32 54 Q50 54 50 36 Z" fill="#C68C5D" stroke="#3A2A18" strokeWidth="1.4" />
      <ellipse cx="32" cy="36" rx="18" ry="4" fill="#7A4B2A" stroke="#3A2A18" strokeWidth="1.2" />
      <ellipse cx="32" cy="36" rx="13" ry="2.6" fill="#3A2A18" />
      <path d="M40 14 L46 12 L48 36 L44 38 Z" fill="#A56C3F" stroke="#3A2A18" strokeWidth="1" transform="rotate(15 44 24)" />
    </g>
  ),
  pane: (
    <g>
      <ellipse cx="32" cy="54" rx="24" ry="4" fill="#000" opacity="0.08" />
      <path d="M10 36 Q10 24 22 22 Q32 18 42 22 Q54 24 54 38 Q54 52 32 52 Q10 52 10 36 Z" fill="#C68C5D" stroke="#7A4B2A" strokeWidth="1.4" />
      <path d="M14 30 Q22 26 32 30 Q42 26 50 30" fill="none" stroke="#7A4B2A" strokeWidth="1.2" />
      <path d="M16 38 Q24 34 32 38 Q40 34 48 38" fill="none" stroke="#7A4B2A" strokeWidth="1.2" />
      <path d="M18 46 Q26 42 32 46 Q38 42 46 46" fill="none" stroke="#7A4B2A" strokeWidth="1.2" />
    </g>
  ),
  mela: (
    <g>
      <ellipse cx="32" cy="56" rx="14" ry="2.5" fill="#000" opacity="0.08" />
      <path d="M32 14 Q34 12 38 12 Q38 16 36 18 Z" fill="#3A5F3A" />
      <path d="M22 26 Q14 30 16 44 Q18 56 32 54 Q46 56 48 44 Q50 30 42 26 Q36 24 32 28 Q28 24 22 26 Z" fill="#D14A3A" stroke="#7A1A1A" strokeWidth="1.2" />
      <path d="M26 32 Q24 36 26 40" fill="none" stroke="#F5C0B0" strokeWidth="1.4" opacity="0.7" />
      <path d="M32 14 L32 22" stroke="#3A2A18" strokeWidth="1.4" />
    </g>
  ),
  limone: (
    <g>
      <ellipse cx="32" cy="54" rx="18" ry="3" fill="#000" opacity="0.08" />
      <path d="M10 38 Q10 22 32 22 Q54 22 54 38 Q54 54 32 54 Q10 54 10 38 Z" fill="#FCD34D" stroke="#92400E" strokeWidth="1.4" />
      <path d="M8 38 Q6 38 4 36" fill="none" stroke="#92400E" strokeWidth="1.6" />
      <path d="M56 38 Q58 38 60 36" fill="none" stroke="#92400E" strokeWidth="1.6" />
      <path d="M18 32 Q24 26 32 30" fill="none" stroke="#FDE68A" strokeWidth="2" opacity="0.85" />
    </g>
  ),
};

// ── Candela ────────────────────────────────────────────────────────────────

interface CandleProps {
  /** 0 = consumata, 1 = intera. */
  progress: number;
  height?: number;
}

/**
 * Candela che brucia. La cera si accorcia in base a `progress` (1 → 0).
 * La fiamma sfarfalla leggermente.
 */
export function Candle({ progress, height = 80 }: CandleProps) {
  const p = Math.max(0, Math.min(1, progress));
  const waxFullH = 50;
  const waxH     = Math.max(4, waxFullH * p);
  const waxY     = 18 + (waxFullH - waxH);

  return (
    <svg viewBox="0 0 30 80" style={{ width: height * (30 / 80), height, display: "block" }} aria-hidden="true">
      {/* piattino */}
      <ellipse cx="15" cy="74" rx="13" ry="2.5" fill="#A56C3F" stroke="#3A2A18" strokeWidth="0.8" />
      <path d="M3 72 Q15 76 27 72 Q27 74 15 76 Q3 74 3 72 Z" fill="#7A4B2A" />
      {/* cera */}
      <rect x="10" y={waxY} width="10" height={waxH} fill={KITCHEN_PALETTE.candleWax} stroke="#7A6346" strokeWidth="0.8" />
      <rect x="10" y={waxY} width="3"  height={waxH} fill={KITCHEN_PALETTE.candleWaxDk} opacity="0.5" />
      {/* stoppino */}
      <line x1="15" y1={waxY - 4} x2="15" y2={waxY} stroke="#3A2A18" strokeWidth="1.1" />
      {/* fiamma */}
      <g style={{ transformOrigin: `15px ${waxY - 4}px`, animation: "casa-flicker 380ms ease-in-out infinite alternate" }}>
        <path d={`M15 ${waxY - 4} Q10 ${waxY - 9} 12 ${waxY - 14} Q15 ${waxY - 19} 18 ${waxY - 14} Q20 ${waxY - 9} 15 ${waxY - 4} Z`} fill={KITCHEN_PALETTE.flame} />
        <path d={`M15 ${waxY - 5} Q13 ${waxY - 9} 14 ${waxY - 12} Q15 ${waxY - 15} 16 ${waxY - 12} Q17 ${waxY - 9} 15 ${waxY - 5} Z`} fill={KITCHEN_PALETTE.flameCore} />
      </g>
      <circle cx="15" cy={waxY - 17} r="2" fill={KITCHEN_PALETTE.flame} opacity="0.25" />
    </svg>
  );
}

// ── Cornice scena cucina ───────────────────────────────────────────────────
// Ogni superficie è una "striscia" orizzontale con texture diversa.

interface SurfaceFrameProps {
  surface: "mensola" | "piano" | "tavolo";
  children: React.ReactNode;
}

export function SurfaceFrame({ surface, children }: SurfaceFrameProps) {
  const cfg = {
    mensola: {
      label: "Mensola",
      bg:    KITCHEN_PALETTE.wallTop,
      strip: KITCHEN_PALETTE.shelfWood,
      stripLt: KITCHEN_PALETTE.shelfWoodLt,
    },
    piano: {
      label: "Piano cottura",
      bg:    KITCHEN_PALETTE.wallMid,
      strip: KITCHEN_PALETTE.stoveTop,
      stripLt: "#7A5A3D",
    },
    tavolo: {
      label: "Tavolo",
      bg:    KITCHEN_PALETTE.wallMid,
      strip: KITCHEN_PALETTE.tableCloth,
      stripLt: KITCHEN_PALETTE.tableClothLt,
    },
  }[surface];

  return (
    <div
      style={{
        position: "relative",
        background: cfg.bg,
        padding: "0.55rem 0.6rem 0.35rem 0.6rem",
        borderBottom: `4px solid ${cfg.strip}`,
        boxShadow: `inset 0 -6px 0 ${cfg.stripLt}`,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 4, left: 8,
          fontSize: "0.55rem",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: KITCHEN_PALETTE.inkSoft,
          opacity: 0.7,
        }}
      >
        {cfg.label}
      </span>
      {children}
    </div>
  );
}
