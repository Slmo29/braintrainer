"use client";

/**
 * StroopTaskEngine — game engine per la famiglia Stroop Task.
 *
 * Implementa il contratto GameEngineProps montando TrialFlow<StroopStimolo, StroopRisposta>
 * con generazione stimoli programmatica (sequence.ts) e rendering (StroopStimulus.tsx).
 *
 * Modello A (timer fisso): trialValutativi=null, sessione terminata da tempoScaduto.
 * see docs/gdd/families/stroop.md
 *
 * renderStimolo — nota architetturale:
 * TrialFlow.tsx renderStimolo è React.ComponentType<{stimolo, onRisposta}> (riga 88–91).
 * StroopStimulus richiede anche coloriAttivi e nOptions (dipendenti da config livello).
 * La closure renderStroopStimolo cattura config e inietta questi due prop extra,
 * passando disabilitato={false} poiché TrialFlow non lo fornisce e gestisce
 * visibilità del componente tramite unmount durante feedback/ISI.
 */

import { useRef, useCallback } from "react";
import type {
  GameEngineProps,
  TutorialConfig,
  MicroProgressioneConfig,
} from "@/lib/exercise-types";
import { TRIAL_OVERHEAD_MS } from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import {
  getStroopLevel,
  getStroopMechanicWarning,
  MICRO_PROGRESSIONE_STROOP,
  COLORE_CSS,
  type ColoreStroop,
} from "./levels";
import { generaPool, type StroopStimolo } from "./sequence";
import { StroopStimulus, type StroopRisposta } from "./StroopStimulus";

// ── Demo statico per il tutorial ──────────────────────────────────────────────
// Parametri canonici fissi indipendenti da livelloDaGiocare.
// see docs/gdd/families/stroop.md §Tutorial e decisione utente §Tutorial statico.
// <div> non interattivi — solo illustrativo. Ordine riquadri fisso (no shuffle).
// Dimensioni ridotte per stare nel modal tutorial (w-16 h-12 vs min-h-[80px] runtime).

function StroopDemo({ congruente }: { congruente: boolean }) {
  const parola = "BLU";
  const coloreInchiostro: ColoreStroop = congruente ? "blu" : "rosso";
  const opzioni: ColoreStroop[] = ["rosso", "blu"];
  const corretta = coloreInchiostro;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-5xl font-bold" style={{ color: COLORE_CSS[coloreInchiostro] }}>
        {parola}
      </div>
      <div className="flex gap-3">
        {opzioni.map(c => (
          <div
            key={c}
            className={`w-16 h-12 rounded-xl border-2 ${
              c === corretta ? "border-green-500 ring-2 ring-green-500/30" : "border-transparent"
            }`}
            style={{ backgroundColor: COLORE_CSS[c] }}
            aria-label={c === corretta ? `${c} (corretto)` : c}
          />
        ))}
      </div>
    </div>
  );
}

// ── StroopTaskEngine ──────────────────────────────────────────────────────────

export function StroopTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  livelloPrec,
  onReady,
  onComplete,
}: GameEngineProps) {

  // ── Configurazione livello ──────────────────────────────────────────────

  const config = getStroopLevel(livello);

  const microProgressione: MicroProgressioneConfig = {
    valoreBase: config.tLimMs,
    ...MICRO_PROGRESSIONE_STROOP,
  };

  // ── Tutorial (prima sessione) ───────────────────────────────────────────
  // Due pagine: congruente (meccanica base) + incongruente (interferenza).
  // Max 3 righe di testo per pagina — vincolo docs/gdd/shared/02-trial-flow.md.

  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [
          {
            titolo: "Guarda il colore, non la parola",
            testo: "Tocca il riquadro del colore con cui è scritta la parola.",
            demo: <StroopDemo congruente={true} />,
          },
          {
            titolo: "Ignora cosa dice la parola",
            testo:
              "Anche se leggi BLU, se è scritta in rosso devi toccare il riquadro rosso.",
            demo: <StroopDemo congruente={false} />,
          },
        ],
      }
    : null;

  // ── Warning cambio meccanica ────────────────────────────────────────────

  const warning = getStroopMechanicWarning(livelloPrec, livello);

  // ── Pool di stimoli ─────────────────────────────────────────────────────

  const poolRef = useRef<StroopStimolo[]>([]);
  const tailRef = useRef<0 | 1 | 2>(0);

  // ── generaStimolo ───────────────────────────────────────────────────────

  const generaStimolo = useCallback(
    (_ctx: { valoreCorrente: number; isBonus: boolean }): StroopStimolo => {
      if (poolRef.current.length === 0) {
        const poolMin =
          Math.ceil(config.sessionDurationMs / (config.tLimMs + TRIAL_OVERHEAD_MS)) + 3;
        const poolSize = Math.ceil(poolMin / 20) * 20;
        poolRef.current = generaPool(
          poolSize,
          config.incongruentRatio,
          config.coloriAttivi,
          tailRef.current,
        );
      }

      const s = poolRef.current.shift()!;

      // Aggiorna tail tracker dopo ogni pop. All'esaurimento del pool, riflette
      // la coda di incongruenti degli ultimi trial estratti, valida per il
      // prossimo refill cross-boundary.
      tailRef.current = (
        s.congruente ? 0 : Math.min(2, tailRef.current + 1)
      ) as 0 | 1 | 2;

      return s;
    },
    [config],
  );

  // ── renderStroopStimolo ─────────────────────────────────────────────────
  // Wrapper che inietta coloriAttivi e nOptions (dipendenti da config livello)
  // oltre a stimolo e onRisposta che TrialFlow fornisce direttamente.

  const renderStroopStimolo = useCallback(
    (props: { stimolo: StroopStimolo; onRisposta: (r: StroopRisposta) => void }) => (
      <StroopStimulus
        {...props}
        coloriAttivi={config.coloriAttivi}
        nOptions={config.nOptions}
        disabilitato={false}
      />
    ),
    [config],
  );

  // ── valutaRisposta ──────────────────────────────────────────────────────

  const valutaRisposta = useCallback(
    (stimolo: StroopStimolo, risposta: StroopRisposta | null): boolean => {
      if (risposta === null) return false;
      return risposta.colore === stimolo.coloreInchiostro;
    },
    [],
  );

  // ── aggiornaMetriche ────────────────────────────────────────────────────
  // 6 contatori: totali e errori per congruenza, RT totali per congruenza.
  // I timeout (risposta=null) contano come errori ma NON nei RT totals.

  const aggiornaMetriche = useCallback(
    (
      prev: Record<string, number>,
      stimolo: StroopStimolo,
      risposta: StroopRisposta | null,
      corretto: boolean,
    ): Record<string, number> => {
      const c = stimolo.congruente;
      return {
        ...prev,
        congruenti_totali:
          (prev.congruenti_totali ?? 0) + (c ? 1 : 0),
        incongruenti_totali:
          (prev.incongruenti_totali ?? 0) + (!c ? 1 : 0),
        congruenti_errori:
          (prev.congruenti_errori ?? 0) + (c && !corretto ? 1 : 0),
        incongruenti_errori:
          (prev.incongruenti_errori ?? 0) + (!c && !corretto ? 1 : 0),
        tempo_totale_congruenti_ms:
          (prev.tempo_totale_congruenti_ms ?? 0) +
          (c && risposta !== null ? risposta.tempoMs : 0),
        tempo_totale_incongruenti_ms:
          (prev.tempo_totale_incongruenti_ms ?? 0) +
          (!c && risposta !== null ? risposta.tempoMs : 0),
      };
    },
    [],
  );

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <TrialFlow<StroopStimolo, StroopRisposta>
      tLimMs={config.tLimMs}
      trialValutativi={null}
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={renderStroopStimolo}
      valutaRisposta={valutaRisposta}
      tutorial={tutorial}
      warning={warning}
      aggiornaMetriche={aggiornaMetriche}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete}
    />
  );
}
