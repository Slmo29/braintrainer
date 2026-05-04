"use client";

/**
 * PasatLightTaskEngine — engine per Pasat Light (pasat_light_visivo).
 *
 * Modello A (timer 90s). Timing gestito internamente dalla session (tLimMs={null}).
 * Micro-progressione su seqLen: +1 per trial bonus, max +2 step.
 * Accuratezza: passi_corretti / passi_totali (override onComplete).
 *
 * feedbackType="none" — feedback step-by-step gestito in PasatSession.
 *
 * Riferimento: docs/gdd/families/pasat-light.md
 */

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  TutorialConfig,
  MicroProgressioneConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import { getPLLevel, getPLMechanicWarning } from "./levels";
import { generaSequenzaPL, type StimoloPL, type RispostaPL } from "./sequence";
import { PasatSession } from "./PasatSession";

// ── Engine ─────────────────────────────────────────────────────────────────────

export function PasatLightTaskEngine({
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {
  const level = useMemo(() => getPLLevel(livello), [livello]);
  const rng   = useRef(Math.random);

  // ── Micro-progressione: seqLen +1 per trial bonus ─────────────────────────
  const microProgressione = useMemo((): MicroProgressioneConfig => ({
    valoreBase: level.seqLen,
    delta:      1,
    maxDelta:   2,
  }), [level.seqLen]);

  // ── generaStimolo ──────────────────────────────────────────────────────────
  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number }): StimoloPL =>
      generaSequenzaPL(level, Math.max(level.seqLen, ctx.valoreCorrente), rng.current),
    [level],
  );

  // ── valutaRisposta ─────────────────────────────────────────────────────────
  const valutaRisposta = useCallback(
    (_stimolo: StimoloPL, risposta: RispostaPL): boolean => {
      if (!risposta || risposta.totali === 0) return false;
      return risposta.corretti / risposta.totali >= 0.6;
    },
    [],
  );

  // ── aggiornaMetriche ───────────────────────────────────────────────────────
  const aggiornaMetriche = useCallback(
    (
      prec: Record<string, number>,
      _stimolo: StimoloPL,
      risposta: RispostaPL,
    ): Record<string, number> => {
      if (!risposta) return prec;
      return {
        ...prec,
        passi_corretti: (prec.passi_corretti ?? 0) + risposta.corretti,
        passi_totali:   (prec.passi_totali   ?? 0) + risposta.totali,
      };
    },
    [],
  );

  // ── renderStimolo ──────────────────────────────────────────────────────────
  const renderStimolo = useCallback(
    (props: { stimolo: StimoloPL; onRisposta: (r: RispostaPL) => void }) => (
      <PasatSession stimolo={props.stimolo} onRisposta={props.onRisposta} />
    ),
    [],
  );

  // ── onComplete: accuratezza step-level ─────────────────────────────────────
  const onCompleteWrapped = useCallback(
    (risultato: import("@/lib/exercise-types").SessionResult) => {
      const m   = risultato.metriche;
      const tot = m.passi_totali   ?? 0;
      const cor = m.passi_corretti ?? 0;
      const acc = tot > 0 ? cor / tot : 0;
      onComplete({ ...risultato, accuratezzaValutativa: acc, scoreGrezzo: Math.round(acc * 100) });
    },
    [onComplete],
  );

  // ── Tutorial ───────────────────────────────────────────────────────────────
  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [{
          titolo: "PASAT Light",
          testo:
            "Vedrai dei numeri apparire uno alla volta. " +
            "Memorizza il primo. Per ogni numero successivo, " +
            "calcola [precedente] + [nuovo] e scegli il risultato tra le quattro opzioni. " +
            "Rispondi prima che appaia il numero successivo.",
        }],
      }
    : null;

  // ── Warning ────────────────────────────────────────────────────────────────
  const warning = useMemo(
    () => getPLMechanicWarning(livelloPrec, livello),
    [livelloPrec, livello],
  );

  return (
    <TrialFlow<StimoloPL, RispostaPL>
      tLimMs={null}
      trialValutativi={level.trialsPerSession}
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={renderStimolo}
      valutaRisposta={valutaRisposta}
      aggiornaMetriche={aggiornaMetriche}
      tutorial={tutorial}
      warning={warning}
      feedbackType="none"
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onCompleteWrapped}
      onProgress={onProgress}
    />
  );
}
