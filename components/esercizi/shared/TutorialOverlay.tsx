"use client";

/**
 * TutorialOverlay — schermata tutorial multi-pagina condivisa da tutte le famiglie.
 *
 * Responsabilità: navigazione tra pagine, focus trap, Esc disabilitato, accessibilità.
 * Nessuna logica di persistenza (la gestisce page.tsx tramite mostraTutorial).
 * see docs/gdd/shared/02-trial-flow.md §Schermata tutorial
 */

import { useState, useRef, useEffect } from "react";
import type { TutorialConfig } from "@/lib/exercise-types";

// ── Props ─────────────────────────────────────────────────────────────────────

interface TutorialOverlayProps {
  config: TutorialConfig;
  onComplete(): void;
}

// ── Costanti ──────────────────────────────────────────────────────────────────

const FOCUSABLE =
  'button:not([disabled]), a[href], input:not([disabled]), ' +
  'select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

const ID_TITOLO = "tutorial-overlay-titolo";
const ID_TESTO  = "tutorial-overlay-testo";

// ── Componente ────────────────────────────────────────────────────────────────

export function TutorialOverlay({ config, onComplete }: TutorialOverlayProps) {
  const { pagine } = config;
  const [paginaCorrente, setPaginaCorrente] = useState(0);

  const pagina       = pagine[paginaCorrente];
  const paginaTotali = pagine.length;
  const isUltima     = paginaCorrente === paginaTotali - 1;
  // Labelledby: titolo se presente, altrimenti il paragrafo testo
  const labelId      = pagina.titolo ? ID_TITOLO : ID_TESTO;

  const dialogRef   = useRef<HTMLDivElement>(null);
  const primarioRef = useRef<HTMLButtonElement>(null);

  // ── Focus iniziale e re-focus al cambio pagina ────────────────────────────
  // Focus sul pulsante primario ad ogni cambio pagina, incluso "← Indietro".
  // Scelta deliberata: riduce il carico cognitivo per utenti 60+ che non devono
  // cercare dove si trova il focus dopo ogni transizione.

  useEffect(() => {
    primarioRef.current?.focus();
  }, [paginaCorrente]);

  // ── Focus trap + Esc disabilitato (listener su window) ───────────────────
  // Listener su window anziché su dialogRef: cattura Tab anche se il focus
  // esce accidentalmente dal dialog (estensioni browser, scrollbar, ecc.).
  // Beneficio collaterale: Esc è disabilitato globalmente durante il tutorial,
  // coerente con la scelta di non consentire chiusure accidentali.

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") { e.preventDefault(); return; }
      if (e.key !== "Tab") return;

      const node = dialogRef.current;
      if (!node) return;

      // Se il focus è uscito dal dialog, riportalo sul pulsante primario
      if (!node.contains(document.activeElement)) {
        e.preventDefault();
        primarioRef.current?.focus();
        return;
      }

      // Wrap-around: dal primo all'ultimo e viceversa
      const focusable = Array.from(node.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last  = focusable[focusable.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []); // registrato una volta al mount; rimosso all'unmount

  // ── Navigazione ───────────────────────────────────────────────────────────

  function avanti() {
    if (isUltima) { onComplete(); return; }
    setPaginaCorrente(p => p + 1);
  }

  function indietro() {
    setPaginaCorrente(p => Math.max(0, p - 1));
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div
      ref={dialogRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelId}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "#ffffff",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflowY: "auto",
        padding: "48px 24px 40px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          display: "flex",
          flexDirection: "column",
          gap: 28,
          flexGrow: 1,
        }}
      >
        {/* ── Titolo (opzionale) ───────────────────────────────────────── */}
        {pagina.titolo && (
          <h2
            id={ID_TITOLO}
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#1e3a5f",
              textAlign: "center",
              margin: 0,
            }}
          >
            {pagina.titolo}
          </h2>
        )}

        {/* ── Indicatore pallini (solo multi-pagina) ────────────────────── */}
        {paginaTotali > 1 && (
          <div
            style={{ display: "flex", justifyContent: "center", gap: 8 }}
            aria-hidden="true"
          >
            {Array.from({ length: paginaTotali }, (_, i) => (
              <span
                key={i}
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  background: i === paginaCorrente ? "#1d4ed8" : "#cbd5e1",
                  display: "inline-block",
                }}
              />
            ))}
          </div>
        )}

        {/* ── Area demo (opzionale) ─────────────────────────────────────── */}
        {pagina.demo != null && (
          <div
            style={{
              width: "100%",
              borderRadius: 16,
              background: "#f8fafc",
              padding: "24px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {pagina.demo}
          </div>
        )}

        {/* ── Testo istruzioni ──────────────────────────────────────────── */}
        {/* aria-live="polite": screen reader annuncia il testo al cambio pagina */}
        <div aria-live="polite">
          <p
            id={ID_TESTO}
            style={{
              fontSize: 17,
              lineHeight: 1.65,
              color: "#374151",
              textAlign: "center",
              margin: 0,
            }}
          >
            {pagina.testo}
          </p>
        </div>

        {/* ── Spacer: spinge i pulsanti in fondo ───────────────────────── */}
        <div style={{ flexGrow: 1 }} />

        {/* ── Pulsanti navigazione ──────────────────────────────────────── */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

          {/* Riga principale: [← Indietro] + [Avanti → / Ho capito — Inizia] */}
          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            {paginaCorrente > 0 && (
              <button
                onClick={indietro}
                className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d4ed8] focus-visible:outline-offset-[3px]"
                style={{
                  padding: "14px 20px",
                  fontSize: 16,
                  fontWeight: 600,
                  borderRadius: 14,
                  border: "2px solid #1d4ed8",
                  background: "transparent",
                  color: "#1d4ed8",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                ← Indietro
              </button>
            )}

            <button
              ref={primarioRef}
              onClick={avanti}
              className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#1d4ed8] focus-visible:outline-offset-[3px]"
              style={{
                flex: 1,
                padding: "16px 20px",
                fontSize: isUltima ? 18 : 16,
                fontWeight: 700,
                borderRadius: 16,
                border: "none",
                background: "#1d4ed8",
                color: "#ffffff",
                cursor: "pointer",
              }}
            >
              {isUltima ? "Ho capito — Inizia" : "Avanti →"}
            </button>
          </div>

          {/* Salta: solo su pagine intermedie */}
          {!isUltima && (
            <button
              onClick={onComplete}
              className="outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#64748b] focus-visible:outline-offset-[3px]"
              style={{
                background: "none",
                border: "none",
                color: "#64748b",
                fontSize: 15,
                cursor: "pointer",
                padding: "8px",
                alignSelf: "center",
                textDecoration: "underline",
                textUnderlineOffset: 3,
              }}
            >
              Salta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
