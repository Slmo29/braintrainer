"use client";

/**
 * FlankerTaskEngine — game engine per la famiglia Flanker Task.
 *
 * Implementa il contratto GameEngineProps montando TrialFlow<FlankerStimolo, FlankerRisposta>
 * con generazione stimoli programmatica (sequence.ts) e rendering (FlankerStimulus.tsx).
 *
 * Modello A (timer fisso): trialValutativi=null, sessione terminata da tempoScaduto.
 * see docs/gdd/families/flanker-task.md
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
  getFlankerLevel,
  getFlankerMechanicWarning,
  MICRO_PROGRESSIONE_FLANKER,
  type Direzione,
  type FlankerStimolo,
} from "./levels";
import { generaPool } from "./sequence";
import { FlankerStimulus, type FlankerRisposta } from "./FlankerStimulus";

// ── Demo statico per il tutorial ──────────────────────────────────────────────
// Replica minimale della riga frecce senza interattività (no pulsanti, no RT).
// La freccia centrale è evidenziata con fill blu (#2563eb) e cerchio,
// come indicato in docs/gdd/families/flanker-task.md §Tutorial.

const DEMO_POLY_DESTRA   = "5,22 38,22 38,10 56,30 38,50 38,38 5,38";
const DEMO_POLY_SINISTRA = "55,22 22,22 22,10 4,30 22,50 22,38 55,38";
const DEMO_CELL = 60;
const DEMO_STEP = DEMO_CELL + 12; // 72

function FlankerDemo({ congruente }: { congruente: boolean }) {
  const centrale: Direzione = "destra";
  const flankerDir: Direzione = congruente ? "destra" : "sinistra";
  const items: Array<{ dir: Direzione; isCentrale: boolean }> = [
    { dir: flankerDir, isCentrale: false },
    { dir: centrale,   isCentrale: true  },
    { dir: flankerDir, isCentrale: false },
  ];
  const totalWidth = items.length * DEMO_STEP - 12;

  return (
    <svg
      viewBox={`0 0 ${totalWidth} ${DEMO_CELL}`}
      width="100%"
      style={{ maxWidth: totalWidth, display: "block" }}
      aria-hidden="true"
      focusable="false"
    >
      {items.map(({ dir, isCentrale }, i) => (
        <g key={i} transform={`translate(${i * DEMO_STEP}, 0)`}>
          {isCentrale && (
            // r=28: cerchio contenuto nella cella 60×60 (top=2, bottom=58)
            <circle
              cx={30} cy={30} r={28}
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
            />
          )}
          <polygon
            points={dir === "destra" ? DEMO_POLY_DESTRA : DEMO_POLY_SINISTRA}
            fill={isCentrale ? "#2563eb" : "#1e3a5f"}
          />
        </g>
      ))}
    </svg>
  );
}

// ── FlankerTaskEngine ─────────────────────────────────────────────────────────

export function FlankerTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  livelloPrec,
  onReady,
  onComplete,
}: GameEngineProps) {

  // ── Configurazione livello ──────────────────────────────────────────────

  const config = getFlankerLevel(livello);

  const microProgressione: MicroProgressioneConfig = {
    valoreBase: config.tLimMs,
    ...MICRO_PROGRESSIONE_FLANKER,
  };

  // ── Tutorial (prima sessione) ───────────────────────────────────────────
  // Due pagine: congruente (meccanica base) + incongruente (flanker opposti).
  // Max 3 righe di testo per pagina — vincolo docs/gdd/shared/02-trial-flow.md.

  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [
          {
            titolo: "Guarda solo la freccia al centro",
            testo:
              "Tocca il pulsante nella direzione verso cui punta la freccia centrale. " +
              "Le frecce ai lati non contano.",
            demo: <FlankerDemo congruente={true} />,
          },
          {
            titolo: "Ignora le frecce ai lati",
            testo:
              "Le frecce ai lati possono puntare in direzione opposta. " +
              "Guarda sempre e solo quella al centro.",
            demo: <FlankerDemo congruente={false} />,
          },
        ],
      }
    : null;

  // ── Warning cambio meccanica (promozione o regressione di nFlankers) ────

  const warning = getFlankerMechanicWarning(livelloPrec, livello);

  // ── Pool di stimoli ─────────────────────────────────────────────────────

  const poolRef = useRef<FlankerStimolo[]>([]);
  const tailRef = useRef<0 | 1 | 2>(0);

  // ── generaStimolo ───────────────────────────────────────────────────────

  const generaStimolo = useCallback(
    (_ctx: { valoreCorrente: number; isBonus: boolean }): FlankerStimolo => {
      // Il tipo di stimolo (congruente/incongruente) non dipende da valoreCorrente
      // né da isBonus — la variazione per i trial bonus è solo sul T.Lim,
      // gestita internamente da TrialFlow.

      if (poolRef.current.length === 0) {
        // Formula pool_min — docs/gdd/shared/01-session-rules.md
        const poolMin =
          Math.ceil(config.sessionDurationMs / (config.tLimMs + TRIAL_OVERHEAD_MS)) + 3;
        // Arrotonda al multiplo di 20 superiore per il bilanciamento a blocchi
        const poolSize = Math.ceil(poolMin / 20) * 20;
        poolRef.current = generaPool(
          poolSize,
          config.incongruentRatio,
          config.nFlankers,
          tailRef.current,
        );
      }

      const s = poolRef.current.shift()!;

      // Aggiorna tail tracker per il prossimo refill cross-boundary
      tailRef.current = (
        s.congruente ? 0 : Math.min(2, tailRef.current + 1)
      ) as 0 | 1 | 2;

      return s;
    },
    [config],
  );

  // ── valutaRisposta ──────────────────────────────────────────────────────

  const valutaRisposta = useCallback(
    (stimolo: FlankerStimolo, risposta: FlankerRisposta | null): boolean => {
      if (risposta === null) return false; // timeout = errore
      return risposta.direzione === stimolo.centrale;
    },
    [],
  );

  // ── aggiornaMetriche ────────────────────────────────────────────────────
  // 6 contatori: totali e errori per congruenza, RT totali per congruenza.
  // I timeout (risposta=null) contano come errori ma NON nei RT totals.

  const aggiornaMetriche = useCallback(
    (
      prev: Record<string, number>,
      stimolo: FlankerStimolo,
      risposta: FlankerRisposta | null,
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
    <TrialFlow<FlankerStimolo, FlankerRisposta>
      tLimMs={config.tLimMs}
      trialValutativi={null}              // Modello A: timer fisso, termina via tempoScaduto
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={FlankerStimulus}
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
