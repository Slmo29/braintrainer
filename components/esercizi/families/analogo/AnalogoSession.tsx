"use client";

/**
 * UI singolo trial L'Analogo — estetica "rivista scientifica vintage":
 * carta linen, inchiostro carboncino, accento blu polveroso (no marrone).
 * Layout responsive con wrap delle coppie stimolo per parole lunghe.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { StimoloAnalogo, RispostaAnalogo } from "./sequence";

type Props = {
  stimolo:    StimoloAnalogo;
  onRisposta: (r: RispostaAnalogo) => void;
};

// Palette — linen / inchiostro / blu polveroso
const PAPER     = "#F7F4ED";
const PAPER_DK  = "#ECE6D6";
const CARD      = "#FFFFFF";
const INK       = "#2B3340";
const INK_SOFT  = "#6B7280";
const RULE      = "#D4CFC2";
const ACCENT    = "#3D5A6C"; // blu polveroso
const ACCENT_DK = "#2D4452";
const SELECTED  = "#E5EDF3";
const SERIF     = "'Georgia', 'Times New Roman', 'Palatino', serif";

/** Font-size per riga stimolo (a : b). Calcolato sul totale per garantire
 *  che l'intera riga stia su una singola linea senza wrap. */
function rowFontSize(a: string, b: string): string {
  const total = a.length + b.length;
  if (total <= 10) return "1.45rem";
  if (total <= 14) return "1.25rem";
  if (total <= 18) return "1.05rem";
  if (total <= 22) return "0.9rem";
  if (total <= 26) return "0.78rem";
  return "0.68rem";
}

/** Font-size per opzione (single word in box ~150px). */
function optionFontSize(len: number): string {
  if (len <= 7)  return "1.15rem";
  if (len <= 10) return "0.95rem";
  if (len <= 13) return "0.8rem";
  if (len <= 16) return "0.72rem";
  return "0.65rem";
}

/** Restituisce la più piccola tra due font-size in rem (per allineare righe). */
function minRem(a: string, b: string): string {
  const va = parseFloat(a);
  const vb = parseFloat(b);
  return va <= vb ? a : b;
}

export function AnalogoSession({ stimolo, onRisposta }: Props) {
  const [progressPct, setProgressPct] = useState(100);
  const [submitted,   setSubmitted]   = useState(false);
  const [scelta,      setScelta]      = useState<string | null>(null);

  const startMsRef = useRef(Date.now());
  const timerRef   = useRef<ReturnType<typeof setInterval> | null>(null);
  const tlimRef    = useRef<ReturnType<typeof setTimeout> | null>(null);
  const submRef    = useRef(false);

  const submit = useCallback((opt: string | null) => {
    if (submRef.current) return;
    submRef.current = true;
    setSubmitted(true);
    if (timerRef.current) clearInterval(timerRef.current);
    if (tlimRef.current)  clearTimeout(tlimRef.current);
    onRisposta({
      scelta:  opt,
      tempoMs: Date.now() - startMsRef.current,
    });
  }, [onRisposta]);

  useEffect(() => {
    submRef.current = false;
    setSubmitted(false);
    setScelta(null);
    setProgressPct(100);
    startMsRef.current = Date.now();

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startMsRef.current;
      setProgressPct(Math.max(0, 100 - (elapsed / stimolo.tLimMs) * 100));
    }, 60);

    tlimRef.current = setTimeout(() => {
      setProgressPct(0);
      submit(null);
    }, stimolo.tLimMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (tlimRef.current)  clearTimeout(tlimRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  const handleTap = useCallback((opt: string) => {
    if (submitted) return;
    setScelta(opt);
    submit(opt);
  }, [submitted, submit]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
        padding: "1.3rem 1rem 1.5rem",
        backgroundColor: PAPER,
        borderRadius: "0.5rem",
        border: `1px solid ${RULE}`,
        fontFamily: SERIF,
        color: INK,
        width: "100%",
        maxWidth: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
      }}
    >
      {/* Barra T.Lim */}
      <div style={{
        width: "100%", height: 5, backgroundColor: PAPER_DK,
        borderRadius: 2, overflow: "hidden",
        border: `1px solid ${RULE}`,
      }}>
        <div style={{
          width: `${progressPct}%`, height: "100%",
          backgroundColor: progressPct > 25 ? ACCENT : "#C0473F",
          transition: "width 60ms linear",
        }} />
      </div>

      <p style={{
        margin: 0, textAlign: "center",
        fontSize: "0.78rem", letterSpacing: "0.22em",
        color: INK_SOFT, fontVariant: "small-caps",
        fontWeight: 600,
      }}>
        Tavola delle Analogie
      </p>

      {/* Font-size unico per entrambe le righe stimolo → allineamento perfetto */}
      {(() => {
        const stimSize = minRem(
          rowFontSize(stimolo.item.a, stimolo.item.b),
          rowFontSize(stimolo.item.c, "?"),
        );
        return (
          <>
            {/* Coppia stimolo: A : B */}
            <CoppiaRow
              sinistra={stimolo.item.a}
              destra={stimolo.item.b}
              incognita={false}
              fontSize={stimSize}
            />

            <p style={{
              margin: 0, textAlign: "center",
              fontSize: "1.05rem", color: INK_SOFT, fontStyle: "italic",
            }}>
              sta a
            </p>

            {/* Coppia target: C : ? */}
            <CoppiaRow
              sinistra={stimolo.item.c}
              destra={null}
              incognita={true}
              fontSize={stimSize}
            />
          </>
        );
      })()}

      {/* Opzioni 2×2 */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "0.7rem",
        marginTop: "0.25rem",
      }}>
        {stimolo.opzioni.map((opt) => {
          const sel = scelta === opt;
          return (
            <button
              key={opt}
              onClick={() => handleTap(opt)}
              disabled={submitted}
              className={!submitted ? "active:scale-95" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0.95rem 0.5rem",
                borderRadius: "0.4rem",
                border: `1.5px solid ${sel ? ACCENT : RULE}`,
                backgroundColor: sel ? SELECTED : CARD,
                boxShadow: sel
                  ? `inset 0 2px 4px rgba(61, 90, 108, 0.15)`
                  : "0 1px 2px rgba(43, 51, 64, 0.06)",
                cursor: submitted ? "default" : "pointer",
                fontFamily: SERIF,
                color: sel ? ACCENT_DK : INK,
                fontSize: optionFontSize(opt.length),
                fontWeight: 700,
                letterSpacing: "0.03em",
                transition: "background-color 120ms, border-color 120ms, box-shadow 120ms",
                minHeight: 60,
                width: "100%",
                textAlign: "center",
                lineHeight: 1.15,
                whiteSpace: "nowrap",
                overflow: "hidden",
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CoppiaRow({
  sinistra,
  destra,
  incognita,
  fontSize,
}: {
  sinistra:  string;
  destra:    string | null;
  incognita: boolean;
  fontSize:  string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexWrap: "nowrap",
        gap: "0.4rem",
        padding: "0.9rem 0.5rem",
        backgroundColor: CARD,
        border: `1px solid ${RULE}`,
        borderRadius: "0.4rem",
        width: "100%",
        boxSizing: "border-box",
        overflow: "hidden",
        whiteSpace: "nowrap",
        minHeight: "3.2rem",
      }}
    >
      <Parola testo={sinistra} fontSize={fontSize} />
      <Separatore fontSize={fontSize} />
      {incognita
        ? <Incognita fontSize={fontSize} />
        : <Parola testo={destra ?? ""} fontSize={fontSize} />}
    </div>
  );
}

function Parola({ testo, fontSize }: { testo: string; fontSize: string }) {
  return (
    <span style={{
      flex: "0 0 auto",
      padding: "0.15rem 0.25rem",
      fontSize,
      fontWeight: 700,
      color: INK,
      letterSpacing: "0.04em",
      textAlign: "center",
      lineHeight: 1.15,
      whiteSpace: "nowrap",
    }}>
      {testo}
    </span>
  );
}

function Incognita({ fontSize }: { fontSize: string }) {
  return (
    <span style={{
      flex: "0 0 auto",
      padding: "0.15rem 0.4rem",
      fontSize,
      fontWeight: 700,
      color: ACCENT,
      letterSpacing: "0.18em",
      lineHeight: 1.15,
      whiteSpace: "nowrap",
    }}>
      ?
    </span>
  );
}

function Separatore({ fontSize }: { fontSize: string }) {
  return (
    <span style={{
      flex: "0 0 auto",
      fontSize,
      fontWeight: 700,
      color: INK_SOFT,
      padding: "0 0.15rem",
      lineHeight: 1.15,
      whiteSpace: "nowrap",
    }}>
      :
    </span>
  );
}
