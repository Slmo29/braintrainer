"use client";

/**
 * "Il Maestro di Bottega" — Linguaggio · Denominazione su definizione.
 *
 * Tutorial → (warning cambio meccanica al lv 4) → sessione 60s.
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import { getMaestroLevel, getMaestroMechanicWarning } from "./levels";
import { MaestroBottegaSession } from "./MaestroBottegaSession";

type Fase = "tutorial" | "warning" | "sessione";

// Palette coerente con la sessione (bottega artigiana).
const BG       = "#E8D5B0";
const PANEL    = "#F5E8CC";
const PANEL_EDGE = "#C9A77A";
const INK      = "#3A2412";
const INK_SOFT = "#7A4E2A";
const ACCENT   = "#8B5A2B";
const TERRA    = "#B66A3F";
const SERIF    = "Georgia, 'Times New Roman', serif";
const SANS     = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function MaestroBottegaTaskEngine({
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
}: GameEngineProps) {
  const config  = getMaestroLevel(livello);
  const warning = getMaestroMechanicWarning(livelloPrec, livello);

  const [fase, setFase] = useState<Fase>(
    mostraTutorial ? "tutorial" :
    warning        ? "warning"  :
    "sessione",
  );

  if (fase === "tutorial") {
    const tutorialModalita = config.modalita;
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.5rem 1.1rem", gap: "1.1rem",
        backgroundColor: BG,
        borderRadius: "0.6rem",
        fontFamily: SANS,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(122,78,42,0.05) 0 2px, transparent 2px 7px)",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 700,
            color: INK_SOFT, letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            Come si gioca
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0", fontSize: "1.85rem",
            fontWeight: 500, color: INK, fontFamily: SERIF,
            letterSpacing: "-0.005em",
          }}>
            Il Maestro di Bottega
          </h2>
        </div>

        <p style={{
          fontSize: "1.05rem", color: INK, textAlign: "center",
          lineHeight: 1.55, margin: 0, fontFamily: SERIF,
        }}>
          Sei nella bottega di un vecchio maestro artigiano.
          Lui descrive un oggetto o un'idea, tu devi trovare la parola giusta.
        </p>

        {/* Esempio cartello */}
        <div style={{
          background: PANEL,
          border: `1.5px solid ${PANEL_EDGE}`,
          borderRadius: "0.4rem",
          padding: "0.9rem 0.95rem 1rem 0.95rem",
          boxShadow: "0 2px 5px rgba(58,36,18,0.18)",
          backgroundImage:
            "repeating-linear-gradient(0deg, rgba(139,90,43,0.05) 0 2px, transparent 2px 9px)",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "center",
            gap: "0.4rem",
            borderBottom: `1px dashed ${PANEL_EDGE}`,
            paddingBottom: "0.4rem",
            marginBottom: "0.6rem",
            fontFamily: SANS,
            fontSize: "0.6rem",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            color: INK_SOFT,
            fontWeight: 700,
          }}>
            <span>Il Maestro dice</span>
          </div>
          <p style={{
            margin: 0, textAlign: "center",
            fontSize: "1.05rem", color: INK,
            fontFamily: SERIF, fontStyle: "italic", lineHeight: 1.5,
          }}>
            «Attrezzo con manico e testa di ferro che si usa per piantare i chiodi.»
          </p>
          <p style={{
            margin: "0.6rem 0 0 0", textAlign: "center",
            fontSize: "0.95rem", color: TERRA, fontWeight: 700,
            fontFamily: SERIF, letterSpacing: "0.04em",
          }}>
            → martello
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <RigaIstruzione numero={1} testo="Leggi la frase del maestro con calma." />
          {tutorialModalita === "scelta" ? (
            <RigaIstruzione numero={2} testo="Tocca la parola corretta tra i quattro bottoni." />
          ) : (
            <RigaIstruzione numero={2} testo="Scrivi tu la parola nella casella e tocca «Invia». Maiuscole e accenti non contano." />
          )}
          <RigaIstruzione numero={3} testo="Hai 60 secondi in tutto. Verde se è giusta, rosso se no." />
        </div>

        <button
          onClick={() => setFase(warning ? "warning" : "sessione")}
          style={{
            width: "100%", padding: "0.95rem",
            borderRadius: "0.4rem", border: "none",
            backgroundColor: ACCENT, color: "#FFFFFF",
            fontSize: "1rem", fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.02em", fontFamily: SANS,
            boxShadow: "0 1px 3px rgba(58,36,18,0.2)",
          }}
        >
          Ho capito — Inizia
        </button>
      </div>
    );
  }

  if (fase === "warning" && warning) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.75rem 1.25rem", gap: "1.1rem",
        backgroundColor: BG, borderRadius: "0.6rem",
        fontFamily: SANS,
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 700,
            color: INK_SOFT, letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}>
            Avviso
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0", fontSize: "1.45rem",
            fontWeight: 500, color: INK, fontFamily: SERIF,
          }}>
            {warning.titolo}
          </h2>
        </div>

        <p style={{
          fontSize: "1.05rem", color: INK, textAlign: "center",
          lineHeight: 1.55, margin: 0, fontFamily: SERIF,
        }}>
          {warning.testo}
        </p>

        <button
          onClick={() => setFase("sessione")}
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: "0.4rem", border: "none",
            backgroundColor: ACCENT, color: "#FFFFFF",
            fontSize: "1rem", fontWeight: 600, cursor: "pointer",
            fontFamily: SANS,
          }}
        >
          Continua
        </button>
      </div>
    );
  }

  return (
    <MaestroBottegaSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
    />
  );
}

function RigaIstruzione({ numero, testo }: { numero: number; testo: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", padding: "0.4rem 0" }}>
      <span style={{
        flexShrink: 0, fontSize: "0.85rem", fontWeight: 700,
        color: ACCENT, fontFamily: SERIF, minWidth: "1.2rem",
      }}>
        {numero}.
      </span>
      <p style={{
        fontSize: "1rem", color: INK,
        lineHeight: 1.5, margin: 0, fontFamily: SERIF,
      }}>
        {testo}
      </p>
    </div>
  );
}
