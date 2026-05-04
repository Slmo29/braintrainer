"use client";

/**
 * UpdatingWMTaskEngine — engine per Updating WM (3 varianti).
 *
 *   updating_wm_parole   → Tab A, variante "parole"
 *   updating_wm_immagini → Tab A, variante "immagini"
 *   updating_wm_numeri   → Tab B, trasformazioni alternanti
 *
 * Modello A (timer 90s). Timing sequenza gestito internamente (tLimMs={null}).
 * Micro-progressione su nStimuli/nDigits: +1 per trial bonus, max +2.
 * feedbackType="standard" — feedback post-risposta da TrialFlow.
 *
 * Riferimento: docs/gdd/families/updating-wm.md
 */

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  TutorialConfig,
  MicroProgressioneConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import {
  getUWMTabALevel,
  getUWMTabBLevel,
  getUWMNumeriWarning,
} from "./levels";
import {
  creaUWMPoolRef,
  generaStimoloPIInner,
  generaStimoloN,
  type StimoloUWM,
  type RispostaUWM,
  type UWMPoolRef,
} from "./sequence";
import { UpdatingWMSession } from "./UpdatingWMSession";

// ── Engine ─────────────────────────────────────────────────────────────────────

export function UpdatingWMTaskEngine({
  esercizioId,
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {
  const isNumeri   = esercizioId === "updating_wm_numeri";
  const variante   = esercizioId === "updating_wm_immagini" ? "immagini" : "parole";

  const rng        = useRef(Math.random);
  const poolRef    = useRef<UWMPoolRef>(creaUWMPoolRef(rng.current));
  const trasfIdxRef = useRef(0);

  // ── Livelli ────────────────────────────────────────────────────────────────
  const levelA = useMemo(() => (!isNumeri ? getUWMTabALevel(livello) : null), [isNumeri, livello]);
  const levelB = useMemo(() => (isNumeri  ? getUWMTabBLevel(livello) : null), [isNumeri, livello]);

  const valoreBase = isNumeri ? (levelB!.nDigits) : (levelA!.nStimuli);
  const trialCount = isNumeri ? (levelB!.trialsPerSession) : (levelA!.trialsPerSession);

  // ── Micro-progressione: nStimuli / nDigits +1 per trial bonus ────────────
  const microProgressione = useMemo((): MicroProgressioneConfig => ({
    valoreBase,
    delta:    1,
    maxDelta: 2,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [valoreBase]);

  // ── generaStimolo ──────────────────────────────────────────────────────────
  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number }): StimoloUWM => {
      if (isNumeri && levelB) {
        const list  = levelB.trasformazioni;
        const trasf = list[trasfIdxRef.current % list.length];
        trasfIdxRef.current++;
        return generaStimoloN(levelB, ctx.valoreCorrente, trasf, rng.current);
      }
      if (levelA) {
        return generaStimoloPIInner(
          levelA,
          ctx.valoreCorrente,
          variante as "parole" | "immagini",
          poolRef.current,
          rng.current,
        );
      }
      // Fallback non raggiungibile
      throw new Error("UWM: livello non disponibile");
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isNumeri, levelA, levelB, variante],
  );

  // ── valutaRisposta ─────────────────────────────────────────────────────────
  const valutaRisposta = useCallback(
    (stimolo: StimoloUWM, risposta: RispostaUWM): boolean =>
      risposta !== null && risposta === stimolo.idxCorr,
    [],
  );

  // ── renderStimolo ──────────────────────────────────────────────────────────
  const renderStimolo = useCallback(
    (props: { stimolo: StimoloUWM; onRisposta: (r: RispostaUWM) => void }) => (
      <UpdatingWMSession stimolo={props.stimolo} onRisposta={props.onRisposta} />
    ),
    [],
  );

  // ── Tutorial ───────────────────────────────────────────────────────────────
  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: isNumeri
          ? [{
              titolo: "Updating WM — Numeri",
              testo:
                "Vedrai una serie di numeri, uno alla volta. " +
                "Poi ti verrà mostrata la regola (es. «Aggiungi 1»). " +
                "Scegli tra le quattro opzioni la sequenza trasformata corretta.",
            }]
          : [{
              titolo: variante === "parole" ? "Updating WM — Parole" : "Updating WM — Immagini",
              testo:
                "Vedrai una serie di oggetti, uno alla volta. " +
                "Memorizza quale ha la proprietà richiesta (es. il più grande). " +
                "Alla fine scegli l'oggetto corretto tra le quattro opzioni.",
            }],
      }
    : null;

  // ── Warning ────────────────────────────────────────────────────────────────
  const warning = useMemo(
    () => (isNumeri ? getUWMNumeriWarning(livelloPrec, livello) : null),
    [isNumeri, livelloPrec, livello],
  );

  return (
    <TrialFlow<StimoloUWM, RispostaUWM>
      tLimMs={null}
      trialValutativi={trialCount}
      microProgressione={microProgressione}
      generaStimolo={generaStimolo}
      renderStimolo={renderStimolo}
      valutaRisposta={valutaRisposta}
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
