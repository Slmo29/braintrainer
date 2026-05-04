"use client";

/**
 * PasatSession — UI per un trial Pasat Light (scelta multipla, lv 1-10).
 *
 * Le cifre appaiono una alla volta a cadenza fissa (isiMs).
 * La prima cifra si memorizza (nessuna risposta richiesta).
 * Per ogni cifra successiva: mostra "OP CIFRA" + 4 opzioni MC.
 * L'utente tappa l'opzione corretta prima che appaia la cifra successiva.
 * Se non risponde entro isiMs, il passo è marcato errato automaticamente.
 *
 * Chiama onRisposta({ corretti, totali }) al termine della sequenza.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { StimoloPL, RispostaPL, PLPasso } from "./sequence";

type Props = {
  stimolo:    StimoloPL;
  onRisposta: (r: RispostaPL) => void;
};

// ── Componente ─────────────────────────────────────────────────────────────────

export function PasatSession({ stimolo, onRisposta }: Props) {
  // Stato display
  const [dispStep,  setDispStep]  = useState(0);
  const [dispPct,   setDispPct]   = useState(100);
  const [dispHlIdx, setDispHlIdx] = useState<number | null>(null);
  const [dispHlOk,  setDispHlOk]  = useState<boolean | null>(null);

  // Ref stabili
  const cancelledRef  = useRef(false);
  const stepIdxRef    = useRef(0);
  const correttiRef   = useRef(0);
  const totaliRef     = useRef(0);
  const rispostaRef   = useRef<number | null>(null);
  const onRispostaRef = useRef(onRisposta);

  useLayoutEffect(() => { onRispostaRef.current = onRisposta; });

  // ── Avanza al passo idx ────────────────────────────────────────────────────
  const advanceStep = useCallback((idx: number) => {
    if (cancelledRef.current) return;

    stepIdxRef.current  = idx;
    rispostaRef.current = null;
    setDispStep(idx);
    setDispPct(100);
    setDispHlIdx(null);
    setDispHlOk(null);

    const t0     = Date.now();
    const isiMs  = stimolo.isiMs;

    const barInt = setInterval(() => {
      if (cancelledRef.current) { clearInterval(barInt); return; }
      const pct = Math.max(0, 100 - (Date.now() - t0) / isiMs * 100);
      setDispPct(pct);
    }, 50);

    setTimeout(() => {
      clearInterval(barInt);
      if (cancelledRef.current) return;

      // Registra risultato step (se non è il primo)
      if (idx >= 1) {
        const passo = stimolo.passi[idx - 1];
        totaliRef.current++;
        if (rispostaRef.current !== null && rispostaRef.current === passo.idxCorr) {
          correttiRef.current++;
        }
        rispostaRef.current = null;
      }

      const nextIdx = idx + 1;
      if (nextIdx >= stimolo.cifre.length) {
        onRispostaRef.current({
          corretti: correttiRef.current,
          totali:   totaliRef.current,
        });
      } else {
        advanceStep(nextIdx);
      }
    }, isiMs);

    // (timer IDs non esposti — cancelledRef gestisce i ghost timer)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // Reset completo su cambio stimolo
  useEffect(() => {
    cancelledRef.current = false;
    stepIdxRef.current   = 0;
    correttiRef.current  = 0;
    totaliRef.current    = 0;
    rispostaRef.current  = null;

    advanceStep(0);

    return () => { cancelledRef.current = true; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── Tap opzione MC ─────────────────────────────────────────────────────────
  const handleTap = useCallback((optIdx: number) => {
    if (cancelledRef.current) return;
    if (rispostaRef.current !== null) return; // già risposto
    if (stepIdxRef.current < 1) return;        // prima cifra, nessuna risposta

    rispostaRef.current = optIdx;
    const passo: PLPasso = stimolo.passi[stepIdxRef.current - 1];
    const ok = optIdx === passo.idxCorr;
    setDispHlIdx(optIdx);
    setDispHlOk(ok);
  }, [stimolo]);

  // ── Render ─────────────────────────────────────────────────────────────────
  const isFirstDigit = dispStep === 0;
  const passo: PLPasso | null = dispStep >= 1 ? stimolo.passi[dispStep - 1] : null;

  const getBtnStyle = (i: number): React.CSSProperties => {
    const base: React.CSSProperties = {
      flex: 1,
      padding: "1rem 0.5rem",
      borderRadius: "0.85rem",
      fontSize: "1.25rem",
      fontWeight: 800,
      border: "2px solid #D1D5DB",
      backgroundColor: "#FFFFFF",
      color: "#111827",
      cursor: dispHlIdx !== null ? "default" : "pointer",
      transition: "background-color 100ms, border-color 100ms",
      minWidth: 64,
    };
    if (dispHlIdx === null) return base;

    if (passo && i === passo.idxCorr) {
      return { ...base, backgroundColor: "#DCFCE7", borderColor: "#22C55E", color: "#15803D" };
    }
    if (i === dispHlIdx && dispHlOk === false) {
      return { ...base, backgroundColor: "#FEE2E2", borderColor: "#EF4444", color: "#B91C1C" };
    }
    return { ...base, opacity: 0.4 };
  };

  return (
    <div className="flex flex-col items-center gap-5 px-4 py-4">

      {/* Barra ISI */}
      <div style={{ width: "100%", height: 6, backgroundColor: "#E5E7EB", borderRadius: 3, overflow: "hidden" }}>
        <div style={{
          width: `${dispPct}%`,
          height: "100%",
          backgroundColor: dispPct > 30 ? "#3B82F6" : "#EF4444",
          borderRadius: 3,
          transition: "width 50ms linear, background-color 200ms",
        }} />
      </div>

      {/* Cifra / operazione */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: 140,
          width: "100%",
          borderRadius: "1.5rem",
          backgroundColor: isFirstDigit ? "#F0F9FF" : "#F5F3FF",
          border: `2px solid ${isFirstDigit ? "#BAE6FD" : "#DDD6FE"}`,
        }}
      >
        {isFirstDigit ? (
          <>
            <p style={{ fontSize: "0.75rem", color: "#38BDF8", fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em" }}>
              MEMORIZZA
            </p>
            <p style={{ fontSize: "5rem", fontWeight: 900, color: "#0C4A6E", lineHeight: 1 }}>
              {stimolo.cifre[0]}
            </p>
          </>
        ) : passo ? (
          <>
            <p style={{ fontSize: "0.75rem", color: "#7C3AED", fontWeight: 600, marginBottom: 6, letterSpacing: "0.06em" }}>
              PRECEDENTE {passo.op} …
            </p>
            <p style={{ fontSize: "5rem", fontWeight: 900, color: "#3730A3", lineHeight: 1 }}>
              {passo.op}{passo.cifraCorr}
            </p>
            <p style={{ fontSize: "0.85rem", color: "#6D28D9", marginTop: 6, fontWeight: 600 }}>
              = ?
            </p>
          </>
        ) : null}
      </div>

      {/* Opzioni MC */}
      {!isFirstDigit && passo && (
        <div style={{ display: "flex", gap: "0.6rem", width: "100%", flexWrap: "wrap" }}>
          {passo.opzioni.map((v, i) => (
            <button
              key={i}
              onClick={() => handleTap(i)}
              disabled={dispHlIdx !== null}
              className={dispHlIdx === null ? "active:scale-95" : ""}
              style={getBtnStyle(i)}
            >
              {v}
            </button>
          ))}
        </div>
      )}

      {/* Contatore passi */}
      <p style={{ fontSize: "0.75rem", color: "#9CA3AF", alignSelf: "flex-end" }}>
        {dispStep} / {stimolo.cifre.length - 1}
      </p>
    </div>
  );
}
