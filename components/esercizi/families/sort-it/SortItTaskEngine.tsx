"use client";

/**
 * SortItTaskEngine — engine top-level per Sort It (percettivo e semantico).
 *
 * Discriminazione via esercizioId:
 *   sort_it_percettivo → tipo "percettivo"
 *   sort_it_semantico  → tipo "semantico"
 *
 * Modello A (timer 90s). feedbackType="none" (gestito internamente in SortItSession).
 * Micro-progressione su ruleSwitchEveryN: delta=-1, maxDelta=2, limite=1.
 * Attivata solo per livello >= 4 (lv 1-3: switchOgniN=null, micro-progressione=null).
 *
 * Accuratezza: corretti / totali.
 *
 * Riferimento: docs/gdd/families/sort-it.md
 */

import { useCallback, useMemo, useRef } from "react";
import type {
  GameEngineProps,
  TutorialConfig,
  MicroProgressioneConfig,
} from "@/lib/exercise-types";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import { getSortItLevel, getSortItMechanicWarning } from "./levels";
import { generaTrialSortIt, type StimoloSortIt, type RispostaSortIt } from "./sequence";
import { SortItSession } from "./SortItSession";

// ── Engine ────────────────────────────────────────────────────────────────────

export function SortItTaskEngine({
  livello,
  esercizioId,
  tempoScaduto,
  mostraTutorial,
  livelloPrec,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {
  const rng           = useRef(Math.random);
  const usedSemantic  = useRef(new Map<string, Set<string>>());

  const tipo: "percettivo" | "semantico" = esercizioId === "sort_it_semantico"
    ? "semantico"
    : "percettivo";

  const level = useMemo(() => getSortItLevel(livello), [livello]);

  // ── Micro-progressione (solo da lv 4+) ────────────────────────────────────
  const microProgressione = useMemo((): MicroProgressioneConfig | null => {
    if (level.switchOgniN === null) return null;
    return {
      valoreBase: level.switchOgniN,
      delta:      -1,
      maxDelta:   2,
      limite:     1,
    };
  }, [level]);

  // ── generaStimolo ──────────────────────────────────────────────────────────
  const generaStimolo = useCallback(
    (ctx: { valoreCorrente: number; isBonus: boolean }): StimoloSortIt => {
      const switchN = level.switchOgniN !== null && ctx.valoreCorrente > 0
        ? ctx.valoreCorrente
        : level.switchOgniN;
      return generaTrialSortIt(level, tipo, switchN, usedSemantic.current, rng.current);
    },
    [level, tipo],
  );

  // ── valutaRisposta ─────────────────────────────────────────────────────────
  const valutaRisposta = useCallback(
    (_stimolo: StimoloSortIt, risposta: RispostaSortIt | null): boolean => {
      if (!risposta || risposta.totali === 0) return false;
      return risposta.corretti / risposta.totali >= 0.67;
    },
    [],
  );

  // ── aggiornaMetriche ───────────────────────────────────────────────────────
  const aggiornaMetriche = useCallback(
    (
      prec: Record<string, number>,
      _stimolo: StimoloSortIt,
      risposta: RispostaSortIt | null,
      _corretto: boolean,
    ): Record<string, number> => {
      if (!risposta) return prec;
      return {
        ...prec,
        carte_corrette: (prec.carte_corrette ?? 0) + risposta.corretti,
        carte_totali:   (prec.carte_totali   ?? 0) + risposta.totali,
      };
    },
    [],
  );

  // ── renderStimolo ──────────────────────────────────────────────────────────
  const renderStimolo = useCallback(
    (props: { stimolo: StimoloSortIt; onRisposta: (r: RispostaSortIt) => void }) => (
      <SortItSession stimolo={props.stimolo} onRisposta={props.onRisposta} />
    ),
    [],
  );

  // ── onComplete: override accuratezza con metrica carta-livello ─────────────
  const onCompleteWrapped = useCallback(
    (risultato: import("@/lib/exercise-types").SessionResult) => {
      const m = risultato.metriche;
      const tot = m.carte_totali   ?? 0;
      const cor = m.carte_corrette ?? 0;
      const acc = tot > 0 ? cor / tot : 0;
      onComplete({ ...risultato, accuratezzaValutativa: acc, scoreGrezzo: Math.round(acc * 100) });
    },
    [onComplete],
  );

  // ── Tutorial ───────────────────────────────────────────────────────────────
  const tutorial: TutorialConfig | null = mostraTutorial
    ? {
        pagine: [{
          titolo: tipo === "percettivo" ? "Sort It — Forme" : "Sort It — Categorie",
          testo:
            tipo === "percettivo"
              ? "Guarda la forma sullo schermo e mettila nel bin giusto toccandolo. " +
                "La regola (colore o forma) è indicata in alto e può cambiare durante il trial."
              : "Guarda la parola sullo schermo e mettila nella categoria giusta toccando il pulsante. " +
                "Le categorie possono cambiare durante il trial.",
        }],
      }
    : null;

  // ── Warning ────────────────────────────────────────────────────────────────
  const warning = useMemo(
    () => getSortItMechanicWarning(livelloPrec, livello),
    [livelloPrec, livello],
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <TrialFlow<StimoloSortIt, RispostaSortIt>
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
