"use client";

/**
 * "Il Correttore di Bozze" — Linguaggio · Rilevamento errori lessicali/sintattici.
 *
 * Tutorial → sessione di 6 bozze (Modello B, nessun timer di sessione).
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import { getCorrettoreLevel } from "./levels";
import { CorrettoreBozzeSession } from "./CorrettoreBozzeSession";

type Fase = "tutorial" | "sessione";

const PAPER     = "#F0E4C8";
const PAPER_DK  = "#E5D6AE";
const INK       = "#1F1A12";
const INK_FADED = "#5A4C32";
const RULE      = "#7A6240";
const STAMP_RED = "#8B2A1C";

const SERIF_HEAD = "'Playfair Display', 'Times New Roman', Georgia, serif";
const SERIF_BODY = "'Libre Caslon Text', 'Times New Roman', Georgia, serif";
const SANS_LABEL = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function CorrettoreBozzeTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
}: GameEngineProps) {
  const config = getCorrettoreLevel(livello);

  const [fase, setFase] = useState<Fase>(mostraTutorial ? "tutorial" : "sessione");

  if (fase === "tutorial") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.4rem 1.1rem 1.2rem 1.1rem", gap: "1rem",
        backgroundColor: PAPER,
        borderRadius: "0.5rem",
        fontFamily: SERIF_BODY,
        color: INK,
        backgroundImage:
          "radial-gradient(circle at 20% 25%, rgba(122,98,64,0.10) 0, transparent 35%)," +
          "radial-gradient(circle at 78% 70%, rgba(122,98,64,0.08) 0, transparent 38%)," +
          "repeating-linear-gradient(0deg, rgba(89,68,40,0.03) 0 1px, transparent 1px 4px)",
        boxShadow: "inset 0 0 22px rgba(122,98,64,0.18)",
      }}>
        <div style={{ textAlign: "center", borderBottom: `2px double ${RULE}`, paddingBottom: "0.55rem" }}>
          <p style={{
            margin: 0, fontSize: "0.6rem", fontWeight: 700,
            color: INK_FADED, letterSpacing: "0.22em",
            textTransform: "uppercase", fontFamily: SANS_LABEL,
          }}>
            Come si gioca
          </p>
          <h2 style={{
            margin: "0.25rem 0 0 0", fontSize: "1.7rem",
            fontWeight: 900, color: INK, fontFamily: SERIF_HEAD,
            letterSpacing: "0.01em",
          }}>
            Il Correttore di Bozze
          </h2>
          <p style={{
            margin: "0.15rem 0 0 0", fontSize: "0.75rem",
            fontStyle: "italic", color: INK_FADED, fontFamily: SERIF_BODY,
          }}>
            la gazzetta del mattino — edizione del correttore
          </p>
        </div>

        <p style={{
          fontSize: "1.05rem", color: INK, textAlign: "center",
          lineHeight: 1.6, margin: 0, fontFamily: SERIF_BODY,
        }}>
          Sei il correttore di un vecchio giornale italiano.
          Dal tipografo arrivano le bozze degli articoli da rivedere.
        </p>

        {/* Esempio di bozza */}
        <div style={{
          background: PAPER_DK,
          border: `1px solid ${RULE}`,
          borderRadius: "0.3rem",
          padding: "0.85rem 0.9rem",
          boxShadow: "0 2px 4px rgba(0,0,0,0.10) inset",
        }}>
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: "0.5rem", paddingBottom: "0.3rem",
            borderBottom: `1px dashed ${RULE}`,
          }}>
            <span style={{ fontFamily: "'Courier New', monospace", fontSize: "0.65rem", color: INK_FADED, letterSpacing: "0.14em", fontWeight: 700 }}>
              ESEMPIO
            </span>
            <span style={{
              fontFamily: SANS_LABEL, fontSize: "0.55rem", color: STAMP_RED,
              letterSpacing: "0.22em", fontWeight: 800,
              border: `1px solid ${STAMP_RED}`, padding: "1px 5px", borderRadius: 2,
            }}>
              REVISIONE
            </span>
          </div>
          <p style={{
            margin: 0, fontSize: "1.2rem", lineHeight: 1.7,
            fontFamily: SERIF_BODY, color: INK,
          }}>
            Il pittore{" "}
            <span style={{
              backgroundColor: "rgba(161,42,31,0.22)",
              color: "#A12A1F",
              padding: "1px 6px",
              borderRadius: 4,
              fontWeight: 700,
              textDecoration: "line-through",
              textDecorationThickness: 2,
            }}>cantava</span>
            {" "}un grande quadro sulla parete.
          </p>
          <p style={{
            margin: "0.55rem 0 0 0", fontSize: "0.85rem",
            color: INK_FADED, fontStyle: "italic", textAlign: "center",
            fontFamily: SERIF_BODY,
          }}>
            la parola giusta era <span style={{ color: "#3F6A2E", fontWeight: 700, fontStyle: "normal" }}>«dipingeva»</span>
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.45rem" }}>
          <Istruzione n={1} testo="Legga la frase con attenzione: ogni bozza ha una sola parola sbagliata." />
          <Istruzione n={2} testo="Tocchi la parola da correggere — l'area è generosa." />
          <Istruzione n={3} testo="Ha sessanta secondi: quante più bozze riesce a correggere, meglio è." />
        </div>

        <button
          onClick={() => setFase("sessione")}
          style={{
            width: "100%", padding: "0.95rem",
            borderRadius: "0.35rem", border: `1px solid ${INK}`,
            backgroundColor: INK, color: PAPER,
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            letterSpacing: "0.14em", textTransform: "uppercase",
            fontFamily: SANS_LABEL,
            boxShadow: "0 2px 4px rgba(0,0,0,0.18)",
          }}
        >
          Inizia la revisione
        </button>
      </div>
    );
  }

  return (
    <CorrettoreBozzeSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
    />
  );
}

function Istruzione({ n, testo }: { n: number; testo: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.65rem", padding: "0.25rem 0" }}>
      <span style={{
        flexShrink: 0, fontSize: "0.95rem", fontWeight: 800,
        color: STAMP_RED, fontFamily: SERIF_HEAD, minWidth: "1.3rem",
      }}>
        {n}.
      </span>
      <p style={{
        fontSize: "1rem", color: INK,
        lineHeight: 1.5, margin: 0, fontFamily: SERIF_BODY,
      }}>
        {testo}
      </p>
    </div>
  );
}
