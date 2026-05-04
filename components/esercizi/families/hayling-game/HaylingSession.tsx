"use client";

/**
 * HaylingSession — interfaccia per una singola frase Hayling.
 *
 * Flusso:
 *   - Mostra la frase con ___ e un campo testo.
 *   - L'utente digita una parola e tappa "Conferma" (o preme Invio).
 *   - Un countdown visivo (barra + secondi) decresce da tRispostaMs.
 *   - Allo scadere del countdown chiama onRisposta(null).
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import type { StimoloHayling, RispostaHayling } from "./sequence";

type Props = {
  stimolo:      StimoloHayling;
  onRisposta:   (r: RispostaHayling) => void;
  tempoScaduto: boolean;
};

export function HaylingSession({ stimolo, onRisposta, tempoScaduto }: Props) {
  const [parola,         setParola]         = useState("");
  const [msRimasti,      setMsRimasti]      = useState(stimolo.tRispostaMs);

  const completatoRef  = useRef(false);
  const startTimeRef   = useRef(Date.now());
  const stimoloRef     = useRef(stimolo);
  const onRispostaRef  = useRef(onRisposta);
  const inputRef       = useRef<HTMLInputElement>(null);

  useLayoutEffect(() => { stimoloRef.current    = stimolo;    });
  useLayoutEffect(() => { onRispostaRef.current = onRisposta; });

  // ── Reset su cambio stimolo ────────────────────────────────────────────────
  useEffect(() => {
    completatoRef.current = false;
    startTimeRef.current  = Date.now();
    setParola("");
    setMsRimasti(stimolo.tRispostaMs);
    setTimeout(() => inputRef.current?.focus(), 50);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── Countdown per-trial ────────────────────────────────────────────────────
  useEffect(() => {
    if (completatoRef.current) return;
    const id = setInterval(() => {
      const elapsed  = Date.now() - startTimeRef.current;
      const rimasti  = Math.max(0, stimoloRef.current.tRispostaMs - elapsed);
      setMsRimasti(rimasti);
      if (rimasti === 0) {
        clearInterval(id);
        if (!completatoRef.current) {
          completatoRef.current = true;
          onRispostaRef.current(null);
        }
      }
    }, 100);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  // ── tempoScaduto (sessione globale) ───────────────────────────────────────
  useEffect(() => {
    if (!tempoScaduto || completatoRef.current) return;
    completatoRef.current = true;
    onRispostaRef.current(null);
  }, [tempoScaduto]);

  // ── Conferma ──────────────────────────────────────────────────────────────
  const handleConferma = useCallback(() => {
    const p = parola.trim();
    if (!p || completatoRef.current) return;
    completatoRef.current = true;
    onRispostaRef.current({
      parola:  p,
      tempoMs: Date.now() - startTimeRef.current,
    });
  }, [parola]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") handleConferma();
    },
    [handleConferma],
  );

  const pct = msRimasti / stimolo.tRispostaMs;
  const secsRimasti = Math.ceil(msRimasti / 1000);
  const barColor = pct > 0.5 ? "#22C55E" : pct > 0.25 ? "#F59E0B" : "#EF4444";

  const isVarianteB = stimolo.variante === "B";

  return (
    <div className="flex flex-col items-start gap-4 px-4 py-4">

      {/* Badge variante */}
      <p style={{
        fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.08em",
        color: isVarianteB ? "#7C3AED" : "#0369A1",
      }}>
        {isVarianteB ? "PAROLA NON CORRELATA" : "COMPLETA LA FRASE"}
      </p>

      {/* Frase */}
      <div style={{
        width: "100%", borderRadius: "1.25rem",
        backgroundColor: isVarianteB ? "#F5F3FF" : "#F0F9FF",
        border: `2px solid ${isVarianteB ? "#DDD6FE" : "#BAE6FD"}`,
        padding: "1.25rem",
      }}>
        <p style={{
          fontSize: "1.1rem", fontWeight: 700, lineHeight: 1.6,
          color: isVarianteB ? "#3730A3" : "#0C4A6E",
        }}>
          {stimolo.frase}
        </p>
        {isVarianteB && (
          <p style={{
            marginTop: "0.5rem", fontSize: "0.8rem",
            color: "#7C3AED", fontWeight: 500,
          }}>
            Scrivi una parola che NON c&apos;entra nulla con la frase.
          </p>
        )}
      </div>

      {/* Countdown barra */}
      <div style={{ width: "100%", display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <div style={{
          flex: 1, height: "6px", borderRadius: "3px",
          backgroundColor: "#E2E8F0", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", borderRadius: "3px",
            width: `${pct * 100}%`,
            backgroundColor: barColor,
            transition: "width 0.1s linear, background-color 0.3s",
          }} />
        </div>
        <span style={{ fontSize: "0.8rem", color: "#64748B", minWidth: "2rem", textAlign: "right" }}>
          {secsRimasti}s
        </span>
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        type="text"
        value={parola}
        onChange={(e) => setParola(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Scrivi qui…"
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="none"
        spellCheck={false}
        style={{
          width: "100%", padding: "0.9rem 1rem",
          borderRadius: "0.85rem", fontSize: "1.1rem", fontWeight: 600,
          border: "2px solid #CBD5E1", outline: "none",
          backgroundColor: "#FFFFFF", color: "#111827",
        }}
      />

      {/* Conferma */}
      <button
        onClick={handleConferma}
        disabled={parola.trim().length === 0}
        className="active:scale-95"
        style={{
          width: "100%", padding: "0.9rem",
          borderRadius: "0.9rem", fontSize: "1rem", fontWeight: 700,
          backgroundColor: parola.trim().length > 0 ? "#1E3A5F" : "#CBD5E1",
          color: "#FFFFFF", border: "none", cursor: parola.trim().length > 0 ? "pointer" : "default",
        }}
      >
        Conferma
      </button>
    </div>
  );
}
