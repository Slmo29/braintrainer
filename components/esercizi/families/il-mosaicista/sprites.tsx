/**
 * Sprite e componenti visivi per "Il Mosaicista".
 *
 * - AtelierBackground: sfondo pietra mediterranea
 * - MosaicCellRenderer: render di una singola cella (frammento o slot)
 * - MosaicPreview: anteprima mini del mosaico completo
 * - LucidaturaOverlay: animazione "riflesso che passa" su mosaico completato
 */

"use client";

import type { CSSProperties } from "react";
import type { MosaicCell, MosaicDef } from "./mosaics";

// ── Atelier background ────────────────────────────────────────────────────

export function AtelierBackground({ children, style }: { children: React.ReactNode; style?: CSSProperties }) {
  return (
    <div
      style={{
        position: "relative",
        background:
          "radial-gradient(ellipse at top, #F4ECD9 0%, #E6D9B8 55%, #D4C195 100%)",
        boxShadow: "inset 0 0 60px rgba(120, 90, 50, 0.18)",
        ...style,
      }}
    >
      {/* venatura sottile per richiamare la pietra */}
      <div
        aria-hidden
        style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          backgroundImage:
            "repeating-linear-gradient(35deg, rgba(180,150,100,0.04) 0 2px, transparent 2px 14px)",
        }}
      />
      {children}
    </div>
  );
}

// ── Render singola cella ───────────────────────────────────────────────────

export interface MosaicCellRendererProps {
  cell: MosaicCell;
  sizePx: number;
  /** Rotazione applicata (0/90/180/270) — usata sui frammenti del pool. */
  rotation?: 0 | 90 | 180 | 270;
  /** Bordo della tessera (default: ombra leggera). */
  highlight?: "none" | "drag" | "snap-target" | "placed" | "wrong";
}

export function MosaicCellRenderer({
  cell, sizePx, rotation = 0, highlight = "none",
}: MosaicCellRendererProps) {
  const borderColor =
    highlight === "drag"        ? "#2A4D6E"
    : highlight === "snap-target" ? "#3A8E45"
    : highlight === "wrong"     ? "#B23A3A"
    : highlight === "placed"    ? "rgba(0,0,0,0.18)"
    : "rgba(0,0,0,0.22)";
  const borderWidth =
    highlight === "drag" || highlight === "snap-target" || highlight === "wrong" ? 3 : 1;

  // Tutte le celle attuali sono "solid" — la branch diagonal è predisposta
  // per estensioni future ma non utilizzata nei mosaici correnti.
  return (
    <div
      style={{
        width: sizePx,
        height: sizePx,
        background: cell.color,
        border: `${borderWidth}px solid ${borderColor}`,
        borderRadius: 4,
        boxSizing: "border-box",
        boxShadow:
          highlight === "drag"        ? "0 6px 18px rgba(0,0,0,0.35)" :
          highlight === "snap-target" ? "0 0 0 4px rgba(58,142,69,0.22)" :
          "inset 0 -2px 0 rgba(0,0,0,0.10), inset 0 2px 0 rgba(255,255,255,0.15)",
        transform: rotation ? `rotate(${rotation}deg)` : undefined,
        transition: "transform 180ms ease, box-shadow 120ms ease",
        position: "relative",
      }}
    >
      {/* riflesso tessera mosaico */}
      <div
        aria-hidden
        style={{
          position: "absolute", top: 2, left: 2, right: "55%", bottom: "55%",
          background: "linear-gradient(135deg, rgba(255,255,255,0.32), rgba(255,255,255,0))",
          borderRadius: 3,
          pointerEvents: "none",
        }}
      />
    </div>
  );
}

// ── Anteprima mosaico completo ─────────────────────────────────────────────

export function MosaicPreview({ mosaic, sizePx = 110 }: { mosaic: MosaicDef; sizePx?: number }) {
  const cell = Math.floor(sizePx / Math.max(mosaic.cols, mosaic.rows));
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${mosaic.cols}, ${cell}px)`,
        gridTemplateRows: `repeat(${mosaic.rows}, ${cell}px)`,
        gap: 1,
        padding: 4,
        background: "rgba(255,255,255,0.5)",
        border: "1.5px solid #B8A270",
        borderRadius: 6,
      }}
      aria-label={`Anteprima ${mosaic.nome}`}
    >
      {mosaic.cells.map((c) => (
        <div
          key={`${c.col}-${c.row}`}
          style={{
            gridColumn: c.col + 1,
            gridRow: c.row + 1,
            background: c.color,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}

// ── Animazione lucidatura ──────────────────────────────────────────────────

export function LucidaturaOverlay({ width, height }: { width: number; height: number }) {
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        width, height,
        pointerEvents: "none",
        overflow: "hidden",
        borderRadius: 8,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0, bottom: 0, left: "-40%",
          width: "40%",
          background:
            "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.6) 50%, transparent 70%)",
          animation: "mosaicista-lucida 800ms ease-out forwards",
        }}
      />
      <style>{`
        @keyframes mosaicista-lucida {
          0%   { transform: translateX(0); }
          100% { transform: translateX(360%); }
        }
      `}</style>
    </div>
  );
}

// ── Icona pulsante rotazione ───────────────────────────────────────────────

export function RotateIcon({ size = 22, color = "#1F2A1A" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3"
        stroke={color}
        strokeWidth={2.2}
        strokeLinecap="round"
        fill="none"
      />
      <path d="M18 3v4h-4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M6 21v-4h4" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}
