"use client";

/**
 * UI singolo trial — "Il Falegname".
 *
 * Atmosfera: bottega artigiana con pareti in legno scuro e illuminazione
 * calda. Il banco da lavoro in noce ospita il pezzo target; le 4 opzioni
 * stanno su pannelli di tela écru montati su cornice in legno, per dare
 * stacco massimo ai pezzi.
 *
 * Niente icone moderne. Niente timer visibile in questa UI (è disegnato
 * dalla pagina padre).
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { StimoloFalegname, RispostaFalegname, OpzioneFalegname } from "./sequence";
import { PezzoLegno } from "./shapes";

type Props = {
  stimolo:    StimoloFalegname;
  onRisposta: (r: RispostaFalegname) => void;
};

// ── Palette officina (alto contrasto, drammatica) ──────────────────────────
const BG_PARETE_HI = "#3A2417";   // assi parete (in alto)
const BG_PARETE_LO = "#2A1810";   // assi parete (in basso, ombra)
const BG_ASSI      = "#4A2F1A";   // pavimento assi
const VENATURA     = "#1A0E07";   // venature scure
const LUME_CALDO   = "rgba(255, 196, 110, 0.18)"; // alone caldo della lampada

const BANCO_TOP    = "#7D4F26";   // piano banco (noce)
const BANCO_LUCE   = "#A87445";   // bordo luce del banco
const BANCO_OMBR   = "#3F2410";   // sotto-banco

const PANNELLO_TELA = "#F2E4C4";  // tela écru pannelli opzioni
const PANNELLO_TELA_DK = "#D9C497"; // ombra tela
const PANNELLO_BORDO = "#5A3618"; // cornice in legno scuro
const PANNELLO_BORDO_HI = "#8B5A2D";

const ACCENTO      = "#E8A857";   // ottone caldo
const ACCENTO_DK   = "#B27A2A";
const INK          = "#F4E7CB";   // testo su sfondo scuro

export function FalegnameSession({ stimolo, onRisposta }: Props) {
  const [scelta,    setScelta]    = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const startMsRef = useRef(Date.now());
  const submRef    = useRef(false);

  useEffect(() => {
    submRef.current = false;
    setScelta(null);
    setSubmitted(false);
    startMsRef.current = Date.now();
  }, [stimolo]);

  const handleTap = useCallback((opt: OpzioneFalegname) => {
    if (submRef.current) return;
    submRef.current = true;
    setScelta(opt.key);
    setSubmitted(true);
    onRisposta({
      sceltaKey: opt.key,
      tempoMs:   Date.now() - startMsRef.current,
    });
  }, [onRisposta]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        maxWidth: "100%",
        minHeight: 560,
        padding: "1rem 0.75rem 1.25rem",
        borderRadius: "0.6rem",
        overflow: "hidden",
        background: BG_PARETE_LO,
        fontFamily: "'Georgia', 'Palatino', serif",
        color: INK,
        boxSizing: "border-box",
      }}
    >
      <OfficinaSfondo />

      {/* Targhetta in ottone */}
      <div style={{
        position: "relative",
        margin: "0 auto",
        width: "fit-content",
        padding: "0.25rem 1rem",
        background: `linear-gradient(180deg, ${ACCENTO} 0%, ${ACCENTO_DK} 100%)`,
        borderRadius: "0.25rem",
        boxShadow: "0 2px 3px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)",
        border: "1px solid #6E471A",
      }}>
        <p style={{
          margin: 0,
          fontSize: "0.78rem",
          letterSpacing: "0.24em",
          color: "#3A1E08",
          fontVariant: "small-caps",
          fontWeight: 800,
        }}>
          Bottega del Falegname
        </p>
      </div>

      {/* Banco da lavoro con il pezzo target */}
      <div style={{
        position: "relative",
        marginTop: "0.85rem",
        marginBottom: "1rem",
      }}>
        <Banco>
          <PezzoLegno
            shapeId={stimolo.target}
            rotZ={stimolo.rifRotZ}
            rotX={stimolo.rifRotX}
            rotY={stimolo.rifRotY}
            size={170}
            styleExtra={{
              filter: "drop-shadow(0 8px 10px rgba(0, 0, 0, 0.55))",
            }}
          />
        </Banco>
        <p style={{
          position: "relative",
          margin: "0.7rem 0 0",
          textAlign: "center",
          fontSize: "0.95rem",
          color: INK,
          fontStyle: "italic",
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}>
          Riconosci il pezzo qui sopra fra le 4 opzioni
        </p>
      </div>

      {/* Griglia opzioni 2×2 */}
      <div style={{
        position: "relative",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.8rem",
        marginTop: "0.5rem",
      }}>
        {stimolo.opzioni.map((opt) => {
          const sel = scelta === opt.key;
          return (
            <button
              key={opt.key}
              onClick={() => handleTap(opt)}
              disabled={submitted}
              className={!submitted ? "active:scale-95" : ""}
              style={{
                position: "relative",
                padding: "6px",
                border: "none",
                borderRadius: "0.5rem",
                background: sel
                  ? `linear-gradient(160deg, ${ACCENTO} 0%, ${ACCENTO_DK} 100%)`
                  : `linear-gradient(160deg, ${PANNELLO_BORDO_HI} 0%, ${PANNELLO_BORDO} 100%)`,
                boxShadow: sel
                  ? `0 0 0 2px ${ACCENTO}, 0 4px 8px rgba(232, 168, 87, 0.45)`
                  : "0 3px 5px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 220, 160, 0.2)",
                cursor: submitted ? "default" : "pointer",
                transition: "box-shadow 120ms, background 120ms",
              }}
            >
              {/* Tela écru interna (l'opzione vera) */}
              <div style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 140,
                background: `linear-gradient(160deg, ${PANNELLO_TELA} 0%, ${PANNELLO_TELA_DK} 100%)`,
                borderRadius: "0.3rem",
                boxShadow: "inset 0 2px 3px rgba(120, 80, 30, 0.18)",
                padding: "0.5rem",
              }}>
                <PezzoLegno
                  shapeId={opt.shapeId}
                  kind={opt.kind}
                  rotZ={opt.rotZ}
                  rotX={opt.rotX}
                  rotY={opt.rotY}
                  specchio={opt.specchio}
                  size={108}
                  styleExtra={{
                    filter: "drop-shadow(0 3px 4px rgba(40, 20, 6, 0.4))",
                  }}
                />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Sfondo officina (parete in legno scuro + lume caldo) ───────────────────

function OfficinaSfondo() {
  return (
    <svg
      viewBox="0 0 400 600"
      preserveAspectRatio="xMidYMid slice"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      aria-hidden
    >
      <defs>
        <linearGradient id="parete" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"  stopColor={BG_PARETE_HI} />
          <stop offset="100%" stopColor={BG_PARETE_LO} />
        </linearGradient>
        <radialGradient id="lume" cx="0.5" cy="0.25" r="0.7">
          <stop offset="0%"   stopColor={LUME_CALDO} />
          <stop offset="100%" stopColor="rgba(0,0,0,0)" />
        </radialGradient>
        <linearGradient id="pavimento" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={BG_ASSI} />
          <stop offset="100%" stopColor="#1B1008" />
        </linearGradient>
      </defs>

      {/* Parete a doghe verticali */}
      <rect x="0" y="0" width="400" height="380" fill="url(#parete)" />
      {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
        <line key={x} x1={x} y1="0" x2={x} y2="380"
              stroke={VENATURA} strokeWidth="1.5" strokeOpacity="0.7" />
      ))}
      {/* Venature curve sulle doghe */}
      {[
        "M 25 60 Q 30 160, 25 280",
        "M 75 30 Q 70 180, 78 340",
        "M 125 50 Q 130 200, 122 360",
        "M 175 40 Q 170 170, 178 320",
        "M 225 70 Q 230 210, 222 340",
        "M 275 30 Q 280 190, 272 350",
        "M 325 50 Q 320 200, 328 340",
        "M 375 40 Q 370 170, 378 330",
      ].map((d, i) => (
        <path key={i} d={d} fill="none" stroke={VENATURA}
              strokeWidth="0.9" strokeOpacity="0.45" />
      ))}

      {/* Lume caldo dall'alto */}
      <rect x="0" y="0" width="400" height="600" fill="url(#lume)" />

      {/* Mensola */}
      <rect x="0" y="155" width="400" height="8" fill="#1A0E07" />
      <rect x="0" y="158" width="400" height="2" fill={ACCENTO} opacity="0.4" />

      {/* Attrezzi appesi (silhouette discrete sopra la mensola) */}
      <g opacity="0.55" fill="none"
         stroke="#1A0E07" strokeWidth="2.5" strokeLinecap="round">
        {/* sega */}
        <path d="M 40 50 L 40 145 M 32 90 L 48 90 L 48 138 L 32 138 Z" />
        {/* chiave */}
        <circle cx="340" cy="60" r="7" />
        <line x1="340" y1="67" x2="340" y2="140" />
        {/* martello */}
        <path d="M 110 130 L 110 60 M 95 60 L 125 60 L 125 80 L 95 80 Z" />
      </g>

      {/* Pavimento assi */}
      <rect x="0" y="380" width="400" height="220" fill="url(#pavimento)" />
      {[400, 440, 480, 520, 560].map((y) => (
        <line key={y} x1="0" y1={y} x2="400" y2={y}
              stroke={VENATURA} strokeWidth="1.5" strokeOpacity="0.7" />
      ))}
      {[50, 130, 210, 290, 370].map((x) => (
        <line key={x} x1={x} y1="380" x2={x + 6} y2="600"
              stroke={VENATURA} strokeWidth="1.2" strokeOpacity="0.55" />
      ))}
    </svg>
  );
}

// ── Banco da lavoro ────────────────────────────────────────────────────────

function Banco({ children }: { children: React.ReactNode }) {
  return (
    <div style={{
      position: "relative",
      margin: "0 auto",
      width: "94%",
      maxWidth: 340,
      minHeight: 220,
      padding: "0.75rem 0.5rem 1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}>
      {/* Piano del banco */}
      <div style={{
        position: "absolute",
        left: 0, right: 0, top: 14, bottom: 22,
        background: `linear-gradient(180deg, ${BANCO_LUCE} 0%, ${BANCO_TOP} 55%, ${BANCO_OMBR} 100%)`,
        borderRadius: "0.4rem",
        boxShadow: "inset 0 2px 0 rgba(255,220,160,0.35), 0 8px 14px rgba(0,0,0,0.55)",
        border: "1px solid #2A150A",
      }}>
        <svg
          viewBox="0 0 340 200"
          preserveAspectRatio="none"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.55 }}
          aria-hidden
        >
          {[25, 55, 90, 125, 160, 190].map((y) => (
            <path key={y}
                  d={`M 0 ${y} Q 80 ${y - 5}, 170 ${y} T 340 ${y + 3}`}
                  fill="none" stroke="#2A150A" strokeWidth="0.9" />
          ))}
          {/* Chiodo + nodo del legno */}
          <circle cx="60" cy="40" r="3" fill="#2A150A" />
          <circle cx="60" cy="40" r="1.2" fill={ACCENTO} opacity="0.7" />
          <ellipse cx="260" cy="150" rx="10" ry="6"
                   fill="none" stroke="#2A150A" strokeWidth="1.2" />
          <ellipse cx="260" cy="150" rx="5" ry="3"
                   fill="none" stroke="#2A150A" strokeWidth="1" />
        </svg>
      </div>
      {/* Gambe del banco */}
      <div style={{
        position: "absolute",
        bottom: 0, left: 18, width: 12, height: 24,
        background: "linear-gradient(180deg, #5A3618 0%, #2A150A 100%)",
        borderRadius: 2,
        boxShadow: "0 2px 3px rgba(0,0,0,0.6)",
      }} />
      <div style={{
        position: "absolute",
        bottom: 0, right: 18, width: 12, height: 24,
        background: "linear-gradient(180deg, #5A3618 0%, #2A150A 100%)",
        borderRadius: 2,
        boxShadow: "0 2px 3px rgba(0,0,0,0.6)",
      }} />
      {/* Pezzo */}
      <div style={{ position: "relative", zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
}
