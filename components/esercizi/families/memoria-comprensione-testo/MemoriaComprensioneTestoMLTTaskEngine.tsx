"use client";

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  MicroProgressioneConfig,
  SessionResult,
  TutorialConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import { BouncingBall } from "@/components/esercizi/shared/distrattore-palla/BouncingBall";
import {
  getMCTMLTLevel,
  getMCTMechanicWarning,
  MCTMLT_MICRO_DELTA,
  MCTMLT_MICRO_MAX_OVER,
} from "./levels";
import {
  generaStimoloMCT,
  creaMCTPoolRef,
  type StimoloMCT,
  type RispostaMCT,
} from "./sequence";
import { MemoriaComprensioneTestoMLTSession } from "./MemoriaComprensioneTestoMLTSession";

// StimoloMCT esteso con delayMs (valoreCorrente della micro-progressione)
interface StimoloMCTMLT extends StimoloMCT {
  delayMs: number;
}

export function MemoriaComprensioneTestoMLTTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  livelloPrec,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {

  const config  = getMCTMLTLevel(livello);
  const rngRef  = useRef<() => number>(Math.random);
  const poolRef = useRef(creaMCTPoolRef(rngRef.current));

  // ── Micro-progressione su delayMs (+15s per bonus, max +30s) ─────────────

  const microProgressione: MicroProgressioneConfig = useMemo(
    () => ({
      valoreBase: config.delayMs,
      delta:      MCTMLT_MICRO_DELTA,
      maxDelta:   MCTMLT_MICRO_MAX_OVER,
    }),
    [config.delayMs],
  );

  // ── generaStimolo ─────────────────────────────────────────────────────────

  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number }): StimoloMCTMLT => {
      const base = generaStimoloMCT(
        config.nFrasi,
        config.nDomande,
        config.nOpzioni,
        "fattuale",
        poolRef.current,
        rngRef.current,
      );
      return { ...base, delayMs: ctx.valoreCorrente };
    },
    [config],
  );

  // ── valutaRisposta (strict: tutte le domande corrette) ────────────────────

  const valutaRisposta = useCallback(
    (stimolo: StimoloMCTMLT, risposta: RispostaMCT | null): boolean => {
      if (!risposta) return false;
      return risposta.risposte.every(
        (r, i) => r === stimolo.domande[i]?.idxCorr,
      );
    },
    [],
  );

  // ── aggiornaMetriche ──────────────────────────────────────────────────────

  const aggiornaMetriche = useCallback(
    (
      precedenti: Record<string, number>,
      stimolo: StimoloMCTMLT,
      risposta: RispostaMCT | null,
      _corretto: boolean,
    ): Record<string, number> => {
      if (!risposta) return precedenti;

      const corrette = risposta.risposte.filter(
        (r, i) => r === stimolo.domande[i]?.idxCorr,
      ).length;

      return {
        ...precedenti,
        domande_totali:   (precedenti.domande_totali   ?? 0) + stimolo.domande.length,
        domande_corrette: (precedenti.domande_corrette ?? 0) + corrette,
        trial_completati: (precedenti.trial_completati ?? 0) + 1,
      };
    },
    [],
  );

  // ── renderStimolo ─────────────────────────────────────────────────────────

  const renderStimolo = useCallback(
    (props: {
      stimolo: StimoloMCTMLT;
      onRisposta: (risposta: RispostaMCT) => void;
    }) => (
      <MemoriaComprensioneTestoMLTSession
        stimolo={props.stimolo}
        onRisposta={props.onRisposta}
        tempoScaduto={tempoScaduto}
        delayComponent={({ onCompleto }) => (
          <BouncingBall
            durataMs={props.stimolo.delayMs}
            onCompleto={onCompleto}
            mostraCountdown
          />
        )}
      />
    ),
    [tempoScaduto],
  );

  // ── onCompleteWrapped — accuratezza per domanda ────────────────────────────

  const onCompleteWrapped = useCallback(
    (risultato: SessionResult) => {
      const m        = risultato.metriche;
      const totali   = m.domande_totali   ?? 0;
      const corrette = m.domande_corrette ?? 0;
      const acc      = totali > 0 ? corrette / totali : 0;

      onComplete({
        ...risultato,
        accuratezzaValutativa: acc,
        scoreGrezzo:           Math.round(acc * 100),
      });
    },
    [onComplete],
  );

  // ── Tutorial ──────────────────────────────────────────────────────────────

  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [{
          titolo: "Leggi, poi ricorda",
          testo:  "Leggi con attenzione il testo che ti viene mostrato. Poi farai una breve attività con la pallina. Dopo ti faremo alcune domande su quello che hai letto — le risposte si trovano nel testo.",
        }],
      }
    : null;

  // ── Warning cambio meccanica (condiviso con MBT) ──────────────────────────

  const warning = useMemo(
    () => getMCTMechanicWarning(livelloPrec, livello),
    [livelloPrec, livello],
  );

  // ── Render (Modello B) ────────────────────────────────────────────────────

  return (
    <TrialFlow<StimoloMCTMLT, RispostaMCT>
      tLimMs={null}
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
      onComplete={onCompleteWrapped}
      onProgress={onProgress}
    />
  );
}
