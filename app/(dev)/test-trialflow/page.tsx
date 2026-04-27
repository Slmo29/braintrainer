"use client";

/**
 * Pagina di test manuale per il TrialFlow.
 * URL: /test-trialflow (oppure /test-trialflow?warning=1 per testare il path warning)
 *
 * Esercizio finto: riconosci se un numero è Pari o Dispari.
 * - Evaluativi: numeri casuali 1–9
 * - Bonus:      valoreCorrente esatto (10 o 11)
 * - 5 trial valutativi (Modello B), T.Lim 3s, micro-progressione +1
 */

import { Suspense, useState, useRef, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { TrialFlow } from "@/components/esercizi/shared/TrialFlow";
import type {
  TrialFlowDebugSnapshot,
  Phase,
} from "@/components/esercizi/shared/TrialFlow";
import type {
  MicroProgressioneConfig,
  SessionResult,
  TutorialConfig,
} from "@/lib/exercise-types";

// ── Tipi esercizio finto ──────────────────────────────────────────────────────

type TestStimolo  = { numero: number };
type TestRisposta = { parita: "pari" | "dispari"; tempoMs: number };

// ── Costanti ──────────────────────────────────────────────────────────────────

const MICRO_PROGRESSIONE: MicroProgressioneConfig = {
  valoreBase: 9, delta: 1, maxDelta: 2, limite: 11,
};
const TRIAL_VALUTATIVI  = 5;
const T_LIM_MS          = 3000;
const SESSIONE_DURATA_S = 90;

const TUTORIAL: TutorialConfig = {
  pagine: [{
    testo: 'Tocca "Pari" se il numero sullo schermo è pari, "Dispari" se è dispari. Hai 3 secondi per rispondere.',
    demo: (
      <div style={{ textAlign: "center", padding: "8px 0" }}>
        <p style={{ fontSize: 56, fontWeight: 900, margin: 0, color: "#1e3a5f" }}>4</p>
        <p style={{ margin: "8px 0 0", color: "#16a34a", fontWeight: 600 }}>→ Pari ✓</p>
      </div>
    ),
  }],
};

const TEST_CASES: string[] = [
  "Tutorial parte alla mount, click «Ho capito» lo chiude",
  "Warning appare con ?warning=1, click «Ho capito» prosegue",
  "Trial valutativi: feedback verde/rosso 300ms + ISI 500ms visibili",
  "Dopo 3 corretti consecutivi il quarto è BONUS (numero 10 o 11)",
  "Bonus errato → bonusStep torna a 0 nel pannello",
  "Errore valutativo azzera consecutiviCorretti ma NON bonusStep",
  "Forza tempoScaduto durante trial → completa trial, poi session-end",
  "Forza tempoScaduto durante feedback/ISI → session-end dopo ISI corrente",
  "5 trial valutativi completati → SessionResult con accuratezzaValutativa = corretti/5",
];

// ── Entry point con Suspense (richiesto da useSearchParams in App Router) ─────

export default function TestTrialFlowPage() {
  return (
    <Suspense fallback={<div style={{ padding: 24 }}>Caricamento…</div>}>
      <TestTrialFlowInner />
    </Suspense>
  );
}

// ── Componente interno ────────────────────────────────────────────────────────

function TestTrialFlowInner() {
  const searchParams  = useSearchParams();
  const hasWarning    = searchParams.get("warning") === "1";

  const [tempoScaduto,   setTempoScaduto]   = useState(false);
  const [sessionResult,  setSessionResult]  = useState<SessionResult | null>(null);
  const [debugSnapshot,  setDebugSnapshot]  = useState<TrialFlowDebugSnapshot | null>(null);
  const [secondiRimasti, setSecondiRimasti] = useState(SESSIONE_DURATA_S);
  const [timerAvviato,   setTimerAvviato]   = useState(false);
  const [testCompletati, setTestCompletati] = useState<Set<number>>(new Set());

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Cleanup timer all'unmount
  useEffect(() => () => { if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  // ── Callbacks TrialFlow ───────────────────────────────────────────────────

  const handleReady = useCallback(() => {
    setTimerAvviato(true);
    intervalRef.current = setInterval(() => {
      setSecondiRimasti((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current!);
          intervalRef.current = null;
          setTempoScaduto(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  const handleComplete = useCallback((result: SessionResult) => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSessionResult(result);
  }, []);

  const forzaTempoScaduto = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setSecondiRimasti(0);
    setTempoScaduto(true);
  }, []);

  // ── Logica esercizio finto ────────────────────────────────────────────────

  const generaStimolo = useCallback(({
    valoreCorrente, isBonus,
  }: { valoreCorrente: number; isBonus: boolean }): TestStimolo => {
    // Trial bonus: numero esatto da valoreCorrente (10 o 11)
    // Trial valutativo: casuale 1–9 (ignora valoreCorrente=9=base)
    return { numero: isBonus ? valoreCorrente : Math.floor(Math.random() * 9) + 1 };
  }, []);

  const valutaRisposta = useCallback((
    stimolo: TestStimolo,
    risposta: TestRisposta | null,
  ): boolean => {
    if (!risposta) return false; // timeout
    const isPari = stimolo.numero % 2 === 0;
    return risposta.parita === (isPari ? "pari" : "dispari");
  }, []);

  const aggiornaMetriche = useCallback((
    prev: Record<string, number>,
    _stimolo: TestStimolo,
    risposta: TestRisposta | null,
    _corretto: boolean,
  ): Record<string, number> => {
    if (!risposta) return prev; // timeout: nessun dato timing
    const tot = (prev.risposta_totale_ms ?? 0) + risposta.tempoMs;
    const cnt = (prev.risposta_count ?? 0) + 1;
    return {
      ...prev,
      risposta_totale_ms: tot,
      risposta_count: cnt,
      risposta_avg_ms: Math.round(tot / cnt),
    };
  }, []);

  const handleStateChange = useCallback((snap: TrialFlowDebugSnapshot) => {
    setDebugSnapshot(snap);
  }, []);

  // ── Warning condizionale ──────────────────────────────────────────────────

  const warning = hasWarning
    ? { titolo: "Avviso meccanica", testo: "Questo è un warning di prova attivato con ?warning=1." }
    : null;

  // ── Toggle checklist ──────────────────────────────────────────────────────

  const toggleTest = useCallback((n: number) => {
    setTestCompletati((prev) => {
      const next = new Set(prev);
      if (next.has(n)) next.delete(n); else next.add(n);
      return next;
    });
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", fontFamily: "monospace" }}>

      {/* ── Debug panel ─────────────────────────────────────────────────── */}
      <DebugPanel
        snapshot={debugSnapshot}
        secondiRimasti={secondiRimasti}
        timerAvviato={timerAvviato}
        tempoScaduto={tempoScaduto}
        sessionResult={sessionResult}
        onForzaTempoScaduto={forzaTempoScaduto}
        testCompletati={testCompletati}
        onToggleTest={toggleTest}
        hasWarning={hasWarning}
      />

      {/* ── TrialFlow ────────────────────────────────────────────────────── */}
      {!sessionResult && (
        <div style={{ maxWidth: 420, margin: "0 auto", padding: "24px 16px" }}>
          <TrialFlow<TestStimolo, TestRisposta>
            tLimMs={T_LIM_MS}
            trialValutativi={TRIAL_VALUTATIVI}
            microProgressione={MICRO_PROGRESSIONE}
            generaStimolo={generaStimolo}
            renderStimolo={PariDispariRender}
            valutaRisposta={valutaRisposta}
            tutorial={TUTORIAL}
            warning={warning}
            feedbackType="standard"
            aggiornaMetriche={aggiornaMetriche}
            tempoScaduto={tempoScaduto}
            onReady={handleReady}
            onComplete={handleComplete}
            onStateChange={handleStateChange}
          />
        </div>
      )}
    </div>
  );
}

// ── PariDispariRender ─────────────────────────────────────────────────────────

function PariDispariRender({
  stimolo,
  onRisposta,
}: {
  stimolo: TestStimolo;
  onRisposta(r: TestRisposta): void;
}) {
  const inizioMs = useRef(Date.now());
  // Reinizializza il timer ad ogni mount (ogni nuovo trial)
  useEffect(() => { inizioMs.current = Date.now(); }, []);

  const isBonus = stimolo.numero >= 10;

  function risposta(parita: "pari" | "dispari") {
    onRisposta({ parita, tempoMs: Date.now() - inizioMs.current });
  }

  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      gap: 28, padding: "40px 24px",
      background: "#fff", borderRadius: 20,
      boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    }}>
      {isBonus && (
        <span style={{
          background: "#fbbf24", color: "#92400e",
          padding: "3px 10px", borderRadius: 6,
          fontSize: 12, fontWeight: 700, letterSpacing: 1,
        }}>
          BONUS ★
        </span>
      )}
      <p style={{
        fontSize: 96, fontWeight: 900, margin: 0, lineHeight: 1,
        color: isBonus ? "#b45309" : "#1e3a5f",
      }}>
        {stimolo.numero}
      </p>
      <div style={{ display: "flex", gap: 16 }}>
        {(["pari", "dispari"] as const).map((p) => (
          <button
            key={p}
            onClick={() => risposta(p)}
            style={{
              padding: "16px 32px", fontSize: 18, fontWeight: 700,
              borderRadius: 14, border: "none", cursor: "pointer",
              background: p === "pari" ? "#2563eb" : "#7c3aed",
              color: "#fff", minWidth: 120,
            }}
          >
            {p === "pari" ? "Pari" : "Dispari"}
          </button>
        ))}
      </div>
    </div>
  );
}

// ── DebugPanel ────────────────────────────────────────────────────────────────

function PhaseBadge({ phase }: { phase: Phase | null }) {
  const colors: Record<Phase, string> = {
    tutorial:      "#8b5cf6",
    warning:       "#f59e0b",
    generating:    "#6b7280",
    presenting:    "#2563eb",
    feedback:      "#10b981",
    isi:           "#9ca3af",
    "session-end": "#1f2937",
  };
  if (!phase) return <span style={{ color: "#9ca3af" }}>—</span>;
  return (
    <span style={{
      background: colors[phase], color: "#fff",
      padding: "2px 10px", borderRadius: 999,
      fontWeight: 700, fontSize: 13, letterSpacing: 0.5,
    }}>
      {phase}
    </span>
  );
}

function DebugPanel({
  snapshot,
  secondiRimasti,
  timerAvviato,
  tempoScaduto,
  sessionResult,
  onForzaTempoScaduto,
  testCompletati,
  onToggleTest,
  hasWarning,
}: {
  snapshot: TrialFlowDebugSnapshot | null;
  secondiRimasti: number;
  timerAvviato: boolean;
  tempoScaduto: boolean;
  sessionResult: SessionResult | null;
  onForzaTempoScaduto(): void;
  testCompletati: Set<number>;
  onToggleTest(n: number): void;
  hasWarning: boolean;
}) {
  return (
    <div style={{
      background: "#1e293b", color: "#e2e8f0",
      padding: "20px 24px", fontSize: 13,
    }}>
      <p style={{ margin: "0 0 16px", fontWeight: 700, fontSize: 15, color: "#f1f5f9" }}>
        🛠 TrialFlow Debug Panel
        {hasWarning && (
          <span style={{ marginLeft: 12, fontSize: 11, background: "#f59e0b", color: "#1c1917", padding: "1px 6px", borderRadius: 4 }}>
            ?warning=1
          </span>
        )}
      </p>

      {/* ── Fase + timer + contatori ─────────────────────────────────── */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 24px", marginBottom: 16 }}>
        <Row label="Phase">
          <PhaseBadge phase={snapshot?.phase ?? null} />
        </Row>
        <Row label="Timer sessione">
          {timerAvviato ? (
            <span style={{ color: secondiRimasti <= 10 ? "#f87171" : "#86efac", fontWeight: 700 }}>
              {secondiRimasti}s {tempoScaduto && "⏹ SCADUTO"}
            </span>
          ) : (
            <span style={{ color: "#6b7280" }}>in attesa di onReady()</span>
          )}
        </Row>
        <Row label="trial val. completati">{snapshot?.trialValutativiCompletati ?? 0} / {TRIAL_VALUTATIVI}</Row>
        <Row label="trial bonus eseguiti">{snapshot?.trialBonusTotali ?? 0}</Row>
        <Row label="consecutiviCorretti">{snapshot?.consecutiviCorretti ?? 0} / 3</Row>
        <Row label="bonusStep">{snapshot?.bonusStep ?? 0} / 2</Row>
        <Row label="nextTrialIsBonus">{snapshot?.nextTrialIsBonus ? "✓ sì" : "—"}</Row>
        <Row label="sessioneDaTerminare">{snapshot?.sessioneDaTerminare ? "✓ sì" : "—"}</Row>
      </div>

      {/* ── Forza tempoScaduto ────────────────────────────────────────── */}
      <button
        onClick={onForzaTempoScaduto}
        disabled={!timerAvviato || tempoScaduto || !!sessionResult}
        style={{
          padding: "8px 16px", borderRadius: 8, border: "none",
          background: (!timerAvviato || tempoScaduto || !!sessionResult) ? "#374151" : "#dc2626",
          color: (!timerAvviato || tempoScaduto || !!sessionResult) ? "#6b7280" : "#fff",
          fontWeight: 700, cursor: (!timerAvviato || tempoScaduto || !!sessionResult) ? "not-allowed" : "pointer",
          fontSize: 13, marginBottom: 20,
        }}
      >
        ⏹ Forza tempoScaduto
      </button>

      {/* ── SessionResult ─────────────────────────────────────────────── */}
      {sessionResult && (
        <div style={{ marginBottom: 20 }}>
          <p style={{ margin: "0 0 8px", fontWeight: 700, color: "#86efac" }}>✓ onComplete ricevuto:</p>
          <pre style={{
            background: "#0f172a", padding: "12px 16px", borderRadius: 8,
            fontSize: 12, overflow: "auto", color: "#a5f3fc", maxHeight: 200,
          }}>
            {JSON.stringify(sessionResult, null, 2)}
          </pre>
        </div>
      )}

      {/* ── Checklist 9 test ──────────────────────────────────────────── */}
      <div>
        <p style={{ margin: "0 0 10px", fontWeight: 700, color: "#94a3b8", fontSize: 12, textTransform: "uppercase", letterSpacing: 1 }}>
          Checklist test manuali
        </p>
        <ol style={{ margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
          {TEST_CASES.map((desc, i) => {
            const checked = testCompletati.has(i);
            return (
              <li
                key={i}
                onClick={() => onToggleTest(i)}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 10,
                  cursor: "pointer", padding: "4px 8px", borderRadius: 6,
                  background: checked ? "rgba(134,239,172,0.1)" : "transparent",
                  userSelect: "none",
                }}
              >
                <span style={{
                  minWidth: 18, height: 18, border: `2px solid ${checked ? "#86efac" : "#475569"}`,
                  borderRadius: 4, display: "inline-flex", alignItems: "center", justifyContent: "center",
                  background: checked ? "#86efac" : "transparent",
                  color: "#1e293b", fontSize: 11, fontWeight: 900, flexShrink: 0, marginTop: 1,
                }}>
                  {checked ? "✓" : ""}
                </span>
                <span style={{ color: checked ? "#86efac" : "#94a3b8", fontSize: 12, lineHeight: 1.4 }}>
                  {i + 1}. {desc}
                </span>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}

// ── Helper ────────────────────────────────────────────────────────────────────

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ color: "#64748b", minWidth: 160 }}>{label}:</span>
      <span style={{ fontWeight: 600 }}>{children}</span>
    </div>
  );
}
