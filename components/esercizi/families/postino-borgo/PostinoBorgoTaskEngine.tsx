"use client";

/**
 * "Il Postino del Borgo" — Visuospaziale · Path planning con vincoli stradali.
 *
 * Tutorial → (warning cambio meccanica) → 2 trial valutativi.
 * Modello B: nessun timer di sessione, page.tsx riceve null da
 * getSessionDurationMs.
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import {
  getPostinoBorgoLevel, getPostinoBorgoMechanicWarning,
} from "./levels";
import { PostinoBorgoSession } from "./PostinoBorgoSession";
import { PALETTE, PostinoSprite, Decor, DestinatarioPin } from "./village";

type Fase = "tutorial" | "warning" | "sessione";

export function PostinoBorgoTaskEngine({
  livello, livelloPrec, tempoScaduto, mostraTutorial,
  onReady, onComplete, onProgress,
}: GameEngineProps) {
  const config  = getPostinoBorgoLevel(livello);
  const warning = getPostinoBorgoMechanicWarning(livelloPrec, livello);

  const [fase, setFase] = useState<Fase>(
    mostraTutorial ? "tutorial" :
    warning        ? "warning"  :
    "sessione",
  );

  if (fase === "tutorial") {
    return (
      <div style={{
        display: "flex", flexDirection: "column", gap: "0.9rem",
        padding: "1.1rem 1rem",
        background: PALETTE.bg, borderRadius: "0.6rem",
        fontFamily: "Georgia, serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 600,
            color: PALETTE.inkSoft, letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Come si gioca
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0",
            fontSize: "1.4rem", fontWeight: 700, color: PALETTE.ink,
          }}>
            Il Postino del Borgo
          </h2>
        </div>

        <p style={{
          margin: 0, fontSize: "0.95rem", color: "#3A2A18",
          lineHeight: 1.5, textAlign: "center",
        }}>
          Il postino deve consegnare le lettere a tutti i destinatari del borgo.
          <strong> Tocca le case vicine</strong> per tracciare il percorso,
          quindi premi <em>Conferma</em>: il postino partirà animato lungo la
          strada che hai disegnato.
        </p>

        <div style={{
          padding: "0.7rem", borderRadius: "0.4rem",
          background: "#FBF5E5",
          border: `1.4px solid ${PALETTE.streetEdge}`,
          display: "flex", justifyContent: "center", alignItems: "center", gap: "1rem",
        }}>
          <PostinoSprite size={48} />
          <DestinatarioPin idx={1} consegnato={false} size={28} />
          <DestinatarioPin idx={2} consegnato={false} size={28} />
          <Decor kind="fontana" size={56} />
        </div>

        <ul style={{
          margin: 0, paddingLeft: "1.1rem",
          fontSize: "0.86rem", color: PALETTE.ink, lineHeight: 1.55,
        }}>
          <li>Trova il percorso <strong>più corto</strong> che tocca tutte le pin.</li>
          <li>Sbagliato un passo? Premi <strong>Annulla passo</strong> e ricomincia da lì.</li>
          <li>Più la sessione avanza, più trovi <strong>vicoli chiusi, scalinate e sensi unici</strong> da rispettare.</li>
        </ul>

        <button
          onClick={() => setFase(warning ? "warning" : "sessione")}
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: "0.4rem", border: "none",
            background: PALETTE.ink, color: "#FBF5E5",
            fontSize: "1rem", fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 2px 0 #2A1B0C",
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
        display: "flex", flexDirection: "column", gap: "1rem",
        padding: "1.5rem 1rem",
        background: PALETTE.bg, borderRadius: "0.6rem",
        fontFamily: "Georgia, serif",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 600,
            color: PALETTE.inkSoft, letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}>
            Avviso
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0", fontSize: "1.2rem",
            fontWeight: 700, color: PALETTE.ink,
          }}>
            {warning.titolo}
          </h2>
        </div>

        <p style={{
          margin: 0, fontSize: "0.95rem",
          color: "#3A2A18", textAlign: "center", lineHeight: 1.5,
        }}>
          {warning.testo}
        </p>

        <button
          onClick={() => setFase("sessione")}
          style={{
            width: "100%", padding: "0.9rem",
            borderRadius: "0.4rem", border: "none",
            background: PALETTE.ink, color: "#FBF5E5",
            fontSize: "1rem", fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 0 #2A1B0C",
          }}
        >
          Continua
        </button>
      </div>
    );
  }

  return (
    <PostinoBorgoSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
      onProgress={onProgress}
    />
  );
}
