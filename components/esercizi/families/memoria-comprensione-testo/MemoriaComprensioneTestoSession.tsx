"use client";

/**
 * MemoriaComprensioneTestoSession — sessione 2 fasi per MCT varianti MBT.
 *
 * Flusso:
 *   1. lettura   — mostra il testo; l'utente tappa "Ho letto — Prosegui"
 *   2. domande   — mostra N domande MCQ una alla volta; tap su un'opzione avanza
 *
 * Chiama onRisposta({ risposte }) dopo l'ultima domanda,
 * o onRisposta(null) se tempoScaduto arriva durante la sessione.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { StimoloMCT, RispostaMCT } from "./sequence";

type Fase = "lettura" | "domande";

type Props = {
  stimolo:      StimoloMCT;
  onRisposta:   (r: RispostaMCT) => void;
  tempoScaduto: boolean;
};

// ── Componente ─────────────────────────────────────────────────────────────────

export function MemoriaComprensioneTestoSession({
  stimolo,
  onRisposta,
  tempoScaduto,
}: Props) {
  const [fase,       setFase]       = useState<Fase>("lettura");
  const [domandaIdx, setDomandaIdx] = useState(0);

  const completatoRef  = useRef(false);
  const stimoloRef     = useRef(stimolo);
  const onRispostaRef  = useRef(onRisposta);
  const risposteRef    = useRef<number[]>([]);

  useLayoutEffect(() => { onRispostaRef.current = onRisposta; });
  useLayoutEffect(() => { stimoloRef.current    = stimolo;    });

  // ── tempoScaduto ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!tempoScaduto || completatoRef.current) return;
    completatoRef.current = true;
    onRispostaRef.current(null);
  }, [tempoScaduto]);

  // ── Reset su cambio stimolo ────────────────────────────────────────────────
  useEffect(() => {
    completatoRef.current = false;
    risposteRef.current   = [];
    setFase("lettura");
    setDomandaIdx(0);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── Prosegui dopo lettura ──────────────────────────────────────────────────
  const handleProsegui = useCallback(() => {
    if (completatoRef.current) return;
    setFase("domande");
    setDomandaIdx(0);
  }, []);

  // ── Tap opzione MCQ ────────────────────────────────────────────────────────
  const handleTapOpzione = useCallback((optIdx: number) => {
    if (completatoRef.current) return;
    const s       = stimoloRef.current;
    const newList = [...risposteRef.current, optIdx];
    risposteRef.current = newList;

    if (newList.length >= s.domande.length) {
      completatoRef.current = true;
      onRispostaRef.current({ risposte: newList });
    } else {
      setDomandaIdx(newList.length);
    }
  }, []);

  // ── Render lettura ─────────────────────────────────────────────────────────
  if (fase === "lettura") {
    return (
      <div className="flex flex-col items-start gap-4 px-4 py-4">
        <p style={{ fontSize: "0.7rem", color: "#38BDF8", fontWeight: 700,
          letterSpacing: "0.08em" }}>
          LEGGI CON ATTENZIONE
        </p>
        <div style={{
          width: "100%", borderRadius: "1.25rem",
          backgroundColor: "#F8FAFC", border: "2px solid #CBD5E1",
          padding: "1.25rem",
        }}>
          <p style={{
            fontSize: "1.05rem", lineHeight: 1.75,
            color: "#1E293B", fontWeight: 400,
          }}>
            {stimolo.testo}
          </p>
        </div>
        <button
          onClick={handleProsegui}
          className="active:scale-95"
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: "0.9rem", fontSize: "1rem", fontWeight: 700,
            backgroundColor: "#1E3A5F", color: "#FFFFFF",
            border: "none", cursor: "pointer",
          }}
        >
          Ho letto — Prosegui
        </button>
      </div>
    );
  }

  // ── Render domande ─────────────────────────────────────────────────────────
  const domanda = stimolo.domande[domandaIdx];

  return (
    <div className="flex flex-col items-start gap-4 px-4 py-4">
      {/* Progresso */}
      <p style={{ fontSize: "0.7rem", color: "#7C3AED", fontWeight: 700,
        letterSpacing: "0.08em" }}>
        DOMANDA {domandaIdx + 1} / {stimolo.domande.length}
      </p>

      {/* Testo domanda */}
      <div style={{
        width: "100%", borderRadius: "1.25rem",
        backgroundColor: "#F5F3FF", border: "2px solid #DDD6FE",
        padding: "1rem 1.25rem",
      }}>
        <p style={{ fontSize: "1rem", fontWeight: 700, color: "#3730A3", lineHeight: 1.5 }}>
          {domanda.testo}
        </p>
      </div>

      {/* Opzioni */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", width: "100%" }}>
        {domanda.opzioni.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleTapOpzione(i)}
            className="active:scale-95"
            style={{
              width: "100%", padding: "0.85rem 1rem",
              borderRadius: "0.85rem", fontSize: "0.95rem", fontWeight: 600,
              border: "2px solid #D1D5DB", backgroundColor: "#FFFFFF",
              color: "#111827", cursor: "pointer", textAlign: "left",
              transition: "background-color 80ms",
            }}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}
