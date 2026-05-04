"use client";

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  MicroProgressioneConfig,
  TutorialConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import {
  getPTLevel,
  getPTMechanicWarning,
  PT_TARGET_FLOOR_MS,
  PT_MICRO_DELTA,
  PT_MICRO_MAX_OVER,
} from "./levels";
import {
  generaStimoloPathTracing,
  type StimoloPathTracing,
  type RispostaPathTracing,
} from "./sequence";
import { PathTracingSession } from "./PathTracingSession";

export function PathTracingTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  livelloPrec,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {

  const config = getPTLevel(livello);
  const rngRef = useRef<() => number>(Math.random);

  // ── Micro-progressione su targetTimeMs (negativa) ─────────────────────────

  const microProgressione: MicroProgressioneConfig = useMemo(
    () => ({
      valoreBase: config.targetTimeMs,
      delta:      PT_MICRO_DELTA,
      maxDelta:   PT_MICRO_MAX_OVER,
      limite:     PT_TARGET_FLOOR_MS,
    }),
    [config.targetTimeMs],
  );

  // ── generaStimolo ─────────────────────────────────────────────────────────

  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number }): StimoloPathTracing => {
      return generaStimoloPathTracing(
        config.gridSize,
        ctx.valoreCorrente,
        rngRef.current,
      );
    },
    [config.gridSize],
  );

  // ── valutaRisposta ────────────────────────────────────────────────────────

  const valutaRisposta = useCallback(
    (stimolo: StimoloPathTracing, risposta: RispostaPathTracing | null): boolean => {
      if (!risposta) return false;
      return risposta.tempoMs <= stimolo.targetTimeMs;
    },
    [],
  );

  // ── aggiornaMetriche ──────────────────────────────────────────────────────

  const aggiornaMetriche = useCallback(
    (
      precedenti: Record<string, number>,
      _stimolo: StimoloPathTracing,
      risposta: RispostaPathTracing | null,
      _corretto: boolean,
    ): Record<string, number> => {
      return {
        ...precedenti,
        trial_completati: (precedenti.trial_completati ?? 0) + 1,
        ...(risposta
          ? {
              tempo_totale_ms: (precedenti.tempo_totale_ms ?? 0) + risposta.tempoMs,
              reset_totali:    (precedenti.reset_totali    ?? 0) + risposta.resetCount,
            }
          : {}),
      };
    },
    [],
  );

  // ── renderStimolo ─────────────────────────────────────────────────────────

  const renderStimolo = useCallback(
    (props: {
      stimolo: StimoloPathTracing;
      onRisposta: (r: RispostaPathTracing) => void;
    }) => (
      <PathTracingSession
        stimolo={props.stimolo}
        onRisposta={props.onRisposta}
        tempoScaduto={tempoScaduto}
      />
    ),
    [tempoScaduto],
  );

  // ── Tutorial ──────────────────────────────────────────────────────────────

  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [{
          titolo: "Traccia il percorso",
          testo:  "Tieni premuto il dito sul cerchio verde e trascina fino al cerchio rosso seguendo il corridoio. Se tocchi un muro, il percorso si azzera e devi ricominciare dal verde.",
        }],
      }
    : null;

  // ── Warning cambio meccanica ──────────────────────────────────────────────

  const warning = useMemo(
    () => getPTMechanicWarning(livelloPrec, livello),
    [livelloPrec, livello],
  );

  // ── Render (Modello B con T.Lim per trial) ────────────────────────────────

  return (
    <TrialFlow<StimoloPathTracing, RispostaPathTracing>
      tLimMs={config.tLimMs}
      trialValutativi={config.trialsPerSession}
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={renderStimolo}
      valutaRisposta={valutaRisposta}
      aggiornaMetriche={aggiornaMetriche}
      tutorial={tutorial}
      warning={warning}
      feedbackType="standard"
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete}
      onProgress={onProgress}
    />
  );
}
