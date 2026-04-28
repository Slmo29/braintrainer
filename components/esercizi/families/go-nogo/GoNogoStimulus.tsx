"use client";

/**
 * GoNogoStimulus — componente di rendering per un singolo trial Go/No-Go cromatico.
 *
 * Responsabilità: mostrare il cerchio colorato e catturare il tap.
 * Lo stesso componente renderizza sia stimoli go (tappare) sia stimoli nogo (NON tappare).
 * La distinzione la fa l'engine via valutaRisposta sul tipo dello stimolo.
 *
 * INVARIANTE DI RIMONTO: TrialFlow rimonta questo componente ad ogni trial.
 * startRef inizializzato a performance.now() al mount = inizio del trial.
 * Nessun reset esplicito necessario.
 *
 * Il bottone "Tocca" è presente SEMPRE, indipendentemente dal tipo go/nogo.
 * È l'utente che decide se tappare in base al colore del cerchio — questa è la
 * differenza chiave da Stroop, dove i bottoni rappresentano scelte alternative
 * mutuamente esclusive. Qui c'è una sola azione possibile: tappare o non tappare.
 *
 * Forma stimolo: cerchio fisso (lv 1-13). Lv 14-20 (congiunzione) richiederà
 * estensione con prop `forma: "cerchio" | "quadrato" | "triangolo" | "stella"`.
 */

import { useRef, useCallback } from "react";
import { COLORE_CSS_GO_NOGO } from "./levels";
import type { GoNogoStimolo } from "./sequence";

// ── Tipo risposta (esportato — usato da GoNogoTaskEngine) ─────────────────────
// Il tap è l'unica risposta attiva: niente campo tipo/colore.
// Il no-tap (inibizione corretta o omissione) è modellato come null in TrialFlow.

export interface GoNogoRisposta {
  tempoMs: number;
}

// ── Props ─────────────────────────────────────────────────────────────────────

interface GoNogoStimulusProps {
  stimolo:      GoNogoStimolo;
  onRisposta(risposta: GoNogoRisposta): void;
  disabilitato: boolean;
}

// ── Componente ────────────────────────────────────────────────────────────────

export function GoNogoStimulus({
  stimolo,
  onRisposta,
  disabilitato,
}: GoNogoStimulusProps) {

  // startRef inizializzato al mount — corrisponde all'inizio del trial
  // (TrialFlow rimonta il componente ad ogni trial).
  const startRef = useRef(performance.now());

  const onTap = useCallback(() => {
    if (disabilitato) return;
    onRisposta({ tempoMs: performance.now() - startRef.current });
  }, [disabilitato, onRisposta]);

  return (
    <div
      className="flex flex-col items-center gap-12 py-8 px-4 select-none"
      style={{ touchAction: "manipulation" }}
    >
      {/* Cerchio stimolo — 160px, colore determinato dalla coppia go/nogo attiva */}
      <div
        className="w-40 h-40 rounded-full"
        style={{ backgroundColor: COLORE_CSS_GO_NOGO[stimolo.colore] }}
        aria-label={`Stimolo colore ${stimolo.colore}`}
      />

      {/* Bottone tap — unico target, bg neutro per non confondersi col colore stimolo */}
      <button
        onClick={onTap}
        disabled={disabilitato}
        aria-label="Tocca"
        className="w-full max-w-md min-h-[80px] rounded-2xl bg-blue-600 text-white text-xl font-bold active:scale-95 transition-transform duration-75 disabled:opacity-40 disabled:pointer-events-none"
      >
        Tocca
      </button>
    </div>
  );
}
