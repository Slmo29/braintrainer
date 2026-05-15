"use client";

/**
 * BanditoreSession — sessione "Il Banditore".
 *
 * Estetica: catalogo d'asta vintage italiano. Carta avorio, inchiostro
 * blu-seppia, oro patinato e rosso ceralacca per accenti. Il lotto è una
 * scheda tipografica con cornice ornamentale e il nome dell'oggetto in
 * grande in carattere serif classico (niente emoji, niente palco rosso).
 *
 *   ┌──────────────────────────────────────────────┐
 *   │  ●●●○●●●●            · catalogo · lotto 12 · │
 *   ├──────────────────────────────────────────────┤
 *   │  ┌────────────────────────────────────────┐  │
 *   │  │ ✦ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ✦ │  │
 *   │  │                                        │  │
 *   │  │           candelabro                   │  │  ← nome in serif XL
 *   │  │                                        │  │
 *   │  │           N°  ·  XII                   │  │
 *   │  │ ✦ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ✦ │  │
 *   │  └────────────────────────────────────────┘  │
 *   ├──────────────────────────────────────────────┤
 *   │   ┌───────────┐  ┌───────────┐               │
 *   │   │ ▣ Animale │  │ ▣ Oggetto │               │  ← bottoni colorati
 *   │   └───────────┘  └───────────┘               │     con pastiglia colore
 *   └──────────────────────────────────────────────┘
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SessionResult } from "@/lib/exercise-types";
import {
  type BanditoreLevelConfig,
  type CategoriaId,
  CATEGORIE,
} from "./levels";
import { filtraCorpusPerLivello, type ItemBanditore } from "./pool";

// ── Palette catalogo d'asta vintage ─────────────────────────────────────────
const SCENA      = "#ECE0C8";   // avorio antico (sfondo principale)
const SCENA_DARK = "#D9C8A8";   // ombra
const CARTA      = "#FBF5E5";   // carta del catalogo
const CARTA_EDGE = "#B59A66";   // bordo cornice
const INK        = "#1F2A44";   // inchiostro blu-seppia scuro
const INK_SOFT   = "#5D6275";   // inchiostro tenue
const ORO        = "#B08D3F";   // oro patinato
const ORO_SOFT   = "#C8A861";
const STAMP      = "#8B3A2E";   // rosso ceralacca
const OK         = "#3F7A4B";
const ERR        = "#8B3A2E";

const SERIF      = "'Cormorant Garamond', Georgia, 'Times New Roman', 'Cambria', serif";
const SANS       = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// ── Persistenza anti-ripetizione cross-sessione ─────────────────────────────
const VISTI_STORAGE_KEY = "vm_banditore_visti_v1";
const VISTI_MAX = 60;

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

// ── Numerazione romana per i "lotti" ────────────────────────────────────────
function roman(n: number): string {
  if (n < 1) return "—";
  const m = [
    ["M",1000],["CM",900],["D",500],["CD",400],
    ["C",100],["XC",90],["L",50],["XL",40],
    ["X",10],["IX",9],["V",5],["IV",4],["I",1],
  ] as const;
  let out = "", v = n;
  for (const [s, val] of m) {
    while (v >= val) { out += s; v -= val; }
  }
  return out;
}

// ── CSS animazioni ──────────────────────────────────────────────────────────
const ANIM_CSS = `
@keyframes bnd-card-in {
  0%   { transform: translateY(10px) scale(0.97); opacity: 0; }
  100% { transform: translateY(0)    scale(1);    opacity: 1; }
}
@keyframes bnd-card-out {
  0%   { transform: translateY(0)    scale(1);    opacity: 1; }
  100% { transform: translateY(-8px) scale(0.985); opacity: 0; }
}
@keyframes bnd-fb-ok {
  0%   { box-shadow: 0 0 0 0  rgba(63,122,75,0.55); }
  100% { box-shadow: 0 0 0 14px rgba(63,122,75,0); }
}
@keyframes bnd-fb-err {
  0%   { box-shadow: 0 0 0 0  rgba(139,58,46,0.55); }
  100% { box-shadow: 0 0 0 14px rgba(139,58,46,0); }
}
`;

// ── Tipi runtime ────────────────────────────────────────────────────────────
type Fase = "stimolo" | "feedback" | "isi";

interface TrialState {
  id:        number;
  item:      ItemBanditore;
  startedAt: number;
}

interface Props {
  config:       BanditoreLevelConfig;
  tempoScaduto: boolean;
  onReady:      () => void;
  onComplete:   (r: SessionResult) => void;
}

function pick<T>(arr: readonly T[]): T { return arr[Math.floor(Math.random() * arr.length)]; }

// ── Componente ──────────────────────────────────────────────────────────────
export function BanditoreSession({ config, tempoScaduto, onReady, onComplete }: Props) {
  const configRef = useRef(config);
  useLayoutEffect(() => { configRef.current = config; }, [config]);

  const poolRef = useRef<readonly ItemBanditore[]>(
    filtraCorpusPerLivello(config.categorie, config.ammettiAmbigui),
  );

  const vistiRef = useRef<string[]>(caricaVisti());
  const sessionVistiRef = useRef<Set<string>>(new Set());
  const ultimoIdRef = useRef<string | null>(null);

  const trialIdRef = useRef(0);
  const newTrial = useCallback((): TrialState => {
    trialIdRef.current++;
    const pool = poolRef.current;
    const sessionSet = sessionVistiRef.current;
    const vistiSet = new Set(vistiRef.current);

    const freschi        = pool.filter((it) => !sessionSet.has(it.id) && !vistiSet.has(it.id) && it.id !== ultimoIdRef.current);
    const fuoriSessione  = pool.filter((it) => !sessionSet.has(it.id) && it.id !== ultimoIdRef.current);
    const nonConsecutivo = pool.filter((it) => it.id !== ultimoIdRef.current);
    const candidati =
      freschi.length        > 0 ? freschi :
      fuoriSessione.length  > 0 ? fuoriSessione :
      nonConsecutivo.length > 0 ? nonConsecutivo :
                                   pool;

    const item = pick(candidati);
    sessionVistiRef.current.add(item.id);
    vistiRef.current.push(item.id);
    ultimoIdRef.current = item.id;
    return { id: trialIdRef.current, item, startedAt: Date.now() };
  }, []);

  const [trial, setTrial] = useState<TrialState | null>(null);
  const trialRef = useRef<TrialState | null>(null);
  useLayoutEffect(() => { trialRef.current = trial; }, [trial]);

  const [fase, setFase] = useState<Fase>("stimolo");
  const faseRef = useRef<Fase>(fase);
  useLayoutEffect(() => { faseRef.current = fase; }, [fase]);

  const [fbEsito, setFbEsito] = useState<"ok" | "err" | null>(null);
  const [fbCatId, setFbCatId] = useState<CategoriaId | null>(null);

  // ── Metriche ─────────────────────────────────────────────────────────────
  const corretteRef   = useRef(0);
  const erroriRef     = useRef(0);
  const omissioniRef  = useRef(0);
  const tempiCorrRef  = useRef<number[]>([]);
  const perCatRef     = useRef<Record<string, { totali: number; corretti: number }>>({});
  const confusioneRef = useRef<Record<string, number>>({});

  const completedRef = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    onReady();
    setTrial(newTrial());
    setFase("stimolo");
  }, []); // eslint-disable-line

  // ── T.Lim → omissione ────────────────────────────────────────────────────
  useEffect(() => {
    if (completedRef.current) return;
    const id = setInterval(() => {
      if (completedRef.current) return;
      const cfg = configRef.current;
      if (faseRef.current === "stimolo" && trialRef.current) {
        if (Date.now() - trialRef.current.startedAt >= cfg.tLimMs) {
          const attesa = trialRef.current.item.categorie[0];
          omissioniRef.current++;
          const pc = perCatRef.current[attesa] ?? { totali: 0, corretti: 0 };
          pc.totali++;
          perCatRef.current[attesa] = pc;
          setFbEsito("err");
          setFbCatId(null);
          setFase("feedback");
        }
      }
    }, 100);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (fase !== "feedback") return;
    const tid = setTimeout(() => {
      setFbEsito(null);
      setFbCatId(null);
      setFase("isi");
    }, 400);
    return () => clearTimeout(tid);
  }, [fase, trial?.id]);

  useEffect(() => {
    if (fase !== "isi") return;
    const tid = setTimeout(() => {
      setTrial(newTrial());
      setFase("stimolo");
    }, configRef.current.isiMs);
    return () => clearTimeout(tid);
  }, [fase, newTrial]);

  useEffect(() => {
    if (!tempoScaduto || completedRef.current) return;
    completedRef.current = true;
    salvaVisti(vistiRef.current);

    const hits = corretteRef.current;
    const errs = erroriRef.current + omissioniRef.current;
    const tot  = hits + errs;
    const acc  = tot > 0 ? hits / tot : 0;
    const tempi = tempiCorrRef.current;
    const tempoMedio = tempi.length > 0
      ? Math.round(tempi.reduce((a, b) => a + b, 0) / tempi.length)
      : 0;

    const metriche: Record<string, number> = {
      corrette:       hits,
      errori:         erroriRef.current,
      omissioni:      omissioniRef.current,
      tempo_medio_ms: tempoMedio,
    };
    for (const cat of Object.keys(perCatRef.current)) {
      const pc = perCatRef.current[cat];
      if (pc.totali === 0) continue;
      metriche[`acc_${cat}`]    = Math.round((pc.corretti / pc.totali) * 100) / 100;
      metriche[`totali_${cat}`] = pc.totali;
    }
    for (const key of Object.keys(confusioneRef.current)) {
      metriche[`conf_${key}`] = confusioneRef.current[key];
    }

    onCompleteRef.current({
      accuratezzaValutativa: acc,
      scoreGrezzo:           hits,
      metriche,
    });
  }, [tempoScaduto]);

  const handleTap = useCallback((scelta: CategoriaId) => {
    if (completedRef.current) return;
    if (faseRef.current !== "stimolo" || !trialRef.current) return;

    const t = trialRef.current;
    const attesa = t.item.categorie[0];
    const isCorrect = scelta === attesa;

    const pc = perCatRef.current[attesa] ?? { totali: 0, corretti: 0 };
    pc.totali++;
    if (isCorrect) pc.corretti++;
    perCatRef.current[attesa] = pc;

    if (isCorrect) {
      corretteRef.current++;
      tempiCorrRef.current.push(Date.now() - t.startedAt);
      setFbEsito("ok");
    } else {
      erroriRef.current++;
      const key = `${attesa}_${scelta}`;
      confusioneRef.current[key] = (confusioneRef.current[key] ?? 0) + 1;
      setFbEsito("err");
    }
    setFbCatId(scelta);
    setFase("feedback");
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  const categorie = config.categorie;
  const gridCols =
    categorie.length === 2 ? "1fr 1fr"     :
    categorie.length === 3 ? "1fr 1fr 1fr" :
    categorie.length === 4 ? "1fr 1fr"     :
                              "1fr 1fr 1fr";

  return (
    <div style={{
      width: "100%",
      userSelect: "none",
      padding: "0.9rem 0.85rem 1rem 0.85rem",
      backgroundColor: SCENA,
      borderRadius: "0.5rem",
      fontFamily: SANS,
      // tessitura di carta avorio invecchiata, niente sipari rossi
      backgroundImage:
        "radial-gradient(ellipse at 20% 10%, rgba(176,141,63,0.10) 0%, transparent 55%)," +
        "radial-gradient(ellipse at 85% 90%, rgba(31,42,68,0.05) 0%, transparent 50%)," +
        "repeating-linear-gradient(135deg, rgba(176,141,63,0.025) 0 2px, transparent 2px 6px)",
      boxShadow: `inset 0 0 0 1px ${SCENA_DARK}`,
    }}>
      <style>{ANIM_CSS}</style>

      {/* ── Header: solo intestazione del catalogo ──────────────────────── */}
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: "0.6rem",
        padding: "0 0.1rem",
      }}>
        <span style={{
          fontFamily: SERIF, fontStyle: "italic",
          color: INK_SOFT, fontSize: "0.72rem",
          letterSpacing: "0.2em", textTransform: "uppercase",
        }}>
          · catalogo · lotto № {roman(trial?.id ?? 0)}
        </span>
      </div>

      {/* ── Scheda lotto (carta del catalogo) ───────────────────────────── */}
      <div style={{
        position: "relative",
        background: CARTA,
        borderRadius: "0.3rem",
        padding: "1.4rem 1.1rem 1.5rem 1.1rem",
        marginBottom: "1rem",
        minHeight: 200,
        boxShadow:
          "0 2px 6px rgba(31,42,68,0.12), " +
          "inset 0 0 0 1px rgba(255,255,255,0.6)",
        // doppia cornice tipografica
        border: `1px solid ${CARTA_EDGE}`,
        outline: `1px solid ${CARTA_EDGE}`,
        outlineOffset: 4,
        backgroundImage:
          "repeating-linear-gradient(0deg, rgba(31,42,68,0.015) 0 1px, transparent 1px 3px)",
        overflow: "hidden",
      }}>
        {/* ornamento decorativo in alto */}
        <FregioOrnamentale />

        {/* contenuto: nome del lotto */}
        <div style={{
          minHeight: 110,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0.4rem 0",
        }}>
          {trial && fase !== "isi" && (
            <div
              key={`lot-${trial.id}`}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "0.5rem",
                animation: fase === "feedback"
                  ? "bnd-card-out 380ms ease-in forwards"
                  : "bnd-card-in 420ms cubic-bezier(0.22, 0.9, 0.36, 1)",
              }}
            >
              <p style={{
                margin: 0,
                fontFamily: SERIF,
                // responsivo: scala con il viewport per evitare overflow su
                // schermi stretti con parole lunghe (biancospino, anfiteatro,
                // topinambur, corbezzolo, …)
                fontSize: "clamp(1.45rem, 7.5vw, 2.4rem)",
                fontWeight: 500,
                color: INK,
                lineHeight: 1.1,
                letterSpacing: "0.005em",
                textAlign: "center",
                maxWidth: "100%",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                hyphens: "auto",
                padding: "0 0.2rem",
              }}>
                {trial.item.nome}
              </p>
              <span style={{
                fontFamily: SERIF,
                fontStyle: "italic",
                color: INK_SOFT,
                fontSize: "0.78rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}>
                N°  ·  {roman(trial.id)}
              </span>
            </div>
          )}
        </div>

        {/* ornamento decorativo in basso (specchiato) */}
        <FregioOrnamentale flip />

        {/* timbro rosso ceralacca discreto, angolo basso-destro */}
        <div aria-hidden style={{
          position: "absolute",
          right: 10, bottom: 8,
          width: 36, height: 36,
          borderRadius: "50%",
          border: `1.5px solid ${STAMP}`,
          color: STAMP,
          fontFamily: SERIF,
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          display: "flex", alignItems: "center", justifyContent: "center",
          opacity: 0.55,
          transform: "rotate(-12deg)",
          background: "rgba(139,58,46,0.04)",
        }}>
          asta
        </div>
      </div>

      {/* ── Bottoni categoria ───────────────────────────────────────────── */}
      <div style={{
        display: "grid",
        gridTemplateColumns: gridCols,
        gap: "0.55rem",
      }}>
        {categorie.map((catId) => {
          const cat = CATEGORIE[catId];
          const showFb = fbCatId === catId && (fbEsito === "ok" || fbEsito === "err");
          const borderColor =
            showFb && fbEsito === "ok"  ? OK  :
            showFb && fbEsito === "err" ? ERR :
                                          cat.border;
          const borderW = showFb ? "3px" : "1.5px";
          const disabled = fase !== "stimolo";
          return (
            <button
              key={catId}
              onClick={() => handleTap(catId)}
              disabled={disabled}
              aria-label={cat.label}
              style={{
                padding: "0.8rem 0.4rem",
                // scala con il numero di colonne: 5 cat → bottoni stretti, font più piccolo
                fontSize: categorie.length >= 4
                  ? "clamp(0.85rem, 3.4vw, 1rem)"
                  : "clamp(0.95rem, 4vw, 1.15rem)",
                fontFamily: SERIF,
                fontWeight: 600,
                color: cat.ink,
                background: cat.bg,
                backgroundImage:
                  "linear-gradient(180deg, rgba(255,255,255,0.22), rgba(0,0,0,0.05))",
                border: `${borderW} solid ${borderColor}`,
                borderRadius: "0.35rem",
                cursor: disabled ? "default" : "pointer",
                WebkitTapHighlightColor: "transparent",
                boxShadow: "0 1px 3px rgba(31,42,68,0.18), inset 0 0 0 1px rgba(255,255,255,0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: categorie.length >= 4 ? 6 : 10,
                minHeight: 60,
                letterSpacing: "0.01em",
                overflowWrap: "anywhere",
                wordBreak: "break-word",
                animation:
                  showFb && fbEsito === "ok"  ? "bnd-fb-ok  520ms ease-out" :
                  showFb && fbEsito === "err" ? "bnd-fb-err 520ms ease-out" :
                                                 undefined,
                opacity: fase === "isi" ? 0.55 : 1,
                transition: "opacity 160ms, border-color 180ms, border-width 180ms",
              }}
            >
              {/* pastiglia di colore (sostituisce l'emoji) */}
              <span aria-hidden style={{
                width: 14, height: 14, borderRadius: "50%",
                background: cat.border,
                boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.45)",
                flexShrink: 0,
              }}/>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Fregio ornamentale tipografico (sostituisce illustrazioni emoji) ────────
function FregioOrnamentale({ flip = false }: { flip?: boolean }) {
  return (
    <div aria-hidden style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      color: ORO,
      transform: flip ? "scaleY(-1)" : undefined,
      marginBottom: flip ? 0 : "0.4rem",
      marginTop: flip ? "0.4rem" : 0,
    }}>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, transparent, ${ORO_SOFT})` }} />
      <span style={{
        fontFamily: SERIF, fontSize: "0.85rem", color: ORO,
        letterSpacing: "0.3em",
      }}>
        ✦
      </span>
      <span style={{ flex: 1, height: 1, background: `linear-gradient(90deg, ${ORO_SOFT}, transparent)` }} />
    </div>
  );
}
