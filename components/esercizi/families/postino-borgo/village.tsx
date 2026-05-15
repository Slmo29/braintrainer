"use client";

/**
 * Sprite SVG e palette per "Il Postino del Borgo".
 *
 * Estetica: cartolina italiana pittoresca — colori caldi (terracotta, ocra,
 * salvia), tratti spessi e arrotondati, sfumature minime. Tutti gli sprite
 * occupano un viewBox 100×100 e vengono scalati dal container.
 */

import { memo } from "react";
import type { DecorationKind } from "./levels";

export const PALETTE = {
  bg:         "#F2E4C9",   // crema invecchiata (sfondo pagina)
  mapBg:      "#E8D4A8",   // pergamena
  street:     "#F8ECD2",   // pavimentazione
  streetEdge: "#C9A66B",
  ink:        "#3D2914",
  inkSoft:    "#7A5A38",
  accent:     "#7A5A38",
  ok:         "#3F7A4B",
  err:        "#B23A2E",
  stamp:      "#B23A2E",
  pathLine:   "#B23A2E",
  pathPreview:"#D38B7D",
  destBadge:  "#F2C24E",
  postino:    "#1F5187",
  sky:        "#CFE3EE",
  // Tetti e muri
  roofA:      "#A14530",
  roofB:      "#8C3A28",
  wallA:      "#F4E0BA",
  wallB:      "#EFD8A5",
  shutter:    "#5F8A6E",
  door:       "#5C3A22",
  leaf:       "#6FA46F",
  trunk:      "#7A5A38",
  water:      "#7FB8C7",
  stone:      "#CFAE7B",
};

// ── Decorazioni cellulari ───────────────────────────────────────────────────

interface DecorProps { kind: DecorationKind; size?: number; }

export const Decor = memo(function Decor({ kind, size = 64 }: DecorProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ display: "block" }}>
      {renderDecor(kind)}
    </svg>
  );
});

function renderDecor(kind: DecorationKind): JSX.Element {
  switch (kind) {
    case "casa":       return <Casa />;
    case "casa_alta":  return <CasaAlta />;
    case "bottega":    return <Bottega />;
    case "fontana":    return <Fontana />;
    case "piazza":     return <Piazza />;
    case "chiesa":     return <Chiesa />;
    case "campanile":  return <Campanile />;
    case "albero":     return <Albero />;
    case "pozzo":      return <Pozzo />;
    case "torre":      return <Torre />;
    case "loggia":     return <Loggia />;
  }
}

function Casa() {
  return (
    <g>
      <rect x="22" y="48" width="56" height="38" fill={PALETTE.wallA} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points="18,50 50,28 82,50" fill={PALETTE.roofA} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="44" y="62" width="12" height="24" fill={PALETTE.door} stroke={PALETTE.ink} strokeWidth="1.6" />
      <rect x="28" y="58" width="10" height="10" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.4" />
      <rect x="62" y="58" width="10" height="10" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.4" />
    </g>
  );
}
function CasaAlta() {
  return (
    <g>
      <rect x="28" y="34" width="44" height="52" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <polygon points="24,36 50,18 76,36" fill={PALETTE.roofB} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="44" y="68" width="12" height="18" fill={PALETTE.door} stroke={PALETTE.ink} strokeWidth="1.6" />
      <rect x="34" y="44" width="9" height="9" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.2" />
      <rect x="57" y="44" width="9" height="9" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.2" />
      <rect x="34" y="58" width="9" height="9" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.2" />
      <rect x="57" y="58" width="9" height="9" fill={PALETTE.shutter} stroke={PALETTE.ink} strokeWidth="1.2" />
    </g>
  );
}
function Bottega() {
  return (
    <g>
      <rect x="20" y="46" width="60" height="40" fill={PALETTE.wallA} stroke={PALETTE.ink} strokeWidth="2.2" />
      <rect x="16" y="42" width="68" height="8" fill={PALETTE.roofA} stroke={PALETTE.ink} strokeWidth="2" />
      <rect x="26" y="56" width="16" height="14" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.4" />
      <rect x="58" y="56" width="16" height="14" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.4" />
      <rect x="44" y="56" width="12" height="30" fill={PALETTE.door} stroke={PALETTE.ink} strokeWidth="1.6" />
      <path d="M 18 42 Q 50 30 82 42" fill="none" stroke={PALETTE.stamp} strokeWidth="2.5" />
    </g>
  );
}
function Fontana() {
  return (
    <g>
      <ellipse cx="50" cy="76" rx="32" ry="9" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="2" />
      <ellipse cx="50" cy="68" rx="28" ry="7" fill={PALETTE.water} stroke={PALETTE.ink} strokeWidth="1.8" />
      <rect x="46" y="34" width="8" height="34" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="1.6" />
      <circle cx="50" cy="34" r="9" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="1.8" />
      <path d="M 50 38 Q 44 50 42 64" fill="none" stroke={PALETTE.water} strokeWidth="2.4" strokeLinecap="round" />
      <path d="M 50 38 Q 56 50 58 64" fill="none" stroke={PALETTE.water} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
}
function Piazza() {
  return (
    <g>
      <rect x="14" y="32" width="72" height="52" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="2" />
      <line x1="14" y1="50" x2="86" y2="50" stroke={PALETTE.ink} strokeWidth="1" opacity="0.4" />
      <line x1="14" y1="68" x2="86" y2="68" stroke={PALETTE.ink} strokeWidth="1" opacity="0.4" />
      <line x1="38" y1="32" x2="38" y2="84" stroke={PALETTE.ink} strokeWidth="1" opacity="0.4" />
      <line x1="62" y1="32" x2="62" y2="84" stroke={PALETTE.ink} strokeWidth="1" opacity="0.4" />
      <circle cx="50" cy="58" r="6" fill={PALETTE.leaf} stroke={PALETTE.ink} strokeWidth="1.5" />
    </g>
  );
}
function Chiesa() {
  return (
    <g>
      <rect x="24" y="48" width="52" height="38" fill={PALETTE.wallA} stroke={PALETTE.ink} strokeWidth="2.2" />
      <polygon points="20,50 50,26 80,50" fill={PALETTE.roofB} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <path d="M 46 18 L 46 30 L 42 30 L 42 34 L 58 34 L 58 30 L 54 30 L 54 18 Z"
            fill={PALETTE.ink} />
      <rect x="44" y="60" width="12" height="26" fill={PALETTE.door} stroke={PALETTE.ink} strokeWidth="1.6" />
      <circle cx="34" cy="62" r="4" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.4" />
      <circle cx="66" cy="62" r="4" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.4" />
    </g>
  );
}
function Campanile() {
  return (
    <g>
      <rect x="38" y="30" width="24" height="56" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="2.2" />
      <polygon points="34,32 50,14 66,32" fill={PALETTE.roofA} stroke={PALETTE.ink} strokeWidth="2.2" strokeLinejoin="round" />
      <rect x="42" y="40" width="16" height="14" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.4" />
      <circle cx="50" cy="47" r="3" fill={PALETTE.ink} />
      <rect x="44" y="66" width="12" height="20" fill={PALETTE.door} stroke={PALETTE.ink} strokeWidth="1.6" />
    </g>
  );
}
function Albero() {
  return (
    <g>
      <rect x="46" y="58" width="8" height="28" fill={PALETTE.trunk} stroke={PALETTE.ink} strokeWidth="1.6" />
      <circle cx="50" cy="44" r="22" fill={PALETTE.leaf} stroke={PALETTE.ink} strokeWidth="2" />
      <circle cx="38" cy="36" r="4" fill="#85B585" opacity="0.7" />
      <circle cx="60" cy="38" r="3" fill="#85B585" opacity="0.7" />
    </g>
  );
}
function Pozzo() {
  return (
    <g>
      <rect x="32" y="56" width="36" height="30" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="2.2" />
      <ellipse cx="50" cy="56" rx="18" ry="5" fill={PALETTE.water} stroke={PALETTE.ink} strokeWidth="1.8" />
      <line x1="28" y1="56" x2="28" y2="30" stroke={PALETTE.ink} strokeWidth="2.4" />
      <line x1="72" y1="56" x2="72" y2="30" stroke={PALETTE.ink} strokeWidth="2.4" />
      <polygon points="22,32 78,32 70,22 30,22" fill={PALETTE.roofA} stroke={PALETTE.ink} strokeWidth="2" strokeLinejoin="round" />
      <line x1="50" y1="32" x2="50" y2="52" stroke={PALETTE.ink} strokeWidth="1.2" />
      <rect x="44" y="48" width="12" height="6" fill={PALETTE.trunk} stroke={PALETTE.ink} strokeWidth="1.2" />
    </g>
  );
}
function Torre() {
  return (
    <g>
      <rect x="40" y="22" width="20" height="64" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="2.2" />
      <rect x="36" y="20" width="28" height="8" fill={PALETTE.roofB} stroke={PALETTE.ink} strokeWidth="2" />
      <rect x="36" y="14" width="6" height="8" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="1.6" />
      <rect x="46" y="14" width="6" height="8" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="1.6" />
      <rect x="56" y="14" width="6" height="8" fill={PALETTE.wallB} stroke={PALETTE.ink} strokeWidth="1.6" />
      <rect x="46" y="40" width="8" height="10" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.2" />
      <rect x="46" y="58" width="8" height="10" fill={PALETTE.sky} stroke={PALETTE.ink} strokeWidth="1.2" />
    </g>
  );
}
function Loggia() {
  // La loggia del postino (punto di partenza)
  return (
    <g>
      <rect x="18" y="52" width="64" height="34" fill={PALETTE.wallA} stroke={PALETTE.ink} strokeWidth="2.2" />
      <rect x="14" y="48" width="72" height="8" fill={PALETTE.roofA} stroke={PALETTE.ink} strokeWidth="2.2" />
      <path d="M 24 56 Q 30 48 36 56" fill="none" stroke={PALETTE.ink} strokeWidth="1.6" />
      <path d="M 42 56 Q 48 48 54 56" fill="none" stroke={PALETTE.ink} strokeWidth="1.6" />
      <path d="M 60 56 Q 66 48 72 56" fill="none" stroke={PALETTE.ink} strokeWidth="1.6" />
      {/* insegna postale */}
      <rect x="38" y="62" width="24" height="14" fill={PALETTE.stamp} stroke={PALETTE.ink} strokeWidth="1.6" />
      <text x="50" y="72" textAnchor="middle" fontFamily="Georgia, serif" fontWeight="700"
            fontSize="9" fill="#FBF5E5">POSTE</text>
    </g>
  );
}

// ── Sprite del postino (animato) ────────────────────────────────────────────

interface PostinoProps { size?: number; flip?: boolean; }

export const PostinoSprite = memo(function PostinoSprite({ size = 36, flip = false }: PostinoProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 60 60"
         style={{ display: "block", transform: flip ? "scaleX(-1)" : undefined }}>
      {/* corpo (giacca blu) */}
      <rect x="20" y="26" width="20" height="22" rx="3" fill={PALETTE.postino} stroke={PALETTE.ink} strokeWidth="1.5" />
      {/* gambe */}
      <rect x="22" y="46" width="6" height="10" fill={PALETTE.ink} />
      <rect x="32" y="46" width="6" height="10" fill={PALETTE.ink} />
      {/* testa */}
      <circle cx="30" cy="18" r="9" fill="#F1D7A8" stroke={PALETTE.ink} strokeWidth="1.5" />
      {/* berretto da postino */}
      <rect x="20" y="11" width="20" height="6" rx="1" fill={PALETTE.postino} stroke={PALETTE.ink} strokeWidth="1.5" />
      <rect x="18" y="15" width="24" height="3" fill={PALETTE.ink} />
      <rect x="28" y="13" width="4" height="2" fill={PALETTE.destBadge} />
      {/* borsa */}
      <rect x="38" y="30" width="12" height="14" rx="2" fill={PALETTE.stone} stroke={PALETTE.ink} strokeWidth="1.5" />
      <line x1="40" y1="34" x2="48" y2="34" stroke={PALETTE.ink} strokeWidth="1.2" />
      {/* tracolla */}
      <line x1="22" y1="28" x2="44" y2="32" stroke={PALETTE.ink} strokeWidth="1.4" />
    </svg>
  );
});

// ── Pin destinatario (con numero) ───────────────────────────────────────────

export function DestinatarioPin({ idx, consegnato, size = 26 }: {
  idx: number; consegnato: boolean; size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" style={{ display: "block" }}>
      <circle cx="15" cy="15" r="13" fill={consegnato ? PALETTE.ok : PALETTE.stamp}
              stroke={PALETTE.ink} strokeWidth="2" />
      {consegnato ? (
        <path d="M 9 15 L 13 19 L 21 11" fill="none" stroke="#FBF5E5"
              strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <text x="15" y="20" textAnchor="middle" fontFamily="Georgia, serif"
              fontWeight="700" fontSize="14" fill="#FBF5E5">
          {idx}
        </text>
      )}
    </svg>
  );
}
