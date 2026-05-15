/**
 * SVG fiori e vasi per "Il Vivaio".
 *
 * Tutti i fiori hanno un gambo verde + foglia.
 *
 * Componenti:
 *   - FioreSvg(forma, colore, size)
 *   - CartaFioreSvg(stimolo, baseSize)
 *   - VasoSvg(mazzo, size)
 */

import type { JSX } from "react";
import {
  COLORE_PALETTE,
  GAMBO_PALETTE,
  TAGLIA_SCALE,
  type Colore,
  type Forma,
  type Numero,
  type Taglia,
  type Gambo,
  type Sfondo,
} from "./levels";

interface FioreProps {
  forma:  Forma;
  colore: Colore;
  gambo:  Gambo;
  size:   number;
}

export function FioreSvg({ forma, colore, gambo, size }: FioreProps): JSX.Element {
  const palette = COLORE_PALETTE[colore];
  const g       = GAMBO_PALETTE[gambo];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {disegnaFiore(forma, palette.fill, palette.stroke, g.stem, g.leaf)}
    </svg>
  );
}

function disegnaFiore(forma: Forma, fill: string, stroke: string, stemCol: string, leafCol: string): JSX.Element {

  // Gambo + foglia condivisi (margherita e girasole). Per il tulipano
  // sono parte integrante del disegno (con stesso colore stelo/foglia).
  function gamboFoglia(): JSX.Element {
    return (
      <g>
        <path d="M32 50 Q 33 56 31 62" fill="none" stroke={stemCol} strokeWidth={3} strokeLinecap="round" />
        <path d="M31 56 Q 22 52 18 58 Q 26 60 31 58 Z" fill={leafCol} stroke={stemCol} strokeWidth={1.2} strokeLinejoin="round" />
      </g>
    );
  }

  // ── MARGHERITA ──────────────────────────────────────────────────────
  if (forma === "margherita") {
    const petali = [];
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI * 2) / 8;
      const cx = 32 + Math.cos(angle) * 17;
      const cy = 32 + Math.sin(angle) * 17;
      petali.push(
        <ellipse
          key={i}
          cx={cx}
          cy={cy}
          rx={9}
          ry={6}
          transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
          fill={fill}
          stroke={stroke}
          strokeWidth={1.5}
        />,
      );
    }
    return (
      <g>
        {gamboFoglia()}
        {petali}
        <circle cx={32} cy={32} r={8} fill="#F59E0B" stroke="#000000" strokeOpacity={0.3} strokeWidth={1} />
      </g>
    );
  }

  // ── TULIPANO ─────────────────────────────────────────────────────────
  if (forma === "tulipano") {
    return (
      <g>
        {/* Gambo */}
        <path d="M32 38 Q 32 50 28 58" fill="none" stroke={stemCol} strokeWidth={3.5} strokeLinecap="round" />
        {/* Foglia */}
        <path d="M30 48 Q 18 44 14 52 Q 22 54 30 50 Z" fill={leafCol} stroke={stemCol} strokeWidth={1.5} strokeLinejoin="round" />
        {/* Petalo sinistro */}
        <path d="M18 28 Q 16 14 28 12 L 30 38 Q 22 38 18 28 Z" fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        {/* Petalo destro */}
        <path d="M46 28 Q 48 14 36 12 L 34 38 Q 42 38 46 28 Z" fill={fill} stroke={stroke} strokeWidth={1.5} strokeLinejoin="round" />
        {/* Petalo centrale */}
        <path d="M22 16 Q 32 6 42 16 L 38 38 Q 32 40 26 38 Z" fill={fill} stroke={stroke} strokeWidth={1.8} strokeLinejoin="round" />
        {/* Highlight */}
        <path d="M30 18 Q 30 24 28 32" fill="none" stroke="#FFFFFF" strokeWidth={1.5} strokeLinecap="round" opacity={0.4} />
      </g>
    );
  }

  // ── GIRASOLE ────────────────────────────────────────────────────────
  const petali = [];
  for (let i = 0; i < 12; i++) {
    const angle = (i * Math.PI * 2) / 12 - Math.PI / 2;
    const cx = 32 + Math.cos(angle) * 17;
    const cy = 32 + Math.sin(angle) * 17;
    petali.push(
      <ellipse
        key={i}
        cx={cx}
        cy={cy}
        rx={8}
        ry={4.5}
        transform={`rotate(${(angle * 180) / Math.PI} ${cx} ${cy})`}
        fill={fill}
        stroke={stroke}
        strokeWidth={1.3}
      />,
    );
  }
  return (
    <g>
      {gamboFoglia()}
      {petali}
      <circle cx={32} cy={32} r={10} fill="#5C3A14" stroke="#000000" strokeOpacity={0.4} strokeWidth={1.2} />
    </g>
  );
}

// ── Carta fiore (stimolo: N fiori in fila) ──────────────────────────────────

export interface FioreStimolo {
  colore: Colore;
  forma:  Forma;
  numero: Numero;
  taglia: Taglia;
  gambo:  Gambo;
  sfondo: Sfondo;
}

interface CartaFioreProps {
  stimolo:  FioreStimolo;
  baseSize: number;
}

export function CartaFioreSvg({ stimolo, baseSize }: CartaFioreProps): JSX.Element {
  const { colore, forma, numero, taglia, gambo } = stimolo;
  const scale = TAGLIA_SCALE[taglia];
  const cellPx = Math.round(baseSize * scale);

  const cellVB = 64;
  const gap = 12;
  const padX = 14;
  const totalW = padX * 2 + cellVB * numero + gap * (numero - 1);
  const totalH = 64 + 24;

  const renderCellGap = Math.round(gap * scale);
  const renderW = padX * 2 + cellPx * numero + renderCellGap * (numero - 1);
  const renderH = cellPx + Math.round(24 * scale);

  const startVBx = padX + cellVB / 2;
  const positions: number[] = [];
  for (let i = 0; i < numero; i++) positions.push(startVBx + i * (cellVB + gap));
  const vbCy = totalH / 2;

  return (
    <svg
      width={renderW}
      height={renderH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      {positions.map((cx, i) => (
        <g key={i} transform={`translate(${cx - 32} ${vbCy - 32})`}>
          {disegnaFiore(forma, COLORE_PALETTE[colore].fill, COLORE_PALETTE[colore].stroke, GAMBO_PALETTE[gambo].stem, GAMBO_PALETTE[gambo].leaf)}
        </g>
      ))}
    </svg>
  );
}

// ── Mazzo di riferimento (solo fiori, niente vaso) ──────────────────────────

interface VasoProps {
  mazzo: FioreStimolo;
  size:  number;
}

export function VasoSvg({ mazzo, size }: VasoProps): JSX.Element {
  const { colore, forma, numero, taglia, gambo } = mazzo;
  const scale = TAGLIA_SCALE[taglia];

  // Area quadrata: i fiori riempiono lo spazio disponibile.
  const W = 110;
  const H = 110;

  // Scala fiore in funzione del NUMERO (più fiori = più piccoli per stare in
  // larghezza) e TAGLIA.
  const NUM_TO_BASE: Record<number, number> = { 1: 1.10, 2: 0.78, 3: 0.62 };
  const fioreScala = (NUM_TO_BASE[numero] ?? 0.78) * scale;
  const flowerSize = 64 * fioreScala;

  // Posizione X attorno al centro (W/2 = 55), con offset proporzionali.
  const xOffset: Record<number, readonly number[]> = {
    1: [0],
    2: [-18, +18],
    3: [-22, 0, +22],
  };
  const xs = xOffset[numero] ?? [0];

  // Posizione Y: centra il TESTA DEL FIORE (cy≈29 nel viewBox 64) sul
  // centro del tile, così a qualsiasi taglia il fiore sembra ben centrato
  // (lo stelo si estende sotto, ma la testa resta al centro visivo).
  // Tutti i fiori sulla stessa Y per allineamento orizzontale pulito.
  const cyCenter = H / 2 + 3 * fioreScala;
  const positions: { x: number; y: number }[] = xs.map((dx) => ({
    x: W / 2 + dx,
    y: cyCenter,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid meet"
      style={{
        display: "block",
        width: "100%",
        height: "auto",
        maxWidth: size,
        aspectRatio: `${W} / ${H}`,
      }}
    >
      {positions.map((p, i) => (
        <g key={i} transform={`translate(${p.x - flowerSize / 2} ${p.y - flowerSize / 2}) scale(${fioreScala})`}>
          {disegnaFiore(forma, COLORE_PALETTE[colore].fill, COLORE_PALETTE[colore].stroke, GAMBO_PALETTE[gambo].stem, GAMBO_PALETTE[gambo].leaf)}
        </g>
      ))}
    </svg>
  );
}
