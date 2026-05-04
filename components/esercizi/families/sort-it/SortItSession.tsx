"use client";

/**
 * SortItSession — UI per un singolo trial Sort It (percettivo o semantico).
 *
 * Processa la sequenza di eventi (carta | switch_banner) in ordine.
 *   carta       : mostra card + bins → utente tocca il bin → feedback → prossimo evento
 *   switch_banner: mostra il banner cambio regola → l'utente tocca "Capito" (o auto dopo 3s)
 *
 * Feedback:
 *   full    (lv 1–6): bin corretto evidenziato in verde su errore
 *   reduced (lv 7–10): solo bordo card rosso/verde, nessun evidenziamento bin
 *
 * Chiama onRisposta({ corretti, totali }) quando tutti gli eventi sono processati.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import type { StimoloSortIt, RispostaSortIt, CartaSI } from "./sequence";
import { COLORE_HEX } from "./sequence";

type Props = {
  stimolo:    StimoloSortIt;
  onRisposta: (r: RispostaSortIt) => void;
};

type FbState = {
  binTappato: string;
  corretto:   boolean;
  binCorretto: string;
} | null;

const FEEDBACK_MS = 600;
const BANNER_AUTO_MS = 3000;

// ── Componente principale ─────────────────────────────────────────────────────

export function SortItSession({ stimolo, onRisposta }: Props) {
  const [eventoIdx,  setEventoIdx]  = useState(0);
  const [fb,         setFb]         = useState<FbState>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [bannerData, setBannerData] = useState<{ regola: string; bins: string[] } | null>(null);

  const risultatiRef  = useRef({ corretti: 0, totali: 0 });
  const submittedRef  = useRef(false);
  const timerRef      = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = () => { if (timerRef.current) clearTimeout(timerRef.current); };

  // Reset su cambio stimolo
  useEffect(() => {
    setEventoIdx(0);
    setFb(null);
    setShowBanner(false);
    setBannerData(null);
    risultatiRef.current = { corretti: 0, totali: 0 };
    submittedRef.current = false;
    return clearTimer;
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stimolo]);

  const avanzaEvento = useCallback((nextIdx: number) => {
    const { eventi } = stimolo;
    if (nextIdx >= eventi.length) {
      if (submittedRef.current) return;
      submittedRef.current = true;
      onRisposta(risultatiRef.current);
      return;
    }
    const ev = eventi[nextIdx];
    if (ev.tipo === "switch") {
      setBannerData({ regola: ev.nuovaRegola, bins: ev.nuoviBins });
      setShowBanner(true);
      setEventoIdx(nextIdx);
      // Auto-avanza dopo BANNER_AUTO_MS
      timerRef.current = setTimeout(() => {
        setShowBanner(false);
        avanzaEvento(nextIdx + 1);
      }, BANNER_AUTO_MS);
    } else {
      setFb(null);
      setEventoIdx(nextIdx);
    }
  }, [stimolo, onRisposta]);

  const handleBinTap = useCallback((binTappato: string) => {
    if (fb !== null || showBanner) return;
    const ev = stimolo.eventi[eventoIdx];
    if (!ev || ev.tipo !== "carta") return;

    const corretto = binTappato === ev.carta.binCorretto;
    const r = risultatiRef.current;
    risultatiRef.current = { corretti: r.corretti + (corretto ? 1 : 0), totali: r.totali + 1 };

    setFb({ binTappato, corretto, binCorretto: ev.carta.binCorretto });
    timerRef.current = setTimeout(() => {
      setFb(null);
      avanzaEvento(eventoIdx + 1);
    }, FEEDBACK_MS);
  }, [fb, showBanner, stimolo, eventoIdx, avanzaEvento]);

  const handleBannerCapito = useCallback(() => {
    clearTimer();
    setShowBanner(false);
    avanzaEvento(eventoIdx + 1);
  }, [eventoIdx, avanzaEvento]);

  // ── Render: banner cambio regola ──────────────────────────────────────────
  if (showBanner && bannerData) {
    return (
      <div className="flex flex-col items-center justify-center gap-5 py-8 px-4">
        <div
          className="w-full rounded-2xl flex flex-col items-center gap-3 py-6 px-4"
          style={{ backgroundColor: "#FEF3C7", border: "1px solid #FCD34D" }}
        >
          <p className="text-sm font-semibold text-amber-700">Nuova regola</p>
          <p className="text-center text-base font-bold text-gray-800">{bannerData.regola}</p>
          <div className="flex gap-2 mt-1">
            {bannerData.bins.map((b) => (
              <span
                key={b}
                className="px-3 py-1 rounded-full text-sm font-semibold"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1D5DB" }}
              >
                {b}
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={handleBannerCapito}
          className="active:scale-95"
          style={{
            padding: "0.9rem 2.5rem",
            borderRadius: "1rem",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            fontSize: "1rem",
            fontWeight: 700,
            border: "none",
            cursor: "pointer",
          }}
        >
          Capito
        </button>
      </div>
    );
  }

  // ── Render: carta corrente ────────────────────────────────────────────────
  const ev = stimolo.eventi[eventoIdx];
  if (!ev || ev.tipo !== "carta") return null;

  const { carta, bins, regola } = ev;
  const cardBorderColor =
    fb === null ? "#E5E7EB"
    : fb.corretto ? "#22C55E"
    : "#EF4444";

  return (
    <div className="flex flex-col gap-4 px-4 py-4">

      {/* Etichetta regola */}
      <p className="text-xs font-semibold text-center text-gray-500 uppercase tracking-wide">
        {regola}
      </p>

      {/* Card */}
      <div
        className="flex items-center justify-center w-full"
        style={{
          minHeight: 160,
          backgroundColor: "#F9FAFB",
          borderRadius: "1.5rem",
          border: `2px solid ${cardBorderColor}`,
          transition: "border-color 150ms",
        }}
        aria-label="Carta da classificare"
      >
        {stimolo.stimulusType === "percettivo"
          ? <CartaPercettiva carta={carta} />
          : <CartaSemantica  carta={carta} />
        }
      </div>

      {/* Bins */}
      <div className="flex gap-3 justify-center flex-wrap">
        {bins.map((bin) => {
          const isCorretto = fb !== null && bin === fb.binCorretto;
          const isErrato   = fb !== null && bin === fb.binTappato && !fb.corretto;
          const showCorrectHighlight = stimolo.feedbackMode === "full" && fb !== null && !fb.corretto && isCorretto;

          let bgColor = "#FFFFFF";
          let borderColor = "#D1D5DB";
          if (isErrato)              { bgColor = "#FEE2E2"; borderColor = "#EF4444"; }
          if (showCorrectHighlight)  { bgColor = "#DCFCE7"; borderColor = "#22C55E"; }

          return (
            <button
              key={bin}
              onClick={() => handleBinTap(bin)}
              disabled={fb !== null}
              className={fb === null ? "active:scale-95" : ""}
              style={{
                minWidth: 90,
                padding: "0.85rem 1rem",
                borderRadius: "0.75rem",
                border: `2px solid ${borderColor}`,
                backgroundColor: bgColor,
                fontSize: "0.95rem",
                fontWeight: 700,
                color: "#111827",
                cursor: fb !== null ? "default" : "pointer",
                transition: "background-color 150ms, border-color 150ms",
              }}
              aria-label={`Bin ${bin}`}
            >
              {bin}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── CartaPercettiva ───────────────────────────────────────────────────────────

function CartaPercettiva({ carta }: { carta: CartaSI }) {
  const size = carta.dimensione === "Grande" ? 80 : 48;
  const fill = COLORE_HEX[carta.colore ?? "Rosso"] ?? "#EF4444";
  const cx = size / 2, cy = size / 2, r = size * 0.44;

  const shape = (() => {
    switch (carta.forma) {
      case "Cerchio":
        return <circle cx={cx} cy={cy} r={r} fill={fill} />;
      case "Quadrato": {
        const m = size * 0.08;
        return <rect x={m} y={m} width={size - 2 * m} height={size - 2 * m} fill={fill} />;
      }
      case "Triangolo":
        return <polygon points={`${cx},${size * 0.05} ${size * 0.95},${size * 0.95} ${size * 0.05},${size * 0.95}`} fill={fill} />;
      case "Stella": {
        const pts: string[] = [];
        for (let i = 0; i < 5; i++) {
          const a1 = (i * 72 - 90) * (Math.PI / 180);
          const a2 = (i * 72 + 36 - 90) * (Math.PI / 180);
          pts.push(`${cx + r * Math.cos(a1)},${cy + r * Math.sin(a1)}`);
          pts.push(`${cx + r * 0.42 * Math.cos(a2)},${cy + r * 0.42 * Math.sin(a2)}`);
        }
        return <polygon points={pts.join(" ")} fill={fill} />;
      }
      case "Rombo":
        return <polygon points={`${cx},${size * 0.04} ${size * 0.96},${cy} ${cx},${size * 0.96} ${size * 0.04},${cy}`} fill={fill} />;
      default:
        return <circle cx={cx} cy={cy} r={r} fill={fill} />;
    }
  })();

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
      {shape}
    </svg>
  );
}

// ── CartaSemantica ────────────────────────────────────────────────────────────

function CartaSemantica({ carta }: { carta: CartaSI }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <span style={{ fontSize: "3.5rem", lineHeight: 1 }} aria-hidden="true">
        {carta.emoji}
      </span>
      <span style={{ fontSize: "1.1rem", fontWeight: 600, color: "#374151" }}>
        {carta.parola}
      </span>
    </div>
  );
}
