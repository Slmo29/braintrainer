"use client";

/**
 * FlankerStimulus — renderer dello stimolo Flanker Task.
 *
 * Responsabilità:
 *   - Renderizza la riga di frecce (flanker + centrale) come SVG inline.
 *   - Raccoglie la risposta tramite due pulsanti grandi ("← Sinistra" / "Destra →").
 *   - Misura il RT con performance.now() dal mount (invariante di rimonto — TrialFlow
 *     rimonta questo componente ad ogni trial; vedi JSDoc renderStimolo in TrialFlow.tsx).
 *   - Supporta ← → da tastiera con focus guard (R2).
 *   - Disabilita i pulsanti dopo il primo click (anti-double-click).
 */

import { useState, useRef, useEffect, useCallback } from "react";
import type { Direzione, FlankerStimolo } from "./levels";

// ── Tipo risposta ─────────────────────────────────────────────────────────────

export interface FlankerRisposta {
  direzione: Direzione;
  /** Tempo dalla comparsa dello stimolo (mount) al click, in ms. performance.now().
   *  NON include il feedback overhead — TrialFlow gestisce il feedback dopo onRisposta. */
  tempoMs: number;
}

// ── Costanti layout SVG ───────────────────────────────────────────────────────

const ARROW_CELL = 60;           // larghezza e altezza di ogni cella freccia (viewBox px)
const ARROW_GAP  = 12;           // gap tra celle adiacenti
const ARROW_STEP = ARROW_CELL + ARROW_GAP; // 72

// Forme "block arrow" riempite — alta leggibilità per utenti 60+.
// Coordinate in cella 60×60: corpo rettangolare (16px alto) + testa triangolare (40px alta).
const POLYGON_DESTRA   = "5,22 38,22 38,10 56,30 38,50 38,38 5,38";
const POLYGON_SINISTRA = "55,22 22,22 22,10 4,30 22,50 22,38 55,38";

const COLORE_FRECCIA = "#1e3a5f"; // navy, contrasto ~12:1 su bianco (WCAG AAA)
const COLORE_BTN     = "#1d4ed8"; // blu, contrasto 7.1:1 su bianco (WCAG AAA large)
const COLORE_BTN_DIS = "#e5e7eb";
const COLORE_TXT_DIS = "#9ca3af";

// ── Sub-componente: singola freccia SVG ───────────────────────────────────────

function FlankerArrow({ direzione }: { direzione: Direzione }) {
  return (
    <polygon
      points={direzione === "destra" ? POLYGON_DESTRA : POLYGON_SINISTRA}
      fill={COLORE_FRECCIA}
    />
  );
}

// ── Componente principale ─────────────────────────────────────────────────────

interface FlankerStimulusProps {
  stimolo: FlankerStimolo;
  onRisposta: (r: FlankerRisposta) => void;
}

export function FlankerStimulus({ stimolo, onRisposta }: FlankerStimulusProps) {
  // RT: inizializzato al mount — ogni trial rimonta questo componente (invariante TrialFlow)
  const startTime = useRef(performance.now());

  const [risposto, setRisposto] = useState(false);

  // ── Costruisce l'array completo: [flanker_sx...] [centrale] [flanker_dx...] ──

  const nLato = stimolo.flankers.length / 2;
  const arrows: Direzione[] = [
    ...stimolo.flankers.slice(0, nLato),
    stimolo.centrale,
    ...stimolo.flankers.slice(nLato),
  ];
  const nTotale    = arrows.length;
  const totalWidth = nTotale * ARROW_STEP - ARROW_GAP;

  // ── Callback risposta ─────────────────────────────────────────────────────

  const rispondi = useCallback(
    (direzione: Direzione) => {
      if (risposto) return;
      setRisposto(true);
      onRisposta({ direzione, tempoMs: performance.now() - startTime.current });
    },
    [risposto, onRisposta],
  );

  // Ref stabile per il listener da tastiera — evita re-registrazioni inutili.
  const rispondiRef = useRef(rispondi);
  rispondiRef.current = rispondi;

  // ── Tastiera ← → con focus guard ─────────────────────────────────────────

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
      // Salta se il focus è su un campo di testo — evita risposte involontarie
      const active = document.activeElement;
      if (
        active instanceof HTMLInputElement ||
        active instanceof HTMLTextAreaElement ||
        (active instanceof HTMLElement && active.isContentEditable)
      ) return;
      rispondiRef.current(e.key === "ArrowLeft" ? "sinistra" : "destra");
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []); // registrato una volta al mount, rimosso all'unmount

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 40,
        padding: "40px 16px",
        background: "#ffffff",
        borderRadius: 20,
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
      }}
    >
      {/* ── Riga frecce ────────────────────────────────────────────────────── */}
      {/*
        TODO: verificare leggibilità su 375px reale durante smoke test.
        nFlankers=6 → totalWidth=492 → celle ≈46px su viewport 375px — limite 60+.
        Se problematico, valutare scroll orizzontale o ridimensionamento per nFlankers=6.
      */}
      <svg
        viewBox={`0 0 ${totalWidth} ${ARROW_CELL}`}
        width="100%"
        style={{ maxWidth: totalWidth, display: "block" }}
        aria-hidden="true"
        focusable="false"
      >
        {arrows.map((direzione, i) => (
          <g key={i} transform={`translate(${i * ARROW_STEP}, 0)`}>
            <FlankerArrow direzione={direzione} />
          </g>
        ))}
      </svg>

      {/* ── Pulsanti risposta ──────────────────────────────────────────────── */}
      {/* min-height 64px > 48px HIG — margine per utenti con tremore */}
      <div style={{ display: "flex", gap: 16, width: "100%", maxWidth: 400 }}>
        {(["sinistra", "destra"] as const).map((dir) => (
          <button
            key={dir}
            onClick={() => rispondi(dir)}
            disabled={risposto}
            aria-label={dir === "sinistra" ? "Sinistra" : "Destra"}
            className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d4ed8] focus-visible:outline-offset-[3px]"
            style={{
              flex: 1,
              minHeight: 64,
              fontSize: 18,
              fontWeight: 700,
              borderRadius: 16,
              border: "none",
              cursor: risposto ? "not-allowed" : "pointer",
              background: risposto ? COLORE_BTN_DIS : COLORE_BTN,
              color: risposto ? COLORE_TXT_DIS : "#ffffff",
              transition: "background 0.1s",
            }}
          >
            {dir === "sinistra" ? "← Sinistra" : "Destra →"}
          </button>
        ))}
      </div>
    </div>
  );
}
