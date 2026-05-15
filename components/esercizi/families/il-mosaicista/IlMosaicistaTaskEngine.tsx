"use client";

/**
 * IlMosaicistaTaskEngine — engine "Il Mosaicista" (id esercizio: il_mosaicista).
 *
 * Dominio: Visuospaziale — atelier di restauro mosaici. Drag-and-drop di
 * frammenti SVG su una griglia target. Modello A timer 90s, mosaici a catena.
 *
 * Bypassa TrialFlow: gestisce direttamente tutorial → sessione drag.
 * Timer sessione gestito da page.tsx via tempoScaduto.
 */

import { useState } from "react";
import type { GameEngineProps, SessionResult } from "@/lib/exercise-types";
import { getMosaicistaLevel } from "./levels";
import { IlMosaicistaSession } from "./IlMosaicistaSession";
import { AtelierBackground, MosaicCellRenderer } from "./sprites";

type Fase = "tutorial" | "sessione";

export function IlMosaicistaTaskEngine({
  livello,
  tempoScaduto,
  mostraTutorial,
  onReady,
  onComplete,
}: GameEngineProps) {
  const config = getMosaicistaLevel(livello);
  const [fase, setFase] = useState<Fase>(mostraTutorial ? "tutorial" : "sessione");

  if (fase === "tutorial") {
    return (
      <AtelierBackground style={{ minHeight: 520, padding: "1.5rem 1.25rem", borderRadius: 12 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "1.05rem" }}>
          <p style={{
            fontSize: "0.7rem", fontWeight: 700, color: "#6B4F2A",
            letterSpacing: "0.08em", margin: 0,
          }}>
            COME SI GIOCA
          </p>

          <h2 style={{
            fontSize: "1.3rem", fontWeight: 900, color: "#3A2614",
            textAlign: "center", margin: 0,
          }}>
            Il Mosaicista
          </h2>

          <p style={{
            fontSize: "0.94rem", color: "#3F2E1C", textAlign: "center",
            lineHeight: 1.5, margin: 0, maxWidth: 380,
          }}>
            Sul tavolo c'è un mosaico da restaurare. Le tessere mancanti sono
            sul lato. <strong>Trascina ciascuna tessera</strong> al suo posto
            sul mosaico, guidato dall'anteprima in alto.
          </p>

          <div style={{
            display: "flex", flexDirection: "column", gap: "0.65rem",
            width: "100%", maxWidth: 380,
          }}>
            <Hint testo="Tieni premuto il dito sulla tessera e trascinala." />
            <Hint testo="Quando sei vicino alla casella giusta, la tessera si aggancia da sola." />
            <Hint testo="Completa tutti i mosaici che riesci entro il tempo." />
          </div>

          <DemoMini />

          <p style={{
            fontSize: "0.78rem", color: "#6B4F2A", textAlign: "center", margin: 0,
          }}>
            Hai un minuto e mezzo. Lavora con calma.
          </p>

          <button
            onClick={() => setFase("sessione")}
            style={{
              width: "100%", maxWidth: 380, padding: "0.95rem",
              borderRadius: "0.9rem", border: "none",
              backgroundColor: "#8B5A2B", color: "#FFF8EC",
              fontSize: "1.02rem", fontWeight: 800, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(110,72,32,0.42)",
            }}
          >
            Ho capito — Comincia!
          </button>
        </div>
      </AtelierBackground>
    );
  }

  return (
    <IlMosaicistaSession
      config={config}
      tempoScaduto={tempoScaduto}
      onReady={onReady}
      onComplete={onComplete as (r: SessionResult) => void}
    />
  );
}

function Hint({ testo }: { testo: string }) {
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "0.6rem",
      padding: "0.5rem 0.8rem", borderRadius: "0.7rem",
      background: "rgba(255,250,235,0.7)",
      border: "1.5px solid #C6A476",
    }}>
      <div style={{
        width: 22, height: 22, flexShrink: 0,
        borderRadius: "50%", background: "#8B5A2B", color: "#FFF8EC",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "0.75rem", fontWeight: 800,
      }}>•</div>
      <p style={{ fontSize: "0.85rem", color: "#2E1F0E", lineHeight: 1.35, margin: 0 }}>
        {testo}
      </p>
    </div>
  );
}

function DemoMini() {
  // 4 tessere già piazzate, una in volo a destra che indica il movimento
  return (
    <div style={{
      display: "flex", alignItems: "center", gap: "1.1rem",
      padding: "0.7rem 1rem", borderRadius: "0.7rem",
      background: "rgba(255,255,255,0.55)",
      border: "1.5px dashed #B8A270",
    }}>
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 36px)",
        gridTemplateRows: "repeat(2, 36px)",
        gap: 2,
      }}>
        <MosaicCellRenderer cell={{ col: 0, row: 0, shape: "solid", color: "#C0573B" }} sizePx={36} highlight="placed" />
        <MosaicCellRenderer cell={{ col: 1, row: 0, shape: "solid", color: "#E8DECD" }} sizePx={36} highlight="placed" />
        <MosaicCellRenderer cell={{ col: 0, row: 1, shape: "solid", color: "#E8DECD" }} sizePx={36} highlight="placed" />
        <div style={{
          width: 36, height: 36,
          border: "2px dashed #B23A3A",
          borderRadius: 4,
          background: "rgba(178,58,58,0.08)",
        }} />
      </div>
      <div style={{ fontSize: "1.8rem", color: "#8B5A2B" }} aria-hidden>→</div>
      <MosaicCellRenderer cell={{ col: 0, row: 0, shape: "solid", color: "#C0573B" }} sizePx={42} highlight="drag" />
    </div>
  );
}
