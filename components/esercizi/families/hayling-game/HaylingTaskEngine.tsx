"use client";

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  MicroProgressioneConfig,
  SessionResult,
  TutorialConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import {
  getHaylingLevel,
  HAYLING_MICRO_DELTA,
  HAYLING_MICRO_MAX_OVER,
  HAYLING_RISPOSTA_FLOOR,
} from "./levels";
import {
  creaHaylingPoolRef,
  generaStimoloHayling,
  isRispostaValida,
  type StimoloHayling,
  type RispostaHayling,
  type HaylingVariante,
} from "./sequence";
import { HaylingSession } from "./HaylingSession";

export function HaylingTaskEngine({
  livello,
  esercizioId,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {

  const config       = getHaylingLevel(livello);
  const rngRef       = useRef<() => number>(Math.random);
  const poolRef      = useRef(creaHaylingPoolRef(rngRef.current));
  const trialIdxRef  = useRef(0);

  const isBOnly = esercizioId === "hayling_b_only";

  // ── Micro-progressione su tRispostaMs (negativa) ──────────────────────────

  const microProgressione: MicroProgressioneConfig = useMemo(
    () => ({
      valoreBase: config.tRispostaMs,
      delta:      HAYLING_MICRO_DELTA,
      maxDelta:   HAYLING_MICRO_MAX_OVER,
      limite:     HAYLING_RISPOSTA_FLOOR,
    }),
    [config.tRispostaMs],
  );

  // ── generaStimolo ─────────────────────────────────────────────────────────

  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number }): StimoloHayling => {
      let variante: HaylingVariante;
      if (isBOnly) {
        variante = "B";
      } else {
        // hayling_ab: alterna A/B ogni trial
        variante = trialIdxRef.current % 2 === 0 ? "A" : "B";
      }
      trialIdxRef.current += 1;

      return generaStimoloHayling(
        variante,
        ctx.valoreCorrente,
        poolRef.current,
        rngRef.current,
      );
    },
    [isBOnly],
  );

  // ── valutaRisposta ────────────────────────────────────────────────────────

  const valutaRisposta = useCallback(
    (stimolo: StimoloHayling, risposta: RispostaHayling | null): boolean => {
      if (!risposta) return false;
      return isRispostaValida(risposta.parola, stimolo.blacklist, stimolo.variante);
    },
    [],
  );

  // ── aggiornaMetriche ──────────────────────────────────────────────────────

  const aggiornaMetriche = useCallback(
    (
      precedenti: Record<string, number>,
      stimolo: StimoloHayling,
      risposta: RispostaHayling | null,
      corretto: boolean,
    ): Record<string, number> => {
      const isB = stimolo.variante === "B";
      return {
        ...precedenti,
        trial_totali:   (precedenti.trial_totali   ?? 0) + 1,
        trial_corretti: (precedenti.trial_corretti ?? 0) + (corretto ? 1 : 0),
        ...(isB
          ? {
              b_totali:   (precedenti.b_totali   ?? 0) + 1,
              b_corretti: (precedenti.b_corretti ?? 0) + (corretto ? 1 : 0),
            }
          : {}),
        ...(risposta ? { tempo_totale_ms: (precedenti.tempo_totale_ms ?? 0) + risposta.tempoMs } : {}),
      };
    },
    [],
  );

  // ── renderStimolo ─────────────────────────────────────────────────────────

  const renderStimolo = useCallback(
    (props: {
      stimolo: StimoloHayling;
      onRisposta: (r: RispostaHayling) => void;
    }) => (
      <HaylingSession
        stimolo={props.stimolo}
        onRisposta={props.onRisposta}
        tempoScaduto={tempoScaduto}
      />
    ),
    [tempoScaduto],
  );

  // ── onCompleteWrapped — accuratezza basata sui trial B ────────────────────

  const onCompleteWrapped = useCallback(
    (risultato: SessionResult) => {
      const m        = risultato.metriche;
      const totali   = m.trial_totali   ?? 0;
      const corretti = m.trial_corretti ?? 0;
      const acc      = totali > 0 ? corretti / totali : 0;

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
        pagine: isBOnly
          ? [{
              titolo: "Parola senza senso",
              testo:  "Ti mostreremo frasi incomplete. Devi scrivere una parola che non c'entra assolutamente nulla con la frase. Più la parola è distante, meglio è. Ad esempio, per \"Il cielo è di colore ___\" potresti scrivere \"mattone\" o \"cucchiaio\".",
            }]
          : [
              {
                titolo: "Parte A — Completa la frase",
                testo:  "Prima vedrai alcune frasi incomplete. Completa ognuna con la parola più naturale che ti viene in mente. Vai veloce!",
              },
              {
                titolo: "Parte B — Parola senza senso",
                testo:  "Poi le frasi cambieranno: devi scrivere una parola che non c'entra nulla con la frase. Cerca di resistere alla prima parola che ti viene in mente!",
              },
            ],
      }
    : null;

  // ── Render (Modello A — timer sessione 90s) ───────────────────────────────

  return (
    <TrialFlow<StimoloHayling, RispostaHayling>
      tLimMs={null}
      trialValutativi={null}
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={renderStimolo}
      valutaRisposta={valutaRisposta}
      aggiornaMetriche={aggiornaMetriche}
      tutorial={tutorial}
      warning={null}
      feedbackType="standard"
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onCompleteWrapped}
      onProgress={onProgress}
    />
  );
}
