"use client";

/**
 * "Il Banditore" — Linguaggio · Categorizzazione semantica rapida.
 *
 * Tutorial → (warning cambio meccanica) → sessione 60s.
 * Estetica catalogo d'asta vintage (avorio, inchiostro blu, oro patinato).
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import type { CategoriaId } from "./levels";
import {
  getBanditoreLevel,
  getBanditoreMechanicWarning,
  CATEGORIE,
} from "./levels";
import { BanditoreSession } from "./BanditoreSession";

type Fase = "tutorial" | "warning" | "sessione";

// Palette coerente con la sessione (catalogo d'asta vintage).
const SCENA      = "#ECE0C8";
const SCENA_DARK = "#D9C8A8";
const CARTA      = "#FBF5E5";
const CARTA_EDGE = "#B59A66";
const INK        = "#1F2A44";
const INK_SOFT   = "#5D6275";
const ORO        = "#B08D3F";
const ORO_SOFT   = "#C8A861";
const SERIF      = "'Cormorant Garamond', Georgia, 'Times New Roman', serif";
const SANS       = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export function BanditoreTaskEngine({
  livello,
  livelloPrec,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
}: GameEngineProps) {
  const config  = getBanditoreLevel(livello);
  const warning = getBanditoreMechanicWarning(livelloPrec, livello);

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
        backgroundColor: SCENA,
        borderRadius: "0.5rem",
        fontFamily: SANS,
        color: INK,
        boxShadow: `inset 0 0 0 1px ${SCENA_DARK}`,
        backgroundImage:
          "radial-gradient(ellipse at 20% 10%, rgba(176,141,63,0.10) 0%, transparent 55%)," +
          "repeating-linear-gradient(135deg, rgba(176,141,63,0.025) 0 2px, transparent 2px 6px)",
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 700,
            color: INK_SOFT, letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}>
            Come si gioca
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0", fontSize: "2rem",
            fontWeight: 500, color: INK, fontFamily: SERIF,
            letterSpacing: "-0.005em",
          }}>
            Il Banditore
          </h2>
        </div>

        <p style={{
          fontSize: "1.05rem", color: INK, textAlign: "center",
          lineHeight: 1.55, margin: 0, fontFamily: SERIF,
        }}>
          Il banditore d'asta presenta un lotto alla volta sul catalogo.
          Tu leggi il nome e scegli a quale categoria appartiene.
        </p>

        {/* Esempio scheda lotto */}
        <div style={{
          background: CARTA,
          borderRadius: "0.3rem",
          padding: "1.1rem 0.9rem",
          border: `1px solid ${CARTA_EDGE}`,
          outline: `1px solid ${CARTA_EDGE}`,
          outlineOffset: 3,
          boxShadow: "0 2px 5px rgba(31,42,68,0.10)",
        }}>
          <div aria-hidden style={{
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            color: ORO, marginBottom: "0.4rem",
          }}>
            <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${ORO_SOFT})` }}/>
            <span style={{ fontFamily: SERIF, fontSize: "0.85rem", letterSpacing: "0.3em" }}>✦</span>
            <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ORO_SOFT}, transparent)` }}/>
          </div>
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem",
            padding: "0.4rem 0",
          }}>
            <p style={{
              margin: 0, fontFamily: SERIF,
              fontSize: "clamp(1.4rem, 6.5vw, 2.1rem)",
              fontWeight: 500, color: INK, lineHeight: 1.1,
              overflowWrap: "anywhere", wordBreak: "break-word",
              textAlign: "center",
            }}>
              candelabro
            </p>
            <span style={{
              fontFamily: SERIF, fontStyle: "italic", color: INK_SOFT,
              fontSize: "0.7rem", letterSpacing: "0.18em", textTransform: "uppercase",
            }}>
              N°  ·  I
            </span>
          </div>
          <div style={{
            display: "grid", gridTemplateColumns: "1fr 1fr",
            gap: "0.45rem", marginTop: "0.7rem",
          }}>
            <ButtoneEsempio cat="mammifero" />
            <ButtoneEsempio cat="utensile" evidenzia />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
          <RigaIstruzione numero={1} testo="Leggi il nome del lotto sulla scheda." />
          <RigaIstruzione numero={2} testo="Tocca subito il bottone della categoria giusta." />
          <RigaIstruzione numero={3} testo="Si va avanti per 60 secondi. Niente fretta: meglio giusto che veloce." />
        </div>

        <button
          onClick={() => setFase(warning ? "warning" : "sessione")}
          style={{
            width: "100%", padding: "0.95rem",
            borderRadius: "0.35rem",
            border: `1px solid ${INK}`,
            backgroundColor: INK, color: CARTA,
            fontSize: "1rem", fontWeight: 600, cursor: "pointer",
            letterSpacing: "0.06em", fontFamily: SERIF,
            textTransform: "uppercase",
            boxShadow: "0 2px 4px rgba(31,42,68,0.25)",
          }}
        >
          Inizia l'asta
        </button>
      </div>
    );
  }

  if (fase === "warning" && warning) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "stretch",
        padding: "1.75rem 1.25rem", gap: "1.1rem",
        backgroundColor: SCENA, borderRadius: "0.5rem",
        fontFamily: SANS, color: INK,
        boxShadow: `inset 0 0 0 1px ${SCENA_DARK}`,
      }}>
        <div style={{ textAlign: "center" }}>
          <p style={{
            margin: 0, fontSize: "0.62rem", fontWeight: 700,
            color: INK_SOFT, letterSpacing: "0.22em",
            textTransform: "uppercase",
          }}>
            Avviso del banditore
          </p>
          <h2 style={{
            margin: "0.2rem 0 0 0", fontSize: "1.55rem",
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
            borderRadius: "0.35rem",
            border: `1px solid ${INK}`,
            backgroundColor: INK, color: CARTA,
            fontSize: "1rem", fontWeight: 600, cursor: "pointer",
            fontFamily: SERIF, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Continua
        </button>
      </div>
    );
  }

  return (
    <BanditoreSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
    />
  );
}

function ButtoneEsempio({ cat, evidenzia = false }: { cat: CategoriaId; evidenzia?: boolean }) {
  const c = CATEGORIE[cat];
  return (
    <div style={{
      padding: "0.6rem 0.4rem",
      background: c.bg,
      backgroundImage: "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(0,0,0,0.05))",
      border: `${evidenzia ? 2.5 : 1.5}px solid ${evidenzia ? "#3F7A4B" : c.border}`,
      borderRadius: "0.3rem",
      color: c.ink,
      fontFamily: SERIF, fontWeight: 600,
      display: "flex", alignItems: "center", justifyContent: "center",
      gap: 8,
      fontSize: "0.95rem",
      boxShadow: "0 1px 3px rgba(31,42,68,0.18), inset 0 0 0 1px rgba(255,255,255,0.35)",
    }}>
      <span aria-hidden style={{
        width: 11, height: 11, borderRadius: "50%",
        background: c.border,
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.45)",
      }}/>
      <span>{c.label}</span>
    </div>
  );
}

function RigaIstruzione({ numero, testo }: { numero: number; testo: string }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: "0.7rem", padding: "0.35rem 0" }}>
      <span style={{
        flexShrink: 0, fontSize: "0.95rem", fontWeight: 700,
        color: ORO, fontFamily: SERIF, minWidth: "1.2rem",
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
