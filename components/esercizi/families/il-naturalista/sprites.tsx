"use client";

/**
 * Sprite e fondali per "Il Naturalista".
 *
 * Stile: tavole naturalistiche d'epoca (Audubon/Haeckel). Palette
 * ocra/seppia/verde-oliva/blu-prussia su carta invecchiata. Tutto SVG,
 * niente raster.
 *
 * Le scene sono SVG con viewBox 1000×700. Le creature sono <g> che
 * vengono posizionate via transform sul piano scena.
 */

import type { CSSProperties, ReactNode } from "react";

// ── Palette tavole d'epoca ───────────────────────────────────────────────────

export const NAT_COLORS = {
  cartaChiara: "#F2E6CC",
  cartaMedia:  "#E6D4B0",
  cartaScura:  "#C9A96F",
  inchiostro:  "#3B2A18",
  seppia:      "#6B4A24",
  verdeOliva:  "#5C6B3A",
  verdeBosco:  "#3E5128",
  verdeMuschio:"#7A8C4F",
  blu:         "#244B66",
  bluProfondo: "#162F44",
  bluAcqua:    "#5E8AA0",
  ocra:        "#B97A2E",
  ocraChiaro:  "#D9A95C",
  rossoMattone:"#9A4226",
  giallo:      "#D9B14A",
};

// ── Wrapper carta invecchiata ────────────────────────────────────────────────

export function PaperBackground({ children, style }: { children: ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        background:
          "radial-gradient(ellipse at center, #F2E6CC 0%, #E6D4B0 60%, #C9A96F 100%)",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

// ── Icone UI ─────────────────────────────────────────────────────────────────

export function LenteIcon({ size = 18, color = NAT_COLORS.inchiostro }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke={color} strokeWidth="2.2" />
      <line x1="15.2" y1="15.2" x2="20.5" y2="20.5" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="8.5" cy="8.5" r="1.6" fill={color} opacity="0.35" />
    </svg>
  );
}

export function ZoomInIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <line x1="15.2" y1="15.2" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="10.5" y1="7.5" x2="10.5" y2="13.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function ZoomOutIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="10.5" cy="10.5" r="6.5" fill="none" stroke="currentColor" strokeWidth="2.2" />
      <line x1="15.2" y1="15.2" x2="20.5" y2="20.5" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
      <line x1="7.5" y1="10.5" x2="13.5" y2="10.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── Definizioni scene ────────────────────────────────────────────────────────
// Ciascuna scena è un <g> di sfondo. Le creature vengono sovrapposte dopo.

export function PratoScene({ densita }: { densita: number }) {
  const elementi = Math.round(20 + densita * 50);
  return (
    <g>
      <rect width="1000" height="700" fill={NAT_COLORS.cartaChiara} />
      <rect width="1000" height="700" fill="url(#pratoSeed)" opacity="0.55" />
      {/* fasci d'erba sparsi */}
      {Array.from({ length: elementi }).map((_, i) => {
        const x = ((i * 73) % 980) + 10;
        const y = 380 + ((i * 47) % 300);
        const h = 24 + ((i * 13) % 40);
        const lean = ((i * 37) % 18) - 9;
        const c = i % 3 === 0 ? NAT_COLORS.verdeOliva : i % 3 === 1 ? NAT_COLORS.verdeMuschio : NAT_COLORS.verdeBosco;
        return (
          <path
            key={`g${i}`}
            d={`M${x} ${y + h} Q${x + lean} ${y + h / 2} ${x + lean * 1.6} ${y}`}
            stroke={c}
            strokeWidth="1.4"
            fill="none"
            opacity="0.7"
          />
        );
      })}
      {/* macchie d'erba al suolo */}
      {Array.from({ length: Math.round(elementi / 3) }).map((_, i) => {
        const x = ((i * 131) % 1000);
        const y = 420 + ((i * 89) % 260);
        return (
          <ellipse
            key={`gp${i}`}
            cx={x} cy={y} rx={18 + (i % 6) * 3} ry={3.5}
            fill={NAT_COLORS.verdeOliva}
            opacity="0.18"
          />
        );
      })}
      {/* sole alto */}
      <circle cx="120" cy="100" r="55" fill={NAT_COLORS.giallo} opacity="0.25" />
    </g>
  );
}

export function PratoFiorito({ densita }: { densita: number }) {
  const fiori = Math.round(30 + densita * 60);
  return (
    <g>
      <PratoScene densita={densita * 0.8} />
      {Array.from({ length: fiori }).map((_, i) => {
        const x = ((i * 97) % 980) + 10;
        const y = 380 + ((i * 71) % 290);
        const tipo = i % 4;
        return <Fiorellino key={`f${i}`} x={x} y={y} tipo={tipo} />;
      })}
    </g>
  );
}

function Fiorellino({ x, y, tipo }: { x: number; y: number; tipo: number }) {
  const colors: Record<number, string> = {
    0: NAT_COLORS.giallo,
    1: NAT_COLORS.rossoMattone,
    2: "#C9748F",
    3: "#7A6BA3",
  };
  const c = colors[tipo];
  return (
    <g transform={`translate(${x} ${y})`}>
      <line x1="0" y1="0" x2="0" y2="14" stroke={NAT_COLORS.verdeOliva} strokeWidth="1.4" />
      {[0, 72, 144, 216, 288].map(a => (
        <ellipse
          key={a}
          cx="0" cy="-4" rx="3" ry="5.5"
          fill={c}
          transform={`rotate(${a})`}
          opacity="0.85"
        />
      ))}
      <circle r="2.4" cy="-4" fill={NAT_COLORS.ocra} />
    </g>
  );
}

export function BoscoScene({ densita, fitto }: { densita: number; fitto: boolean }) {
  const tronchi = Math.round((fitto ? 9 : 6) + densita * 6);
  const foglie = Math.round((fitto ? 80 : 40) + densita * 120);
  return (
    <g>
      <rect width="1000" height="700" fill={NAT_COLORS.cartaChiara} />
      {/* lontananza */}
      <rect y="0" width="1000" height="280" fill={NAT_COLORS.verdeMuschio} opacity="0.12" />
      <rect y="280" width="1000" height="420" fill={NAT_COLORS.verdeBosco} opacity="0.08" />
      {/* tronchi sullo sfondo */}
      {Array.from({ length: tronchi }).map((_, i) => {
        const x = ((i * 131) % 980) + 8;
        const w = 22 + ((i * 7) % 18);
        return (
          <g key={`t${i}`}>
            <rect x={x} y="120" width={w} height="580" fill={NAT_COLORS.seppia} opacity={fitto ? 0.55 : 0.4} />
            <rect x={x + w * 0.2} y="120" width={w * 0.25} height="580" fill={NAT_COLORS.inchiostro} opacity="0.18" />
            {/* venature */}
            {Array.from({ length: 5 }).map((__, k) => (
              <line key={k} x1={x + 2} y1={150 + k * 110} x2={x + w - 2} y2={155 + k * 110}
                stroke={NAT_COLORS.inchiostro} strokeWidth="0.6" opacity="0.4" />
            ))}
          </g>
        );
      })}
      {/* baldacchino di foglie */}
      {Array.from({ length: foglie }).map((_, i) => {
        const x = ((i * 53) % 1000);
        const y = ((i * 79) % 420);
        const r = 8 + ((i * 11) % 14);
        const c = i % 3 === 0 ? NAT_COLORS.verdeMuschio : i % 3 === 1 ? NAT_COLORS.verdeOliva : NAT_COLORS.verdeBosco;
        return <ellipse key={`l${i}`} cx={x} cy={y} rx={r} ry={r * 0.65} fill={c} opacity={fitto ? 0.55 : 0.45} />;
      })}
      {/* foglie a terra */}
      {Array.from({ length: Math.round(foglie / 2) }).map((_, i) => {
        const x = ((i * 97) % 980) + 10;
        const y = 470 + ((i * 67) % 220);
        const rot = (i * 23) % 360;
        return (
          <ellipse key={`fa${i}`} cx={x} cy={y} rx="9" ry="3"
            fill={i % 2 === 0 ? NAT_COLORS.ocra : NAT_COLORS.seppia}
            opacity="0.55"
            transform={`rotate(${rot} ${x} ${y})`}
          />
        );
      })}
      {/* rami in primo piano */}
      <path d="M-20 200 Q200 250 420 220 T880 240 L1020 235 L1020 252 Q700 270 420 245 Q200 260 -20 220 Z"
        fill={NAT_COLORS.seppia} opacity="0.6" />
      <path d="M-20 480 Q260 520 520 500 T1020 510 L1020 524 Q700 538 520 518 Q260 532 -20 500 Z"
        fill={NAT_COLORS.seppia} opacity="0.5" />
    </g>
  );
}

export function FondaleScene({ densita, fitto }: { densita: number; fitto: boolean }) {
  const alghe = Math.round((fitto ? 18 : 10) + densita * 14);
  const bolle = Math.round(15 + densita * 30);
  const coralli = Math.round((fitto ? 8 : 4) + densita * 6);
  return (
    <g>
      <rect width="1000" height="700" fill={NAT_COLORS.bluAcqua} />
      <rect width="1000" height="700" fill="url(#acquaGrad)" />
      {/* raggi di luce */}
      {[120, 320, 560, 760].map((x, i) => (
        <polygon key={i}
          points={`${x},0 ${x - 60},700 ${x + 60},700 ${x + 30},0`}
          fill={NAT_COLORS.cartaChiara} opacity="0.07" />
      ))}
      {/* sabbia */}
      <path d="M0 540 Q200 510 400 530 T800 520 T1000 535 L1000 700 L0 700 Z"
        fill={NAT_COLORS.ocraChiaro} opacity="0.85" />
      <path d="M0 580 Q250 560 500 575 T1000 570 L1000 700 L0 700 Z"
        fill={NAT_COLORS.ocra} opacity="0.5" />
      {/* coralli */}
      {Array.from({ length: coralli }).map((_, i) => {
        const x = ((i * 137) % 950) + 30;
        const h = 70 + ((i * 19) % 90);
        const c = i % 2 === 0 ? NAT_COLORS.rossoMattone : "#C46B5E";
        return (
          <g key={`co${i}`}>
            <path d={`M${x} 560 Q${x - 12} ${560 - h * 0.6} ${x - 4} ${560 - h} Q${x + 6} ${560 - h * 0.6} ${x + 14} 560`}
              fill={c} opacity="0.8" stroke={NAT_COLORS.inchiostro} strokeWidth="0.5" />
            <circle cx={x - 4} cy={560 - h} r="6" fill={c} opacity="0.7" />
            <circle cx={x + 2} cy={560 - h * 0.7} r="4" fill={c} opacity="0.6" />
          </g>
        );
      })}
      {/* alghe ondulate */}
      {Array.from({ length: alghe }).map((_, i) => {
        const x = ((i * 79) % 980) + 10;
        const h = 100 + ((i * 31) % 220);
        const sway = ((i * 11) % 24) - 12;
        const c = i % 2 === 0 ? NAT_COLORS.verdeOliva : NAT_COLORS.verdeBosco;
        return (
          <path key={`al${i}`}
            d={`M${x} 560 Q${x + sway} ${560 - h * 0.5} ${x - sway} ${560 - h}`}
            stroke={c} strokeWidth={3 + (i % 3)} fill="none" opacity="0.75" strokeLinecap="round"
          />
        );
      })}
      {/* bolle */}
      {Array.from({ length: bolle }).map((_, i) => {
        const x = ((i * 113) % 1000);
        const y = ((i * 53) % 540);
        const r = 3 + ((i * 7) % 8);
        return <circle key={`b${i}`} cx={x} cy={y} r={r} fill={NAT_COLORS.cartaChiara} opacity="0.3" stroke={NAT_COLORS.cartaChiara} strokeOpacity="0.5" />;
      })}
    </g>
  );
}

// ── Definitions: gradiente per fondali ───────────────────────────────────────

export function SceneDefs() {
  return (
    <defs>
      <linearGradient id="acquaGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor={NAT_COLORS.bluProfondo} stopOpacity="0.45" />
        <stop offset="60%" stopColor={NAT_COLORS.blu} stopOpacity="0.12" />
        <stop offset="100%" stopColor={NAT_COLORS.bluAcqua} stopOpacity="0" />
      </linearGradient>
      <pattern id="pratoSeed" patternUnits="userSpaceOnUse" width="40" height="40">
        <circle cx="8" cy="12" r="1.2" fill={NAT_COLORS.verdeOliva} opacity="0.4" />
        <circle cx="28" cy="30" r="1" fill={NAT_COLORS.verdeBosco} opacity="0.45" />
        <circle cx="18" cy="6" r="0.8" fill={NAT_COLORS.verdeMuschio} opacity="0.4" />
      </pattern>
    </defs>
  );
}

// ── Creature: 12 tipi disegnati a mano ───────────────────────────────────────
// Ogni creatura è un <g> centrato su (0, 0), disegnata in un box ~100×100
// con vista frontale o laterale. La camuffabilità è gestita lato Session
// applicando un filtro (saturazione/opacità) all'esterno.

export type CreatureKind =
  | "farfalla" | "scarabeo" | "lumaca" | "uccello" | "scoiattolo" | "bruco"
  | "rana" | "pesce" | "medusa" | "stellaMarina" | "granchio" | "cavalluccio";

interface CreatureProps {
  kind: CreatureKind;
  /** Opacità complessiva (per mimetismo). */
  opacity?: number;
  /** Tinta da miscelare con i colori vivaci (mimetismo). */
  tintColor?: string;
  /** Intensità tinta (0–1). */
  tintMix?: number;
}

function blend(base: string, tint: string | undefined, mix: number): string {
  if (!tint || mix <= 0) return base;
  // miscela hex semplice
  const a = hexToRgb(base);
  const b = hexToRgb(tint);
  const r = Math.round(a.r * (1 - mix) + b.r * mix);
  const g = Math.round(a.g * (1 - mix) + b.g * mix);
  const bl = Math.round(a.b * (1 - mix) + b.b * mix);
  return `rgb(${r},${g},${bl})`;
}

function hexToRgb(h: string): { r: number; g: number; b: number } {
  if (h.startsWith("rgb")) {
    const m = h.match(/rgb\((\d+),(\d+),(\d+)\)/);
    if (m) return { r: +m[1], g: +m[2], b: +m[3] };
  }
  const s = h.replace("#", "");
  const r = parseInt(s.substring(0, 2), 16);
  const g = parseInt(s.substring(2, 4), 16);
  const b = parseInt(s.substring(4, 6), 16);
  return { r, g, b };
}

export function Creature({ kind, opacity = 1, tintColor, tintMix = 0 }: CreatureProps) {
  const tint = (c: string) => blend(c, tintColor, tintMix);
  const ink = NAT_COLORS.inchiostro;

  switch (kind) {
    case "farfalla":
      return (
        <g opacity={opacity}>
          {/* ali superiori */}
          <path d="M0 0 Q-22 -28 -38 -16 Q-46 -2 -32 8 Q-16 6 0 0 Z" fill={tint("#C97A2E")} stroke={ink} strokeWidth="1" />
          <path d="M0 0 Q22 -28 38 -16 Q46 -2 32 8 Q16 6 0 0 Z" fill={tint("#C97A2E")} stroke={ink} strokeWidth="1" />
          {/* ali inferiori */}
          <path d="M0 2 Q-18 18 -28 12 Q-30 4 -16 4 Q-8 4 0 2 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="1" />
          <path d="M0 2 Q18 18 28 12 Q30 4 16 4 Q8 4 0 2 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="1" />
          {/* macchie ocelli */}
          <circle cx="-22" cy="-8" r="3.5" fill={tint("#F2E6CC")} stroke={ink} strokeWidth="0.6" />
          <circle cx="22" cy="-8" r="3.5" fill={tint("#F2E6CC")} stroke={ink} strokeWidth="0.6" />
          <circle cx="-22" cy="-8" r="1.4" fill={ink} />
          <circle cx="22" cy="-8" r="1.4" fill={ink} />
          {/* corpo */}
          <ellipse cx="0" cy="0" rx="2.2" ry="14" fill={ink} />
          {/* antenne */}
          <path d="M-1 -12 Q-6 -22 -4 -28" stroke={ink} strokeWidth="0.8" fill="none" />
          <path d="M1 -12 Q6 -22 4 -28" stroke={ink} strokeWidth="0.8" fill="none" />
          <circle cx="-4" cy="-28" r="0.9" fill={ink} />
          <circle cx="4" cy="-28" r="0.9" fill={ink} />
        </g>
      );
    case "scarabeo":
      return (
        <g opacity={opacity}>
          <ellipse cx="0" cy="0" rx="20" ry="26" fill={tint("#3E5128")} stroke={ink} strokeWidth="1" />
          <path d="M0 -26 L0 26" stroke={ink} strokeWidth="0.8" />
          <ellipse cx="0" cy="-18" rx="9" ry="8" fill={tint("#244B66")} stroke={ink} strokeWidth="0.8" />
          {/* zampe */}
          {[-1, 1].map(s => (
            <g key={s}>
              <line x1={s * 12} y1="-8" x2={s * 24} y2="-14" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
              <line x1={s * 14} y1="0" x2={s * 28} y2="2" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
              <line x1={s * 12} y1="10" x2={s * 24} y2="18" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
            </g>
          ))}
          {/* lucentezza */}
          <ellipse cx="-6" cy="-4" rx="3" ry="6" fill="#FFFFFF" opacity="0.18" />
        </g>
      );
    case "lumaca":
      return (
        <g opacity={opacity}>
          {/* corpo */}
          <path d="M-30 14 Q-30 4 -10 4 Q14 4 22 12 L34 12 L34 18 L-28 18 Z" fill={tint("#D9A95C")} stroke={ink} strokeWidth="1" />
          {/* guscio */}
          <circle cx="-2" cy="-2" r="16" fill={tint("#C97A2E")} stroke={ink} strokeWidth="1" />
          <path d="M-2 -2 m-12 0 a12 12 0 0 1 24 0 a8 8 0 0 1 -16 0 a4 4 0 0 1 8 0" fill="none" stroke={ink} strokeWidth="0.8" />
          {/* antenne */}
          <line x1="-26" y1="6" x2="-32" y2="-6" stroke={ink} strokeWidth="0.8" />
          <line x1="-22" y1="4" x2="-26" y2="-8" stroke={ink} strokeWidth="0.8" />
          <circle cx="-32" cy="-6" r="1.5" fill={ink} />
          <circle cx="-26" cy="-8" r="1.5" fill={ink} />
        </g>
      );
    case "uccello":
      return (
        <g opacity={opacity}>
          <path d="M-20 0 Q-26 -10 -10 -12 Q14 -14 24 -2 Q22 8 8 8 Q-10 10 -20 0 Z" fill={tint("#244B66")} stroke={ink} strokeWidth="1" />
          {/* ala */}
          <path d="M-4 -6 Q-2 -16 14 -10 Q8 -4 -4 -2 Z" fill={tint("#162F44")} stroke={ink} strokeWidth="0.8" />
          {/* testa */}
          <circle cx="-18" cy="-6" r="8" fill={tint("#244B66")} stroke={ink} strokeWidth="0.8" />
          <circle cx="-22" cy="-8" r="1.4" fill={NAT_COLORS.cartaChiara} stroke={ink} strokeWidth="0.4" />
          <circle cx="-22" cy="-8" r="0.7" fill={ink} />
          {/* becco */}
          <path d="M-26 -6 L-32 -4 L-26 -2 Z" fill={tint("#D9B14A")} stroke={ink} strokeWidth="0.6" />
          {/* coda */}
          <path d="M22 0 L34 -6 L32 4 Z" fill={tint("#162F44")} stroke={ink} strokeWidth="0.8" />
          {/* zampe */}
          <line x1="-2" y1="8" x2="-2" y2="16" stroke={ink} strokeWidth="0.9" />
          <line x1="6" y1="8" x2="6" y2="16" stroke={ink} strokeWidth="0.9" />
        </g>
      );
    case "scoiattolo":
      return (
        <g opacity={opacity}>
          {/* coda voluminosa */}
          <path d="M18 8 Q40 0 32 -22 Q22 -28 12 -16 Q14 -6 18 8 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="1" />
          <path d="M18 8 Q34 4 30 -16 Q24 -22 18 -10" fill="none" stroke={ink} strokeWidth="0.6" />
          {/* corpo */}
          <ellipse cx="0" cy="6" rx="14" ry="12" fill={tint("#B97A2E")} stroke={ink} strokeWidth="1" />
          {/* testa */}
          <circle cx="-12" cy="-2" r="8" fill={tint("#B97A2E")} stroke={ink} strokeWidth="1" />
          {/* orecchio */}
          <path d="M-16 -8 L-18 -14 L-12 -10 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="0.6" />
          {/* occhio */}
          <circle cx="-15" cy="-3" r="1.4" fill={ink} />
          {/* zampe */}
          <line x1="-2" y1="16" x2="-4" y2="22" stroke={ink} strokeWidth="1.2" />
          <line x1="6" y1="16" x2="8" y2="22" stroke={ink} strokeWidth="1.2" />
        </g>
      );
    case "bruco":
      return (
        <g opacity={opacity}>
          {[-22, -11, 0, 11, 22].map((cx, i) => (
            <circle key={i} cx={cx} cy="0" r="9" fill={tint(i === 4 ? "#5C6B3A" : "#7A8C4F")} stroke={ink} strokeWidth="0.9" />
          ))}
          <circle cx="-22" cy="-2" r="1.4" fill={ink} />
          <line x1="-22" y1="-9" x2="-26" y2="-14" stroke={ink} strokeWidth="0.8" />
          <line x1="-20" y1="-9" x2="-18" y2="-15" stroke={ink} strokeWidth="0.8" />
        </g>
      );
    case "rana":
      return (
        <g opacity={opacity}>
          {/* corpo */}
          <ellipse cx="0" cy="6" rx="22" ry="14" fill={tint("#5C6B3A")} stroke={ink} strokeWidth="1" />
          <ellipse cx="0" cy="-2" rx="16" ry="10" fill={tint("#7A8C4F")} stroke={ink} strokeWidth="0.8" />
          {/* occhi sporgenti */}
          <circle cx="-10" cy="-10" r="5" fill={tint("#7A8C4F")} stroke={ink} strokeWidth="0.8" />
          <circle cx="10" cy="-10" r="5" fill={tint("#7A8C4F")} stroke={ink} strokeWidth="0.8" />
          <circle cx="-10" cy="-10" r="2.4" fill={NAT_COLORS.giallo} />
          <circle cx="10" cy="-10" r="2.4" fill={NAT_COLORS.giallo} />
          <circle cx="-10" cy="-10" r="1" fill={ink} />
          <circle cx="10" cy="-10" r="1" fill={ink} />
          {/* zampe */}
          <path d="M-22 12 Q-32 18 -26 24 L-18 22" fill={tint("#5C6B3A")} stroke={ink} strokeWidth="0.8" />
          <path d="M22 12 Q32 18 26 24 L18 22" fill={tint("#5C6B3A")} stroke={ink} strokeWidth="0.8" />
        </g>
      );
    case "pesce":
      return (
        <g opacity={opacity}>
          <path d="M-22 0 Q-12 -14 14 -10 Q26 -2 26 4 Q26 10 14 14 Q-12 18 -22 4 Z" fill={tint("#D9A95C")} stroke={ink} strokeWidth="1" />
          {/* coda */}
          <path d="M-22 0 L-36 -10 L-32 4 L-36 14 Z" fill={tint("#C97A2E")} stroke={ink} strokeWidth="0.8" />
          {/* pinne */}
          <path d="M-4 -8 L0 -16 L8 -8 Z" fill={tint("#C97A2E")} stroke={ink} strokeWidth="0.6" />
          <path d="M-4 8 L4 14 L8 8 Z" fill={tint("#C97A2E")} stroke={ink} strokeWidth="0.6" />
          {/* occhio */}
          <circle cx="14" cy="-2" r="2.4" fill={NAT_COLORS.cartaChiara} stroke={ink} strokeWidth="0.4" />
          <circle cx="14" cy="-2" r="1.1" fill={ink} />
          {/* scaglie */}
          {[-8, 0, 8].map(x => (
            <path key={x} d={`M${x} -2 Q${x + 4} 2 ${x} 6`} fill="none" stroke={ink} strokeWidth="0.4" opacity="0.6" />
          ))}
        </g>
      );
    case "medusa":
      return (
        <g opacity={opacity}>
          {/* cupola */}
          <path d="M-24 -2 Q-24 -28 0 -28 Q24 -28 24 -2 Q24 4 0 4 Q-24 4 -24 -2 Z" fill={tint("#C9748F")} stroke={ink} strokeWidth="1" opacity="0.85" />
          <path d="M-18 -10 Q-12 -22 -2 -22" fill="none" stroke={ink} strokeWidth="0.6" opacity="0.6" />
          <path d="M18 -10 Q12 -22 2 -22" fill="none" stroke={ink} strokeWidth="0.6" opacity="0.6" />
          {/* tentacoli */}
          {[-18, -10, -2, 6, 14].map((x, i) => (
            <path key={i} d={`M${x} 4 Q${x + 2} 18 ${x - 2} 32`} fill="none" stroke={tint("#C9748F")} strokeWidth="2" opacity="0.7" />
          ))}
          {[-14, -6, 2, 10, 18].map((x, i) => (
            <path key={`b${i}`} d={`M${x} 4 Q${x - 4} 20 ${x + 2} 36`} fill="none" stroke={tint("#9A4226")} strokeWidth="1" opacity="0.5" />
          ))}
        </g>
      );
    case "stellaMarina":
      return (
        <g opacity={opacity}>
          <path
            d="M0 -24 L7 -8 L24 -6 L11 4 L16 22 L0 12 L-16 22 L-11 4 L-24 -6 L-7 -8 Z"
            fill={tint("#C97A2E")} stroke={ink} strokeWidth="1"
          />
          {/* puntini */}
          {[0, 72, 144, 216, 288].map(a => (
            <circle key={a} cx="0" cy="-14" r="1.6" fill={ink} opacity="0.6" transform={`rotate(${a})`} />
          ))}
          <circle r="3" fill={tint("#9A4226")} opacity="0.7" />
        </g>
      );
    case "granchio":
      return (
        <g opacity={opacity}>
          {/* corpo */}
          <ellipse cx="0" cy="0" rx="20" ry="12" fill={tint("#9A4226")} stroke={ink} strokeWidth="1" />
          <path d="M-14 -6 Q0 -14 14 -6" fill="none" stroke={ink} strokeWidth="0.7" />
          {/* occhi */}
          <line x1="-6" y1="-10" x2="-6" y2="-16" stroke={ink} strokeWidth="0.9" />
          <line x1="6" y1="-10" x2="6" y2="-16" stroke={ink} strokeWidth="0.9" />
          <circle cx="-6" cy="-17" r="1.8" fill={ink} />
          <circle cx="6" cy="-17" r="1.8" fill={ink} />
          {/* chele */}
          <path d="M-20 -2 Q-30 -8 -34 0 Q-30 4 -24 4 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="0.8" />
          <path d="M-34 0 Q-38 -4 -36 4 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="0.6" />
          <path d="M20 -2 Q30 -8 34 0 Q30 4 24 4 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="0.8" />
          <path d="M34 0 Q38 -4 36 4 Z" fill={tint("#9A4226")} stroke={ink} strokeWidth="0.6" />
          {/* zampe */}
          {[-1, 1].map(s => [0, 1, 2].map(j => (
            <line key={`l${s}${j}`}
              x1={s * (10 - j * 2)} y1="8"
              x2={s * (22 + j * 2)} y2={14 + j * 3}
              stroke={ink} strokeWidth="1.1" strokeLinecap="round" />
          )))}
        </g>
      );
    case "cavalluccio":
      return (
        <g opacity={opacity}>
          <path d="M-2 -22 Q-12 -20 -10 -10 Q-2 -8 -2 0 Q-2 10 -10 14 Q-6 22 4 22 Q12 18 12 8 Q12 -2 4 -6 Q6 -16 0 -22 Z"
            fill={tint("#D9B14A")} stroke={ink} strokeWidth="1" />
          {/* muso */}
          <path d="M-2 -22 L-8 -22 L-6 -16 Z" fill={tint("#D9B14A")} stroke={ink} strokeWidth="0.6" />
          {/* occhio */}
          <circle cx="-4" cy="-16" r="1.4" fill={ink} />
          {/* aletta dorsale */}
          <path d="M0 -4 Q8 -6 6 4" fill="none" stroke={ink} strokeWidth="0.7" />
          {/* anelli */}
          {[-10, -4, 4, 12].map((y, i) => (
            <path key={i} d={`M-8 ${y} Q0 ${y + 1} 10 ${y - 1}`} fill="none" stroke={ink} strokeWidth="0.5" opacity="0.6" />
          ))}
        </g>
      );
  }
}

// ── Pool creature per habitat ────────────────────────────────────────────────

export const POOL_TERRA: readonly CreatureKind[] = ["farfalla", "scarabeo", "lumaca", "uccello", "scoiattolo", "bruco", "rana"];
export const POOL_ACQUA: readonly CreatureKind[] = ["pesce", "medusa", "stellaMarina", "granchio", "cavalluccio"];

// ── Pulsante zoom ────────────────────────────────────────────────────────────

export function ZoomButton({ children, onClick, disabled, label }: {
  children: ReactNode; onClick(): void; disabled?: boolean; label: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      style={{
        width: 44, height: 44, borderRadius: 22,
        background: disabled ? "#D9C9A8" : NAT_COLORS.cartaChiara,
        color: NAT_COLORS.inchiostro,
        border: `2px solid ${NAT_COLORS.seppia}`,
        boxShadow: "0 2px 6px rgba(60,40,20,0.25)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.55 : 1,
        touchAction: "manipulation",
      }}
    >
      {children}
    </button>
  );
}
