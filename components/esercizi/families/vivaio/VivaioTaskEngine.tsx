"use client";

/**
 * "Il Vivaio" — Flessibilità attentiva · Task switching inferenziale.
 *
 * Tutorial → (warning cambio meccanica) → sessione 10 step.
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import { getVivaioLevel, getVivaioMechanicWarning, DIMENSIONE_LABEL } from "./levels";
import { VivaioSession } from "./VivaioSession";
import { CartaFioreSvg, type FioreStimolo } from "./flowers";

type Fase = "tutorial" | "warning" | "sessione";

const BG       = "#F7F4EE";
const SURFACE  = "#FFFFFF";
const INK      = "#1F2937";
const INK_SOFT = "#6B7280";
const RULE     = "rgba(31,41,55,0.12)";
const ACCENT   = "#4A6B5D";

export function VivaioTaskEngine({
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
  onProgress,
}: GameEngineProps) {
  const config  = getVivaioLevel(livello);
  const warning = getVivaioMechanicWarning(livelloPrec, livello);

  const [fase, setFase] = useState<Fase>(
    mostraTutorial ? "tutorial" :
    warning        ? "warning"  :
    "sessione",
  );

  if (fase === "tutorial") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.1rem 1rem", gap: "0.85rem",
        backgroundColor: BG,
        borderRadius: "0.6rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0,
            fontSize: "0.62rem",
            fontWeight: 600,
            color: INK_SOFT,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Come si gioca
          </p>
          <h2 style={{
            margin: "0.15rem 0 0 0",
            fontSize: "1.4rem",
            fontWeight: 700,
            color: INK,
          }}>
            Il Vivaio
          </h2>
        </div>

        <p style={{
          fontSize: "0.92rem", color: "#374151", textAlign: "center",
          lineHeight: 1.5, margin: 0,
        }}>
          In alto vedi un fiore. In basso tre mazzi. Decidi a quale mazzo
          appartiene il fiore — ma <strong>esiste una regola segreta</strong> che
          devi scoprire.
        </p>

        <div style={{
          padding: "0.7rem",
          borderRadius: "0.4rem",
          background: SURFACE,
          border: `1px solid ${RULE}`,
          display: "flex",
          justifyContent: "center",
        }}>
          <CartaFioreSvg
            stimolo={{
              colore:   "rosa",
              forma:    "margherita",
              numero:   2,
              taglia:   "medio",
              gambo:    "verde",
              sfondo:   "panna",
            } as FioreStimolo}
            baseSize={48}
          />
        </div>

        <div style={{
          padding: "0.65rem 0.8rem",
          borderRadius: "0.4rem",
          background: SURFACE,
          border: `1px solid ${RULE}`,
        }}>
          <p style={{
            margin: 0, fontSize: "0.72rem", fontWeight: 700, color: INK_SOFT,
            letterSpacing: "0.08em", textTransform: "uppercase",
            marginBottom: "0.35rem",
          }}>
            {config.regoleAttive.length === 1 ? "La regola è" : "La regola può essere"}
          </p>
          <p style={{
            margin: 0, fontSize: "0.88rem", color: "#374151", lineHeight: 1.45,
          }}>
            {config.regoleAttive.map((d, i) => (
              <span key={d}>
                {i > 0 && " · "}
                <strong>{DIMENSIONE_LABEL[d]}</strong>
              </span>
            ))}
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <Step n={1} txt="Tocca un mazzo: bordo verde se hai indovinato, rosso se no." />
          <Step n={2} txt="Continua con lo stesso criterio finché funziona." />
          <Step n={3} txt="Se cominci a sbagliare, la regola è cambiata: prova un'altra caratteristica." />
        </div>

        <p style={{
          fontSize: "0.82rem", color: INK_SOFT, textAlign: "center",
          lineHeight: 1.5, margin: 0,
        }}>
          Hai <strong>60 secondi</strong>. Più risposte giuste, meglio è.
        </p>

        <button
          onClick={() => setFase(warning ? "warning" : "sessione")}
          style={{
            width: "100%", padding: "0.85rem",
            borderRadius: "0.4rem", border: "none",
            backgroundColor: ACCENT, color: "#FFFFFF",
            fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
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
        padding: "1.5rem 1rem", gap: "1rem",
        backgroundColor: BG,
        borderRadius: "0.6rem",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0,
            fontSize: "0.62rem",
            fontWeight: 600,
            color: INK_SOFT,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Avviso
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0",
            fontSize: "1.2rem",
            fontWeight: 700,
            color: INK,
          }}>
            {warning.titolo}
          </h2>
        </div>

        <p style={{
          fontSize: "0.92rem", color: "#374151", textAlign: "center",
          lineHeight: 1.5, margin: 0,
        }}>
          {warning.testo}
        </p>

        <button
          onClick={() => setFase("sessione")}
          style={{
            width: "100%", padding: "0.85rem",
            borderRadius: "0.4rem", border: "none",
            backgroundColor: ACCENT, color: "#FFFFFF",
            fontSize: "0.95rem", fontWeight: 600, cursor: "pointer",
          }}
        >
          Continua
        </button>
      </div>
    );
  }

  return (
    <VivaioSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
      onProgress={onProgress}
    />
  );
}

function Step({ n, txt }: { n: number; txt: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: "0.65rem",
      padding: "0.4rem 0",
    }}>
      <span style={{
        flexShrink: 0,
        width: 22, height: 22, borderRadius: "50%",
        backgroundColor: ACCENT, color: "#FFFFFF",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.75rem", fontWeight: 700,
      }}>
        {n}
      </span>
      <p style={{
        fontSize: "0.88rem", color: "#374151",
        lineHeight: 1.45, margin: 0, flex: 1,
      }}>
        {txt}
      </p>
    </div>
  );
}
