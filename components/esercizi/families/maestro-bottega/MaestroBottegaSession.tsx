"use client";

/**
 * MaestroBottegaSession — sessione "Il Maestro di Bottega".
 *
 * Layout (estetica bottega artigiana italiana, legni caldi e terrecotte):
 *
 *   ┌──────────────────────────────────────┐
 *   │              ● ● ○ ● ● ●             │ ← storico ultimi 8 trial
 *   ├──────────────────────────────────────┤
 *   │  ▓▓▓ scaffali sfondo bottega ▓▓▓    │ ← sprite oggetti del mestiere
 *   │                                      │
 *   │   ┌────────────────────────────┐    │
 *   │   │   "Attrezzo con manico..." │    │ ← definizione del maestro
 *   │   └────────────────────────────┘    │
 *   ├──────────────────────────────────────┤
 *   │   Scelta multipla (lv 1-3):         │
 *   │   ┌──────┐ ┌──────┐                  │
 *   │   │martelo│ │ pinza│                 │
 *   │   └──────┘ └──────┘                  │
 *   │                                      │
 *   │   Risposta libera (lv 4-10):        │
 *   │   ┌──────────────────────┐ ┌──────┐  │
 *   │   │  ____________        │ │ INVIO│  │
 *   │   └──────────────────────┘ └──────┘  │
 *   └──────────────────────────────────────┘
 */

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SessionResult } from "@/lib/exercise-types";
import { type MaestroLevelConfig } from "./levels";
import {
  filtraCorpus,
  rispostaCorretta,
  type ItemMaestro,
  type DominioMaestro,
} from "./definizioni";

// ── Palette bottega artigiana (legni caldi, terrecotte) ────────────────────
const BG       = "#E8D5B0";   // legno chiaro / pannello
const PANEL    = "#F5E8CC";   // carta del cartello / definizione
const PANEL_EDGE = "#C9A77A"; // bordo legno scuro
const TERRA    = "#B66A3F";   // terracotta
const INK      = "#3A2412";   // inchiostro su legno
const INK_SOFT = "#7A4E2A";
const ACCENT   = "#8B5A2B";   // legno accento
const OK       = "#3F7A4B";
const ERR      = "#B23A2E";

const SERIF = "Georgia, 'Times New Roman', 'Cambria', serif";
const SANS  = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// ── Persistenza anti-ripetizione cross-sessione (localStorage) ──────────────
const VISTI_STORAGE_KEY = "vm_maestro_visti_v1";
const VISTI_MAX = 40;

function caricaVisti(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(VISTI_STORAGE_KEY);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function salvaVisti(visti: readonly string[]): void {
  if (typeof window === "undefined") return;
  try {
    const tail = visti.slice(-VISTI_MAX);
    window.localStorage.setItem(VISTI_STORAGE_KEY, JSON.stringify(tail));
  } catch {
    // ignora
  }
}

// ── CSS animazioni ──────────────────────────────────────────────────────────
const ANIM_CSS = `
@keyframes mb-card-in {
  0%   { transform: translateY(14px) scale(0.96); opacity: 0; }
  100% { transform: translateY(0)    scale(1);    opacity: 1; }
}
@keyframes mb-fb-ok {
  0%   { box-shadow: 0 0 0 0  rgba(63,122,75,0.55); }
  100% { box-shadow: 0 0 0 14px rgba(63,122,75,0); }
}
@keyframes mb-fb-err {
  0%   { box-shadow: 0 0 0 0  rgba(178,58,46,0.55); }
  100% { box-shadow: 0 0 0 14px rgba(178,58,46,0); }
}
@keyframes mb-shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-4px); }
  40%, 80% { transform: translateX(4px); }
}
`;

// ── Tipi runtime ────────────────────────────────────────────────────────────
type Fase = "stimolo" | "feedback" | "isi";

interface TrialState {
  id:           number;
  item:         ItemMaestro;
  /** Opzioni shuffle (solo modalità "scelta"). */
  opzioni:      readonly string[];
  startedAt:    number;
}

interface Props {
  config:       MaestroLevelConfig;
  tempoScaduto: boolean;
  onReady:      () => void;
  onComplete:   (r: SessionResult) => void;
}

// ── Utility random ──────────────────────────────────────────────────────────
function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export function MaestroBottegaSession({ config, tempoScaduto, onReady, onComplete }: Props) {
  const configRef = useRef(config);
  useLayoutEffect(() => { configRef.current = config; }, [config]);

  const poolRef = useRef<readonly ItemMaestro[]>(
    filtraCorpus(config.difficoltaMin, config.difficoltaMax),
  );
  const vistiRef = useRef<string[]>(caricaVisti());
  const sessionVistiRef = useRef<Set<string>>(new Set());

  const trialIdRef = useRef(0);
  const newTrial = useCallback((): TrialState => {
    trialIdRef.current++;
    const cfg = configRef.current;
    const pool = poolRef.current;

    const sessionSet = sessionVistiRef.current;
    const vistiSet = new Set(vistiRef.current);
    const freschi = pool.filter((it) => !sessionSet.has(it.id) && !vistiSet.has(it.id));
    const fuoriSessione = pool.filter((it) => !sessionSet.has(it.id));
    const candidati =
      freschi.length > 0       ? freschi       :
      fuoriSessione.length > 0 ? fuoriSessione :
                                  pool;
    const item = pick(candidati);
    sessionVistiRef.current.add(item.id);
    vistiRef.current.push(item.id);

    // Opzioni (solo se scelta multipla).
    let opzioni: string[] = [];
    if (cfg.modalita === "scelta") {
      const distr = [...item.distrattori];
      shuffleInPlace(distr);
      const sceltiDistr = distr.slice(0, cfg.numOpzioni - 1);
      opzioni = shuffleInPlace([item.parola, ...sceltiDistr]);
    }

    return {
      id: trialIdRef.current,
      item,
      opzioni,
      startedAt: Date.now(),
    };
  }, []);

  const [trial, setTrial] = useState<TrialState | null>(null);
  const trialRef = useRef<TrialState | null>(null);
  useLayoutEffect(() => { trialRef.current = trial; }, [trial]);

  const [fase, setFase] = useState<Fase>("stimolo");
  const faseRef = useRef<Fase>(fase);
  useLayoutEffect(() => { faseRef.current = fase; }, [fase]);

  const [fbEsito, setFbEsito] = useState<"ok" | "err" | null>(null);
  const [fbIdx, setFbIdx] = useState<number | null>(null);
  /** Testo dell'input libero corrente. */
  const [inputTesto, setInputTesto] = useState<string>("");
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Focus automatico sull'input quando entra un nuovo trial in modalità libera.
  useEffect(() => {
    if (config.modalita === "libera" && fase === "stimolo" && trial) {
      // microtask per assicurare che l'input sia montato
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [config.modalita, fase, trial?.id]);

  // Metriche
  const corretteRef       = useRef(0);
  const erroriRef         = useRef(0);
  const omissioniRef      = useRef(0);
  const erroriPerDominio  = useRef<Record<DominioMaestro, number>>({
    casa: 0, cucina: 0, mestiere: 0, natura: 0, abbigliamento: 0, musica: 0, astratto: 0,
  });
  const totPerDominio     = useRef<Record<DominioMaestro, number>>({
    casa: 0, cucina: 0, mestiere: 0, natura: 0, abbigliamento: 0, musica: 0, astratto: 0,
  });
  const tempiCorretteRef  = useRef<number[]>([]);

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    onReady();
    setTrial(newTrial());
    setFase("stimolo");
  }, []); // eslint-disable-line

  const registraTotaleDominio = useCallback((d: DominioMaestro) => {
    totPerDominio.current[d]++;
  }, []);

  // ── Timer di trial (omissione su T.Lim) ─────────────────────────────────
  useEffect(() => {
    if (completedRef.current) return;
    const id = setInterval(() => {
      if (completedRef.current) return;
      const cfg = configRef.current;
      if (faseRef.current === "stimolo" && trialRef.current) {
        if (Date.now() - trialRef.current.startedAt >= cfg.tLimMs) {
          const d = trialRef.current.item.dominio;
          omissioniRef.current++;
          erroriPerDominio.current[d]++;
          registraTotaleDominio(d);
          setFbEsito("err");
          setFbIdx(null);
          setInputTesto("");
          setFase("feedback");
        }
      }
    }, 100);
    return () => clearInterval(id);
  }, [registraTotaleDominio]);

  // Feedback → ISI
  useEffect(() => {
    if (fase !== "feedback") return;
    const tid = setTimeout(() => {
      setFbEsito(null);
      setFbIdx(null);
      setInputTesto("");
      setFase("isi");
    }, 500);
    return () => clearTimeout(tid);
  }, [fase, trial?.id]);

  // ISI → nuovo trial
  useEffect(() => {
    if (fase !== "isi") return;
    const tid = setTimeout(() => {
      setTrial(newTrial());
      setFase("stimolo");
    }, configRef.current.isiMs);
    return () => clearTimeout(tid);
  }, [fase, newTrial]);

  // Fine sessione → emette le metriche
  useEffect(() => {
    if (!tempoScaduto || completedRef.current) return;
    completedRef.current = true;
    const hits = corretteRef.current;
    const errs = erroriRef.current + omissioniRef.current;
    const tot  = hits + errs;
    const acc  = tot > 0 ? hits / tot : 0;
    const tempi = tempiCorretteRef.current;
    const tempoMedio = tempi.length > 0
      ? Math.round(tempi.reduce((a, b) => a + b, 0) / tempi.length)
      : 0;
    salvaVisti(vistiRef.current);
    const errD = erroriPerDominio.current;
    const totD = totPerDominio.current;
    onCompleteRef.current({
      accuratezzaValutativa: acc,
      scoreGrezzo:           hits,
      metriche: {
        corrette:                hits,
        errori:                  erroriRef.current,
        omissioni:               omissioniRef.current,
        tempo_medio_ms:          tempoMedio,
        modalita_libera:         configRef.current.modalita === "libera" ? 1 : 0,
        errori_casa:             errD.casa,
        errori_cucina:           errD.cucina,
        errori_mestiere:         errD.mestiere,
        errori_natura:           errD.natura,
        errori_abbigliamento:    errD.abbigliamento,
        errori_musica:           errD.musica,
        errori_astratto:         errD.astratto,
        totali_casa:             totD.casa,
        totali_cucina:           totD.cucina,
        totali_mestiere:         totD.mestiere,
        totali_natura:           totD.natura,
        totali_abbigliamento:    totD.abbigliamento,
        totali_musica:           totD.musica,
        totali_astratto:         totD.astratto,
      },
    });
  }, [tempoScaduto]);

  // ── Valutazione di una risposta (scelta o libera) ───────────────────────
  const valutaRisposta = useCallback((corretto: boolean, idxOpzione: number | null) => {
    if (!trialRef.current) return;
    const t = trialRef.current;
    registraTotaleDominio(t.item.dominio);
    if (corretto) {
      corretteRef.current++;
      tempiCorretteRef.current.push(Date.now() - t.startedAt);
      setFbEsito("ok");
    } else {
      erroriRef.current++;
      erroriPerDominio.current[t.item.dominio]++;
      setFbEsito("err");
    }
    setFbIdx(idxOpzione);
    setFase("feedback");
  }, [registraTotaleDominio]);

  const handleTap = useCallback((idx: number) => {
    if (completedRef.current) return;
    if (faseRef.current !== "stimolo" || !trialRef.current) return;
    const t = trialRef.current;
    const scelta = t.opzioni[idx];
    valutaRisposta(scelta === t.item.parola, idx);
  }, [valutaRisposta]);

  const handleInvia = useCallback(() => {
    if (completedRef.current) return;
    if (faseRef.current !== "stimolo" || !trialRef.current) return;
    const txt = inputTesto;
    if (!txt.trim()) return;
    const ok = rispostaCorretta(txt, trialRef.current.item);
    valutaRisposta(ok, null);
  }, [inputTesto, valutaRisposta]);

  // ── Render ────────────────────────────────────────────────────────────
  return (
    <div style={{
      width: "100%",
      userSelect: "none",
      padding: "0.85rem 0.85rem 1rem 0.85rem",
      backgroundColor: BG,
      borderRadius: "0.6rem",
      fontFamily: SANS,
      backgroundImage:
        // tessitura legno orizzontale leggera
        "repeating-linear-gradient(0deg, rgba(122,78,42,0.05) 0 2px, transparent 2px 7px)," +
        "radial-gradient(circle at 15% 22%, rgba(122,78,42,0.06) 0, transparent 40%)," +
        "radial-gradient(circle at 85% 78%, rgba(122,78,42,0.05) 0, transparent 42%)",
    }}>
      <style>{ANIM_CSS}</style>

      {/* ── Scena bottega ──────────────────────────────────────────────── */}
      <div style={{
        position: "relative",
        minHeight: 230,
        marginBottom: "1rem",
        padding: "0.3rem",
      }}>
        {fase !== "isi" && trial && (
          <Bottega
            key={`stim-${trial.id}`}
            item={trial.item}
            fbEsito={fbEsito}
          />
        )}
      </div>

      {/* ── Area risposta ────────────────────────────────────────────── */}
      {config.modalita === "scelta" ? (
        // Scelta multipla 4 opzioni — griglia 2x2
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "0.55rem",
        }}>
          {trial?.opzioni.map((op, idx) => {
            const showFb = fbIdx === idx && (fbEsito === "ok" || fbEsito === "err");
            const borderColor =
              showFb && fbEsito === "ok"  ? OK  :
              showFb && fbEsito === "err" ? ERR :
                                            PANEL_EDGE;
            const borderW = showFb ? "2.5px" : "1.5px";
            const disabled = fase !== "stimolo";
            return (
              <button
                key={`${trial.id}-${idx}`}
                onClick={() => handleTap(idx)}
                disabled={disabled}
                style={{
                  padding: "0.95rem 0.7rem",
                  fontSize: "1.1rem",
                  fontFamily: SERIF,
                  fontWeight: 500,
                  color: INK,
                  backgroundColor: PANEL,
                  border: `${borderW} solid ${borderColor}`,
                  borderRadius: "0.4rem",
                  cursor: disabled ? "default" : "pointer",
                  WebkitTapHighlightColor: "transparent",
                  boxShadow: "0 1px 3px rgba(58,36,18,0.12), inset 0 0 0 1px rgba(255,255,255,0.4)",
                  animation:
                    showFb && fbEsito === "ok"  ? "mb-fb-ok  480ms ease-out" :
                    showFb && fbEsito === "err" ? "mb-fb-err 480ms ease-out" :
                                                   undefined,
                  opacity: fase === "isi" ? 0.55 : 1,
                  transition: "opacity 160ms, border-color 180ms, border-width 180ms",
                  letterSpacing: "0.005em",
                  minHeight: 56,
                }}
              >
                {op}
              </button>
            );
          })}
        </div>
      ) : (
        // Risposta libera — input testo + invio
        <form
          onSubmit={(e) => { e.preventDefault(); handleInvia(); }}
          style={{ display: "flex", gap: "0.5rem", alignItems: "stretch" }}
        >
          <input
            ref={inputRef}
            type="text"
            inputMode="text"
            autoCapitalize="none"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            value={inputTesto}
            disabled={fase !== "stimolo"}
            onChange={(e) => setInputTesto(e.target.value)}
            placeholder="Scrivi la parola…"
            style={{
              flex: 1,
              padding: "0.85rem 0.9rem",
              fontSize: "1.15rem",
              fontFamily: SERIF,
              color: INK,
              backgroundColor: PANEL,
              border: `${fbEsito ? "2.5px" : "1.5px"} solid ${
                fbEsito === "ok" ? OK : fbEsito === "err" ? ERR : PANEL_EDGE
              }`,
              borderRadius: "0.4rem",
              outline: "none",
              boxShadow: "inset 0 1px 2px rgba(58,36,18,0.10)",
              animation:
                fbEsito === "ok"  ? "mb-fb-ok  480ms ease-out" :
                fbEsito === "err" ? "mb-fb-err 480ms ease-out, mb-shake 320ms ease-out" :
                                     undefined,
              transition: "border-color 180ms, border-width 180ms",
              minHeight: 52,
            }}
          />
          <button
            type="submit"
            disabled={fase !== "stimolo" || !inputTesto.trim()}
            style={{
              padding: "0 1.1rem",
              fontSize: "1rem",
              fontFamily: SANS,
              fontWeight: 700,
              color: "#FFF",
              backgroundColor: !inputTesto.trim() || fase !== "stimolo" ? "#B8997A" : TERRA,
              border: "none",
              borderRadius: "0.4rem",
              cursor: !inputTesto.trim() || fase !== "stimolo" ? "default" : "pointer",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              minWidth: 90,
              boxShadow: "0 1px 3px rgba(58,36,18,0.18)",
              transition: "background-color 160ms",
            }}
          >
            Invia
          </button>
        </form>
      )}

      {/* In modalità libera, mostra la soluzione in caso di errore */}
      {config.modalita === "libera" && fase === "feedback" && fbEsito === "err" && trial && (
        <p style={{
          margin: "0.6rem 0 0 0",
          fontSize: "0.92rem",
          fontFamily: SERIF,
          color: INK_SOFT,
          textAlign: "center",
          fontStyle: "italic",
        }}>
          Era <span style={{ color: TERRA, fontWeight: 700 }}>{trial.item.parola}</span>
        </p>
      )}
    </div>
  );
}

// ── Sotto-componente: la scena della bottega ───────────────────────────────

function Bottega({
  item,
  fbEsito,
}: {
  item: ItemMaestro;
  fbEsito: "ok" | "err" | null;
}) {
  return (
    <div
      style={{
        position: "relative",
        minHeight: 220,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "mb-card-in 380ms cubic-bezier(0.22, 0.9, 0.36, 1)",
      }}
    >
      {/* Cartello con la definizione — venatura legno, bordo scolpito */}
      <div style={{
        position: "relative",
        width: "100%",
        background: PANEL,
        border: `1.5px solid ${PANEL_EDGE}`,
        borderRadius: "0.5rem",
        padding: "1.1rem 1.05rem 1.15rem 1.05rem",
        boxShadow:
          "0 3px 8px rgba(58,36,18,0.20)," +
          "0 0 0 1px rgba(255,255,255,0.45) inset," +
          "0 0 0 4px " + BG + "," +
          "0 0 0 5px " + PANEL_EDGE,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(139,90,43,0.05) 0 2px, transparent 2px 9px)",
        margin: "0 0.4rem",
      }}>
        {/* due viti agli angoli alti per evocare il cartello inchiodato */}
        <span aria-hidden style={vite("left")} />
        <span aria-hidden style={vite("right")} />

        {/* etichetta superiore */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "0.5rem",
          borderBottom: `1px dashed ${PANEL_EDGE}`,
          paddingBottom: "0.45rem",
          marginBottom: "0.7rem",
          fontFamily: SANS,
          fontSize: "0.62rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: INK_SOFT,
          fontWeight: 700,
        }}>
          <span style={{ width: 14, height: 1, background: PANEL_EDGE }} />
          <span>Il Maestro dice</span>
          <span style={{ width: 14, height: 1, background: PANEL_EDGE }} />
        </div>

        {/* definizione */}
        <p style={{
          margin: 0,
          textAlign: "center",
          fontSize: "1.18rem",
          lineHeight: 1.55,
          color: fbEsito === "err" ? ERR : INK,
          fontFamily: SERIF,
          fontStyle: "italic",
          letterSpacing: "0.005em",
        }}>
          «{item.definizione}»
        </p>

        {/* etichetta dominio in basso */}
        <div style={{
          marginTop: "0.75rem",
          display: "flex",
          justifyContent: "center",
          fontFamily: SANS,
          fontSize: "0.58rem",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: ACCENT,
          fontWeight: 700,
          opacity: 0.85,
        }}>
          · {item.dominio} ·
        </div>
      </div>
    </div>
  );
}

function vite(side: "left" | "right"): React.CSSProperties {
  return {
    position: "absolute",
    top: 8,
    [side]: 8,
    width: 7,
    height: 7,
    borderRadius: "50%",
    background:
      "radial-gradient(circle at 35% 35%, #d6b88a 0%, #8a6a3f 70%, #5a3f22 100%)",
    boxShadow: "inset 0 0 0 0.5px rgba(0,0,0,0.35)",
  } as React.CSSProperties;
}
