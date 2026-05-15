"use client";

import { useMemo } from "react";
import type { MapDef, Landmark, LandmarkType } from "./maps";
import type { State, Dir, PositionOption } from "./route";

// ── Costanti layout ──────────────────────────────────────────────────────────
const CELL = 92;
const PAD = 48;
const STREET_W = 30;
const HALF_STREET = STREET_W / 2;

// Palette accesa — alta saturazione su fondo verde prato
const COLOR = {
  paper: "#fde68a",      // fondo amber-200 (come i badge dei passi)
  paperDark: "#f6cf5e",
  streetFill: "#c4c4c4", // strade in grigio asfalto chiaro
  streetEdge: "#5a5a5a",
  inkLine: "#1f1108",
  // Tinte quartieri — pastelli vividi (medio-saturi, non slavati)
  rosa: "#ff9a82",       // corallo
  ocra: "#ffc566",       // mango
  verde: "#8ed878",      // mint-lime
  azzurro: "#7cc1ed",    // cielo sereno
  // Tetti
  tetto: "#d41a0a",      // rosso tegola vivo
  tettoChiaro: "#f04020",
  // Fogliame
  fogliame: "#2cb52a",
  fogliameChiaro: "#5be53e",
  fogliameScuro: "#1a6e1a",
  tronco: "#5a300a",
  // Acqua
  acqua: "#0a78c8",
  acquaChiara: "#4ec0ea",
  // Pietra
  pietra: "#c8a64a",
  pietraScura: "#7a5a1c",
  // Legno
  legno: "#7a3a08",
  legnoChiaro: "#b25814",
  // Stucco / muri chiari
  muro: "#ffce5a",
  muroChiaro: "#ffe084",
  // Giallo edifici (negozio)
  ocraEdif: "#ff9c0a",
};

interface MapViewProps {
  map: MapDef;
  /** Posizione di partenza (player marker iniziale) */
  start?: State;
  /** Posizione corrente (mostra marker) */
  current?: State;
  /** Mostra anche il punto interrogativo finale al posto del marker */
  hideCurrent?: boolean;
  /** Punti selezionabili come risposta */
  positionOptions?: PositionOption[];
  /** Indice della scelta evidenziata (mouse hover / selected) */
  selectedOptionIndex?: number;
  onOptionClick?: (idx: number) => void;
  /** Mostra esito: l'opzione corretta in verde, eventuale errata cliccata in rosso */
  revealCorrectIndex?: number;
  revealWrongIndex?: number;
  /** Disegna percorso effettuato (per la fase risultato) */
  showPath?: State[];
  /** Override CSS max-height (default 45vh). */
  maxHeight?: string;
}

export function MapView({
  map,
  start,
  current,
  hideCurrent,
  positionOptions,
  selectedOptionIndex,
  onOptionClick,
  revealCorrectIndex,
  revealWrongIndex,
  showPath,
  maxHeight = "45vh",
}: MapViewProps) {
  const W = PAD * 2 + (map.cols - 1) * CELL;
  const H = PAD * 2 + (map.rows - 1) * CELL;

  const ix = (i: number) => PAD + i * CELL;
  const iy = (j: number) => PAD + j * CELL;

  // ID univoci per filtri (in caso di più MapView in pagina)
  const uid = useMemo(
    () => `wc-${Math.random().toString(36).slice(2, 8)}`,
    []
  );

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      xmlns="http://www.w3.org/2000/svg"
      className="block w-full h-auto select-none mx-auto"
      style={{ maxHeight, maxWidth: "min(100%, 560px)" }}
    >
      <defs>
        {/* Filtro principale "acquerello": displacement + soft blur */}
        <filter id={`${uid}-wc`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves="2"
            seed="7"
            result="t"
          />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="4.5" />
          <feGaussianBlur stdDeviation="0.5" />
        </filter>
        {/* Filtro bordo "bagnato": sfocatura + leggera saturazione */}
        <filter id={`${uid}-edge`} x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="1.6" />
        </filter>
        {/* Texture carta di sfondo */}
        <filter id={`${uid}-paper`}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.85"
            numOctaves="3"
            seed="3"
          />
          <feColorMatrix
            values="0 0 0 0 0.55  0 0 0 0 0.42  0 0 0 0 0.22  0 0 0 0.15 0"
          />
          <feComposite in2="SourceGraphic" operator="in" />
        </filter>
        <filter id={`${uid}-grain`}>
          <feTurbulence baseFrequency="2.5" numOctaves="1" seed="9" />
          <feColorMatrix values="0 0 0 0 0.3  0 0 0 0 0.2  0 0 0 0 0.1  0 0 0 0.08 0" />
        </filter>
        {/* Linee inchiostro tremolanti */}
        <filter id={`${uid}-ink`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.04"
            numOctaves="2"
            seed="2"
            result="t2"
          />
          <feDisplacementMap in="SourceGraphic" in2="t2" scale="2" />
        </filter>
      </defs>

      {/* Sfondo carta */}
      <rect x="0" y="0" width={W} height={H} fill={COLOR.paper} />
      <rect
        x="0"
        y="0"
        width={W}
        height={H}
        filter={`url(#${uid}-paper)`}
        opacity="0.85"
      />
      <rect
        x="0"
        y="0"
        width={W}
        height={H}
        filter={`url(#${uid}-grain)`}
        opacity="0.4"
      />

      {/* Quartieri (blocchi colorati) sotto le strade */}
      <g filter={`url(#${uid}-wc)`}>
        {(map.blocchi ?? []).map((b, k) => {
          const x = ix(b.x) + HALF_STREET;
          const y = iy(b.y) + HALF_STREET;
          const w = CELL - STREET_W;
          const h = CELL - STREET_W;
          const fill = COLOR[b.tinta];
          return (
            <rect
              key={k}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={fill}
              opacity="0.9"
              rx="3"
            />
          );
        })}
      </g>

      {/* Strade — orizzontali */}
      <g filter={`url(#${uid}-wc)`}>
        {Array.from({ length: map.rows }).map((_, j) =>
          Array.from({ length: map.cols - 1 }).map((__, i) => (
            <rect
              key={`h-${i}-${j}`}
              x={ix(i)}
              y={iy(j) - HALF_STREET}
              width={CELL}
              height={STREET_W}
              fill={COLOR.streetFill}
              opacity="0.95"
            />
          ))
        )}
        {/* Strade — verticali */}
        {Array.from({ length: map.cols }).map((_, i) =>
          Array.from({ length: map.rows - 1 }).map((__, j) => (
            <rect
              key={`v-${i}-${j}`}
              x={ix(i) - HALF_STREET}
              y={iy(j)}
              width={STREET_W}
              height={CELL}
              fill={COLOR.streetFill}
              opacity="0.95"
            />
          ))
        )}
      </g>

      {/* Bordi strada (inchiostro sepia) */}
      <g
        filter={`url(#${uid}-ink)`}
        stroke={COLOR.streetEdge}
        strokeWidth="1.4"
        fill="none"
        opacity="0.6"
      >
        {Array.from({ length: map.rows }).map((_, j) =>
          Array.from({ length: map.cols - 1 }).map((__, i) => (
            <g key={`he-${i}-${j}`}>
              <line
                x1={ix(i)}
                y1={iy(j) - HALF_STREET}
                x2={ix(i + 1)}
                y2={iy(j) - HALF_STREET}
              />
              <line
                x1={ix(i)}
                y1={iy(j) + HALF_STREET}
                x2={ix(i + 1)}
                y2={iy(j) + HALF_STREET}
              />
            </g>
          ))
        )}
        {Array.from({ length: map.cols }).map((_, i) =>
          Array.from({ length: map.rows - 1 }).map((__, j) => (
            <g key={`ve-${i}-${j}`}>
              <line
                x1={ix(i) - HALF_STREET}
                y1={iy(j)}
                x2={ix(i) - HALF_STREET}
                y2={iy(j + 1)}
              />
              <line
                x1={ix(i) + HALF_STREET}
                y1={iy(j)}
                x2={ix(i) + HALF_STREET}
                y2={iy(j + 1)}
              />
            </g>
          ))
        )}
      </g>

      {/* Edifici decorativi nei blocchi */}
      <g filter={`url(#${uid}-wc)`}>
        {(map.blocchi ?? []).map((b, k) => {
          const cx = ix(b.x) + CELL / 2;
          const cy = iy(b.y) + CELL / 2;
          return <BuildingCluster key={`b-${k}`} cx={cx} cy={cy} seed={k} />;
        })}
      </g>

      {/* Landmark sulle intersezioni */}
      <g filter={`url(#${uid}-wc)`}>
        {map.landmarks.map((lm, k) => (
          <LandmarkIcon key={k} lm={lm} cx={ix(lm.x)} cy={iy(lm.y)} />
        ))}
      </g>

      {/* Percorso percorso (fase risultato) */}
      {showPath && showPath.length > 1 && (
        <g filter={`url(#${uid}-ink)`}>
          <polyline
            points={showPath.map((p) => `${ix(p.x)},${iy(p.y)}`).join(" ")}
            stroke="#b9472f"
            strokeWidth="5"
            strokeOpacity="0.7"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="2 6"
          />
        </g>
      )}

      {/* Marker partenza (cerchio rosso) */}
      {start && (
        <g>
          <circle
            cx={ix(start.x)}
            cy={iy(start.y)}
            r="18"
            fill="#c14a3a"
            stroke="#7a2818"
            strokeWidth="2.5"
            filter={`url(#${uid}-wc)`}
          />
        </g>
      )}

      {/* Opzioni posizione cliccabili */}
      {positionOptions?.map((opt, idx) => {
        const cx = ix(opt.x);
        const cy = iy(opt.y);
        const isSelected = selectedOptionIndex === idx;
        const isCorrectReveal = revealCorrectIndex === idx;
        const isWrongReveal = revealWrongIndex === idx;
        let stroke = "#3a4a6a";
        let fill = "#fff7e0";
        if (isCorrectReveal) {
          stroke = "#2f7d32";
          fill = "#b6e0a0";
        } else if (isWrongReveal) {
          stroke = "#a52e1f";
          fill = "#e8a496";
        } else if (isSelected) {
          stroke = "#1e3a5f";
          fill = "#ffd97a";
        }
        return (
          <g
            key={idx}
            style={{ cursor: onOptionClick ? "pointer" : "default" }}
            onClick={() => onOptionClick?.(idx)}
          >
            {/* Hit area generoso */}
            <circle cx={cx} cy={cy} r="22" fill="transparent" />
            <circle
              cx={cx}
              cy={cy}
              r="16"
              fill={fill}
              stroke={stroke}
              strokeWidth="2.5"
              opacity="0.95"
              filter={`url(#${uid}-wc)`}
            />
            <text
              x={cx}
              y={cy + 6}
              textAnchor="middle"
              fontSize="18"
              fontWeight="700"
              fill={stroke}
              fontFamily="system-ui, sans-serif"
            >
              {String.fromCharCode(65 + idx)}
            </text>
          </g>
        );
      })}

      {/* Marker corrente (player) */}
      {current && !hideCurrent && !positionOptions && (
        <PlayerMarker cx={ix(current.x)} cy={iy(current.y)} dir={current.dir} />
      )}
    </svg>
  );
}

// ── Player marker ────────────────────────────────────────────────────────────

function PlayerMarker({ cx, cy, dir }: { cx: number; cy: number; dir: Dir }) {
  const angle = dir * 90; // 0=N (su), 1=E (dx), ecc.
  return (
    <g transform={`translate(${cx}, ${cy}) rotate(${angle})`}>
      {/* Cerchio base */}
      <circle r="13" fill="#3a5fb0" stroke="#1d2f5a" strokeWidth="2" />
      <circle r="7" fill="#f3e8cd" />
      {/* Freccia direzione: punta verso l'alto (Nord locale) */}
      <path
        d="M 0 -18 L 7 -8 L 0 -12 L -7 -8 Z"
        fill="#c14a3a"
        stroke="#7a2818"
        strokeWidth="1"
      />
    </g>
  );
}

// ── Landmark icons (SVG flat con tocco acquerello tramite filtro padre) ─────

function LandmarkIcon({
  lm,
  cx,
  cy,
}: {
  lm: Landmark;
  cx: number;
  cy: number;
}) {
  return (
    <g transform={`translate(${cx}, ${cy})`}>
      <title>{lm.nome}</title>
      <circle r="20" fill={COLOR.paper} opacity="0.65" />
      <LandmarkShape type={lm.type} />
    </g>
  );
}

function LandmarkShape({ type }: { type: LandmarkType }) {
  switch (type) {
    case "fontana":
      return (
        <g>
          <circle r="14" fill={COLOR.pietra} />
          <circle r="11" fill={COLOR.acqua} opacity="0.9" />
          <circle r="6" fill={COLOR.acquaChiara} />
          <circle r="2" fill={COLOR.acqua} />
          <path
            d="M 0 -6 Q 5 -13 0 -18 Q -5 -13 0 -6"
            fill={COLOR.acquaChiara}
            opacity="0.95"
          />
        </g>
      );
    case "chiesa":
      return (
        <g>
          <rect x="-9" y="-6" width="18" height="14" fill={COLOR.muro} />
          <polygon points="-10,-6 10,-6 0,-15" fill={COLOR.tetto} />
          <rect x="-2" y="-13" width="4" height="7" fill={COLOR.muro} />
          <polygon points="-3,-13 3,-13 0,-19" fill={COLOR.tetto} />
          <rect x="-1.2" y="-9" width="2.4" height="4" fill={COLOR.inkLine} opacity="0.7" />
        </g>
      );
    case "piazza":
      return (
        <g>
          <rect
            x="-15"
            y="-15"
            width="30"
            height="30"
            fill={COLOR.pietra}
            opacity="0.85"
          />
          <circle r="4.5" fill={COLOR.acqua} opacity="0.85" />
          <circle r="2" fill={COLOR.acquaChiara} />
          <circle cx="-11" cy="-2" r="3" fill={COLOR.fogliame} />
          <circle cx="11" cy="-2" r="3" fill={COLOR.fogliameChiaro} />
        </g>
      );
    case "negozio":
      return (
        <g>
          <rect x="-10" y="-4" width="20" height="12" fill={COLOR.ocraEdif} />
          <rect x="-10" y="-9" width="20" height="5" fill={COLOR.tetto} />
          <rect x="-7" y="-2" width="4" height="6" fill={COLOR.legno} />
          <rect x="3" y="-2" width="4" height="4" fill={COLOR.acquaChiara} />
        </g>
      );
    case "albero":
      return (
        <g>
          <circle cy="-4" r="11" fill={COLOR.fogliame} />
          <circle cx="-6" cy="-8" r="6" fill={COLOR.fogliameChiaro} />
          <circle cx="6" cy="-6" r="6" fill={COLOR.fogliameScuro} />
          <rect x="-1.5" y="4" width="3" height="8" fill={COLOR.tronco} />
        </g>
      );
    case "panchina":
      return (
        <g>
          <rect x="-12" y="-2" width="24" height="3" fill={COLOR.legno} />
          <rect x="-12" y="-7" width="24" height="3" fill={COLOR.legnoChiaro} />
          <rect x="-10" y="1" width="3" height="6" fill={COLOR.tronco} />
          <rect x="7" y="1" width="3" height="6" fill={COLOR.tronco} />
        </g>
      );
    case "torre":
      return (
        <g>
          <rect x="-6" y="-18" width="12" height="26" fill={COLOR.pietra} />
          <polygon points="-7,-18 7,-18 0,-26" fill={COLOR.tetto} />
          <rect x="-2" y="-12" width="4" height="4" fill={COLOR.inkLine} />
          <rect x="-2" y="-3" width="4" height="4" fill={COLOR.inkLine} />
          <rect x="-6" y="-5" width="12" height="1" fill={COLOR.pietraScura} opacity="0.7" />
        </g>
      );
    case "ponte":
      return (
        <g>
          <rect x="-18" y="3" width="36" height="6" fill={COLOR.acqua} opacity="0.8" />
          <path
            d="M -16 4 Q 0 -14 16 4"
            stroke={COLOR.legno}
            strokeWidth="5"
            fill="none"
          />
          <path
            d="M -16 4 Q 0 -10 16 4"
            stroke={COLOR.legnoChiaro}
            strokeWidth="2"
            fill="none"
            opacity="0.9"
          />
        </g>
      );
  }
}

// ── Building cluster decorativo ──────────────────────────────────────────────

function BuildingCluster({
  cx,
  cy,
  seed,
}: {
  cx: number;
  cy: number;
  seed: number;
}) {
  // Pseudo-random deterministico per layout costante
  const rand = (n: number) => {
    const x = Math.sin(seed * 9301 + n * 49297) * 233280;
    return x - Math.floor(x);
  };
  const buildings = [
    { dx: -14, dy: -10, w: 14, h: 16, c: COLOR.tetto },
    { dx: 4, dy: -12, w: 12, h: 18, c: COLOR.tettoChiaro },
    { dx: -6, dy: 6, w: 16, h: 10, c: COLOR.tetto },
  ];
  return (
    <g opacity="0.7">
      {buildings.map((b, i) => {
        const jitterX = (rand(i) - 0.5) * 4;
        const jitterY = (rand(i + 1) - 0.5) * 4;
        const x = cx + b.dx + jitterX;
        const y = cy + b.dy + jitterY;
        return (
          <g key={i}>
            <rect x={x} y={y + 4} width={b.w} height={b.h - 4} fill={COLOR.paperDark} />
            <polygon
              points={`${x - 1},${y + 4} ${x + b.w + 1},${y + 4} ${x + b.w / 2},${y - 2}`}
              fill={b.c}
              opacity="0.85"
            />
            {/* Finestrella */}
            <rect
              x={x + b.w / 2 - 1.5}
              y={y + 7}
              width="3"
              height="3"
              fill={COLOR.inkLine}
              opacity="0.5"
            />
          </g>
        );
      })}
    </g>
  );
}
