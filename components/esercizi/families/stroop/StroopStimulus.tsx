"use client";

/**
 * StroopStimulus — componente di rendering per un singolo trial Stroop Task.
 *
 * Responsabilità: mostrare la parola-colore e catturare la risposta tap
 * (riquadro del colore inchiostro corretto) entro il T.Lim gestito da TrialFlow.
 *
 * INVARIANTE DI RIMONTO: TrialFlow rimonta questo componente ad ogni trial.
 * startRef inizializzato a performance.now() al mount = inizio del trial.
 * coloriOrdinati calcolati una sola volta via lazy init useState() al mount.
 * Nessun reset esplicito necessario.
 */

import { useRef, useState, useCallback } from "react";
import { COLORE_CSS } from "./levels";
import type { ColoreStroop } from "./levels";
import type { StroopStimolo } from "./sequence";

// ── Helper privati ────────────────────────────────────────────────────────────

function pickN<T>(arr: readonly T[], n: number): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy.slice(0, n);
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// ── Tipi ──────────────────────────────────────────────────────────────────────

export interface StroopRisposta {
  colore: ColoreStroop;
  tempoMs: number;
}

interface StroopStimulusProps {
  stimolo: StroopStimolo;
  coloriAttivi: readonly ColoreStroop[];
  nOptions: 2 | 3;
  onRisposta(risposta: StroopRisposta): void;
  disabilitato: boolean;
}

// ── Componente ────────────────────────────────────────────────────────────────

export function StroopStimulus({
  stimolo,
  coloriAttivi,
  nOptions,
  onRisposta,
  disabilitato,
}: StroopStimulusProps) {
  const startRef = useRef(performance.now());

  // ── Lazy init opzioni ──────────────────────────────────────────────────────
  // Eseguito una sola volta al mount. TrialFlow rimonta a ogni trial →
  // 1 calcolo per trial, mai stale. Non useMemo né useEffect([stimolo]).
  const [coloriOrdinati] = useState<ColoreStroop[]>(() => {
    const distrattoriDisponibili = coloriAttivi.filter(c => c !== stimolo.coloreInchiostro);
    const distrattoriScelti = pickN(distrattoriDisponibili, nOptions - 1);
    return shuffle([stimolo.coloreInchiostro, ...distrattoriScelti]);
  });

  // ── Risposta ───────────────────────────────────────────────────────────────

  const risposta = useCallback(
    (colore: ColoreStroop) => {
      if (disabilitato) return;
      onRisposta({ colore, tempoMs: performance.now() - startRef.current });
    },
    [disabilitato, onRisposta],
  );

  const containerBottoni = nOptions === 2 ? "max-w-xs" : "max-w-sm";

  return (
    <div
      className="flex flex-col items-center gap-8 py-6 px-4 select-none"
      style={{ touchAction: "manipulation" }}
    >
      {/* ── Parola stimolo ──────────────────────────────────────────────── */}
      <div
        className="text-6xl font-bold tracking-wide select-none"
        style={{ color: COLORE_CSS[stimolo.coloreInchiostro] }}
        aria-label={`Parola ${stimolo.parola}, scritta in colore ${stimolo.coloreInchiostro}`}
      >
        {stimolo.parola.toUpperCase()}
      </div>

      {/* ── Riquadri risposta ───────────────────────────────────────────── */}
      <div className={`flex gap-4 w-full ${containerBottoni}`}>
        {coloriOrdinati.map((colore) => (
          <button
            key={colore}
            onClick={() => risposta(colore)}
            disabled={disabilitato}
            aria-label={colore}
            className="flex-1 min-h-[80px] rounded-2xl active:scale-95 transition-transform duration-75 disabled:opacity-40 disabled:pointer-events-none border-2 border-transparent active:border-white/30"
            style={{ backgroundColor: COLORE_CSS[colore] }}
          />
        ))}
      </div>
    </div>
  );
}
