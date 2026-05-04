"use client";

/**
 * UpdatingWMSession — UI trial per Updating WM (3 varianti).
 *
 * Flusso: cue (2s) → sequenza (speedMs per item) → risposta (MC).
 *
 *   Parole:   sequenza mostra emoji + parola; risposta 2×2 grid emoji+parola
 *   Immagini: sequenza mostra solo emoji;     risposta 2×2 grid solo emoji
 *   Numeri:   sequenza mostra una cifra;      risposta lista 4 sequenze
 *
 * Chiama onRisposta(0–3 | null) al tap dell'opzione MC.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { StimoloUWM, RispostaUWM } from "./sequence";

type Fase = "cue" | "sequenza" | "risposta";

type Props = {
  stimolo:    StimoloUWM;
  onRisposta: (r: RispostaUWM) => void;
};

const CUE_MS = 2000;

// ── Componente ─────────────────────────────────────────────────────────────────

export function UpdatingWMSession({ stimolo, onRisposta }: Props) {
  const [fase,   setFase]   = useState<Fase>("cue");
  const [seqIdx, setSeqIdx] = useState(0);

  const cancelledRef  = useRef(false);
  const onRispostaRef = useRef(onRisposta);

  useLayoutEffect(() => { onRispostaRef.current = onRisposta; });

  // ── Avanza la sequenza item per item ────────────────────────────────────────
  const avanzaSequenza = useCallback((idx: number) => {
    if (cancelledRef.current) return;

    const len = stimolo.variante === "numeri"
      ? stimolo.cifre.length
      : stimolo.items.length;

    setSeqIdx(idx);

    setTimeout(() => {
      if (cancelledRef.current) return;
      const next = idx + 1;
      if (next < len) {
        avanzaSequenza(next);
      } else {
        setFase("risposta");
      }
    }, stimolo.speedMs);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── Reset e avvio su cambio stimolo ────────────────────────────────────────
  useEffect(() => {
    cancelledRef.current = false;
    setFase("cue");
    setSeqIdx(0);

    const t = setTimeout(() => {
      if (cancelledRef.current) return;
      setFase("sequenza");
      avanzaSequenza(0);
    }, CUE_MS);

    return () => {
      cancelledRef.current = true;
      clearTimeout(t);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── Tap opzione MC ──────────────────────────────────────────────────────────
  const handleTap = useCallback((idx: number) => {
    if (fase !== "risposta") return;
    onRispostaRef.current(idx as 0 | 1 | 2 | 3);
  }, [fase]);

  // ── Render cue ─────────────────────────────────────────────────────────────
  if (fase === "cue") {
    const testo = stimolo.variante === "numeri" ? stimolo.regola : stimolo.domanda;
    return (
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", minHeight: 160, width: "100%",
          borderRadius: "1.5rem", backgroundColor: "#F0F9FF",
          border: "2px solid #BAE6FD", padding: "1.5rem",
        }}>
          <p style={{ fontSize: "0.7rem", color: "#38BDF8", fontWeight: 700,
            letterSpacing: "0.08em", marginBottom: 12 }}>
            RICORDA
          </p>
          <p style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0C4A6E",
            textAlign: "center", lineHeight: 1.4 }}>
            {testo}
          </p>
        </div>
      </div>
    );
  }

  // ── Render sequenza ─────────────────────────────────────────────────────────
  if (fase === "sequenza") {
    if (stimolo.variante === "numeri") {
      const digit = stimolo.cifre[seqIdx];
      return (
        <div className="flex flex-col items-center gap-4 px-4 py-8">
          <p style={{ fontSize: "0.7rem", color: "#7C3AED", fontWeight: 600,
            letterSpacing: "0.08em" }}>
            {seqIdx + 1} / {stimolo.cifre.length}
          </p>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            width: "100%", minHeight: 160, borderRadius: "1.5rem",
            backgroundColor: "#F5F3FF", border: "2px solid #DDD6FE",
          }}>
            <p style={{ fontSize: "5rem", fontWeight: 900, color: "#3730A3", lineHeight: 1 }}>
              {digit}
            </p>
          </div>
          <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{stimolo.regola}</p>
        </div>
      );
    }

    // Parole / Immagini
    const item        = stimolo.items[seqIdx];
    const mostraParola = stimolo.variante === "parole";
    return (
      <div className="flex flex-col items-center gap-4 px-4 py-8">
        <p style={{ fontSize: "0.7rem", color: "#059669", fontWeight: 600,
          letterSpacing: "0.08em" }}>
          {seqIdx + 1} / {stimolo.items.length}
        </p>
        <div style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", width: "100%", minHeight: 160,
          borderRadius: "1.5rem", backgroundColor: "#F0FDF4",
          border: "2px solid #BBF7D0",
        }}>
          <p style={{ fontSize: "4.5rem", lineHeight: 1 }}>{item.emoji}</p>
          {mostraParola && (
            <p style={{ fontSize: "1.4rem", fontWeight: 700, color: "#065F46", marginTop: 8 }}>
              {item.parola}
            </p>
          )}
        </div>
        <p style={{ fontSize: "0.75rem", color: "#9CA3AF" }}>{stimolo.domanda}</p>
      </div>
    );
  }

  // ── Render risposta (MC) ────────────────────────────────────────────────────
  if (stimolo.variante === "numeri") {
    return (
      <div className="flex flex-col items-center gap-5 px-4 py-6">
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#3730A3", textAlign: "center" }}>
          {stimolo.regola}
        </p>
        <p style={{ fontSize: "0.9rem", color: "#6D28D9", fontWeight: 600 }}>
          {stimolo.cifre.join(" · ")} → ?
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", width: "100%" }}>
          {stimolo.opzioniMC.map((seq, i) => (
            <button
              key={i}
              onClick={() => handleTap(i)}
              className="active:scale-95"
              style={{
                width: "100%", padding: "0.9rem 1rem", borderRadius: "0.85rem",
                fontSize: "1.2rem", fontWeight: 800,
                border: "2px solid #DDD6FE", backgroundColor: "#F5F3FF",
                color: "#3730A3", cursor: "pointer",
                transition: "background-color 100ms",
              }}
            >
              {seq.join(" · ")}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Parole / Immagini risposta (2×2 grid)
  const mostraParola = stimolo.variante === "parole";
  return (
    <div className="flex flex-col items-center gap-5 px-4 py-6">
      <p style={{ fontSize: "1rem", fontWeight: 700, color: "#0C4A6E", textAlign: "center" }}>
        {stimolo.domanda}
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", width: "100%" }}>
        {stimolo.opzioniMC.map((item, i) => (
          <button
            key={item.id}
            onClick={() => handleTap(i)}
            className="active:scale-95"
            style={{
              display: "flex", flexDirection: "column", alignItems: "center",
              justifyContent: "center", padding: "1rem 0.5rem",
              borderRadius: "0.85rem", border: "2px solid #D1D5DB",
              backgroundColor: "#FFFFFF", cursor: "pointer",
              transition: "background-color 100ms", gap: 4,
            }}
          >
            <span style={{ fontSize: "2.5rem", lineHeight: 1 }}>{item.emoji}</span>
            {mostraParola && (
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#111827" }}>
                {item.parola}
              </span>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
