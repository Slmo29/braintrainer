"use client";

/**
 * "Il Postino" — Linguaggio · Completamento proverbi e modi di dire.
 *
 * Tutorial → (warning cambio meccanica) → sessione 60s.
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import { getPostinoLevel, getPostinoMechanicWarning } from "./levels";
import { IlPostinoSession } from "./IlPostinoSession";

type Fase = "tutorial" | "warning" | "sessione";

// Palette coerente con la sessione (cartolina vintage).
const BG       = "#F2E4C9";
const CARD     = "#FBF5E5";
const CARD_EDGE= "#E0CFA5";
const INK      = "#3D2914";
const INK_SOFT = "#7A5A38";
const ACCENT   = "#7A5A38";
const STAMP    = "#B23A2E";
const SERIF    = "Georgia, 'Times New Roman', serif";
const SANS     = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function IlPostinoTaskEngine({
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
}: GameEngineProps) {
  const config  = getPostinoLevel(livello);
  const warning = getPostinoMechanicWarning(livelloPrec, livello);

  const [fase, setFase] = useState<Fase>(
    mostraTutorial ? "tutorial" :
    warning        ? "warning"  :
    "sessione",
  );

  if (fase === "tutorial") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.5rem 1.1rem", gap: "1.1rem",
        backgroundColor: BG,
        borderRadius: "0.6rem",
        fontFamily: SANS,
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
            Il Postino
          </h2>
        </div>

        <p style={{
          fontSize: "1.05rem", color: INK, textAlign: "center",
          lineHeight: 1.55, margin: 0, fontFamily: SERIF,
        }}>
          Arrivano cartoline con proverbi e modi di dire italiani a cui
          manca una parola. Scegli quella giusta tra le opzioni.
        </p>

        {/* Esempio cartolina */}
        <div style={{
          background: CARD,
          border: `1.5px solid ${CARD_EDGE}`,
          borderRadius: "0.4rem",
          padding: "0.9rem 0.9rem 1rem 0.9rem",
          boxShadow: "0 2px 6px rgba(61,41,20,0.12)",
        }}>
          <div style={{
            display: "flex", justifyContent: "space-between",
            alignItems: "center",
            borderBottom: `1px dashed ${CARD_EDGE}`,
            paddingBottom: "0.4rem", marginBottom: "0.55rem",
            fontSize: "0.6rem", fontWeight: 700, color: INK_SOFT,
            letterSpacing: "0.18em", textTransform: "uppercase",
          }}>
            <span>✉ Cartolina</span>
            <span style={{
              display: "inline-flex", alignItems: "center",
              justifyContent: "center", width: 30, height: 22,
              border: `1.5px solid ${STAMP}`, color: STAMP,
              borderRadius: 2, fontSize: "0.6rem", fontWeight: 800,
            }}>
              ITALIA
            </span>
          </div>
          <div style={{
            fontSize: "3rem", textAlign: "center",
            margin: "0.1rem 0 0.4rem 0",
          }}>
            🎣
          </div>
          <p style={{
            margin: 0, textAlign: "center",
            fontSize: "1.2rem", color: INK,
            fontFamily: SERIF, lineHeight: 1.5,
          }}>
            Chi dorme non piglia{" "}
            <span style={{
              display: "inline-block", minWidth: "4.5rem",
              borderBottom: `2px solid ${INK_SOFT}`,
              height: "1.05em", verticalAlign: "baseline",
              margin: "0 0.2rem",
            }} />
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <RigaIstruzione numero={1} testo="Leggi con calma la frase sulla cartolina." />
          <RigaIstruzione numero={2} testo="Tocca la parola corretta tra i bottoni in basso." />
          <RigaIstruzione numero={3} testo="Verde se hai indovinato, rosso se no. Hai 60 secondi in tutto." />
        </div>

        <button
          onClick={() => setFase(warning ? "warning" : "sessione")}
          style={{
            width: "100%", padding: "0.95rem",
            borderRadius: "0.4rem", border: "none",
            backgroundColor: ACCENT, color: "#FFFFFF",
            fontSize: "1rem", fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.02em", fontFamily: SANS,
            boxShadow: "0 1px 3px rgba(61,41,20,0.2)",
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
    <IlPostinoSession
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
