"use client";

/**
 * CorrettoreBozzeSession — sessione "Il Correttore di Bozze".
 *
 * Estetica: bozza tipografica anni '60. Carta ingiallita con grana, testata
 * di giornale, caratteri serif "da stampa".
 *
 * Modello A: timer di sessione 60s gestito da page.tsx. Niente T.Lim sul
 * singolo trial (l'utente legge con calma). Quando `tempoScaduto` diventa
 * true, completiamo il trial in corso (o l'ISI) e chiamiamo onComplete.
 */

import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { SessionResult } from "@/lib/exercise-types";
import { type CorrettoreLevelConfig } from "./levels";
import {
  filtraCorpus,
  type ItemBozza,
  type TipoErrore,
} from "./bozze";

// ── Palette tipografica ─────────────────────────────────────────────────────
const PAPER       = "#F0E4C8";
const PAPER_SHADE = "#E5D6AE";
const INK         = "#1F1A12";
const INK_FADED   = "#5A4C32";
const RULE        = "#7A6240";
const OK          = "#3F6A2E";
const ERR         = "#A12A1F";
const STAMP_RED   = "#8B2A1C";

const SERIF_HEAD  = "'Playfair Display', 'Times New Roman', Georgia, serif";
const SERIF_BODY  = "'Libre Caslon Text', 'Times New Roman', Georgia, serif";
const MONO        = "'Courier New', 'Consolas', monospace";
const SANS_LABEL  = "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

// ── Anti-ripetizione cross-sessione ─────────────────────────────────────────
const VISTI_STORAGE_KEY = "vm_correttore_visti_v1";
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
    /* ignora */
  }
}

// ── CSS ─────────────────────────────────────────────────────────────────────
const ANIM_CSS = `
@keyframes cb-paper-in {
  0%   { transform: translateY(10px); opacity: 0; }
  100% { transform: translateY(0);    opacity: 1; }
}
@keyframes cb-stamp-in {
  0%   { transform: rotate(-8deg) scale(2); opacity: 0; }
  60%  { transform: rotate(-8deg) scale(0.95); opacity: 0.95; }
  100% { transform: rotate(-8deg) scale(1); opacity: 0.9; }
}
@keyframes cb-shake {
  0%, 100% { transform: translateX(0); }
  25%      { transform: translateX(-3px); }
  75%      { transform: translateX(3px); }
}
`;

// ── Tipi runtime ────────────────────────────────────────────────────────────

type Fase = "lettura" | "feedback" | "isi";

interface TrialState {
  numero:      number;
  bozza:       ItemBozza;
  startedAt:   number;
  scelta:      number | null;
  /** true = errore trovato; false = falso allarme; null = omissione (T.Lim scaduto). */
  corretto:    boolean | null;
  /** true se il trial è terminato per T.Lim scaduto. */
  omissione:   boolean;
}

interface Props {
  config:       CorrettoreLevelConfig;
  tempoScaduto: boolean;
  onReady:      () => void;
  onComplete:   (r: SessionResult) => void;
}

// ── Utility ─────────────────────────────────────────────────────────────────

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function numeroRomano(n: number): string {
  const map: Array<[number, string]> = [
    [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
    [10, "X"],  [9, "IX"],  [5, "V"],  [4, "IV"], [1, "I"],
  ];
  let s = "";
  for (const [v, sym] of map) {
    while (n >= v) { s += sym; n -= v; }
  }
  return s;
}

// ────────────────────────────────────────────────────────────────────────────

export function CorrettoreBozzeSession({ config, tempoScaduto, onReady, onComplete }: Props) {
  const configRef = useRef(config);
  useLayoutEffect(() => { configRef.current = config; }, [config]);

  const poolRef = useRef<readonly ItemBozza[]>(
    filtraCorpus(config.difficoltaMin, config.difficoltaMax, config.tipiErrore),
  );
  const vistiRef = useRef<string[]>(caricaVisti());
  const sessionVistiRef = useRef<Set<string>>(new Set());

  const trialNumRef = useRef(0);

  const nuovoTrial = useCallback((): TrialState => {
    trialNumRef.current++;
    const pool = poolRef.current;
    const sessionSet = sessionVistiRef.current;
    const vistiSet = new Set(vistiRef.current);
    const freschi      = pool.filter((b) => !sessionSet.has(b.id) && !vistiSet.has(b.id));
    const fuoriSession = pool.filter((b) => !sessionSet.has(b.id));
    const candidati =
      freschi.length > 0       ? freschi      :
      fuoriSession.length > 0  ? fuoriSession :
                                  pool;
    const bozza = pick(candidati);
    sessionVistiRef.current.add(bozza.id);
    vistiRef.current.push(bozza.id);

    return {
      numero:    trialNumRef.current,
      bozza,
      startedAt: Date.now(),
      scelta:    null,
      corretto:  null,
      omissione: false,
    };
  }, []);

  const [trial, setTrial] = useState<TrialState | null>(null);
  const trialRef = useRef<TrialState | null>(null);
  useLayoutEffect(() => { trialRef.current = trial; }, [trial]);

  const [fase, setFase] = useState<Fase>("lettura");
  const faseRef = useRef<Fase>(fase);
  useLayoutEffect(() => { faseRef.current = fase; }, [fase]);

  // ── Metriche ──────────────────────────────────────────────────────────────
  const erroriTrovatiRef = useRef(0);
  const falsiAllarmiRef  = useRef(0);
  const omissioniRef     = useRef(0);
  const bozzeTotaliRef   = useRef(0);
  const tempiLetturaRef  = useRef<number[]>([]);

  const tot_sem_Ref      = useRef(0);
  const ok_sem_Ref       = useRef(0);
  const tot_sint_Ref     = useRef(0);
  const ok_sint_Ref      = useRef(0);

  // Tick del T.Lim — forziamo un re-render ~5 volte al secondo per la barra
  const [, setTick] = useState(0);
  useEffect(() => {
    if (completedRef.current) return;
    const id = setInterval(() => setTick((t) => t + 1), 200);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const completedRef  = useRef(false);
  const onCompleteRef = useRef(onComplete);
  useLayoutEffect(() => { onCompleteRef.current = onComplete; });

  useEffect(() => {
    onReady();
    setTrial(nuovoTrial());
    setFase("lettura");
  }, []); // eslint-disable-line

  // ── Click su parola ───────────────────────────────────────────────────────
  const handleClickParola = useCallback((idx: number) => {
    if (completedRef.current) return;
    if (faseRef.current !== "lettura") return;
    const t = trialRef.current;
    if (!t) return;
    const tok = t.bozza.tokens[idx];
    if (!tok || !tok.cliccabile) return;

    const tempo = Date.now() - t.startedAt;
    tempiLetturaRef.current.push(tempo);
    bozzeTotaliRef.current++;

    const corretto = tok.isErrore;
    const tipo: TipoErrore = t.bozza.tipo;

    if (corretto) {
      erroriTrovatiRef.current++;
      if (tipo === "semantico")  ok_sem_Ref.current++;
      if (tipo === "sintattico") ok_sint_Ref.current++;
    } else {
      falsiAllarmiRef.current++;
    }
    if (tipo === "semantico")  tot_sem_Ref.current++;
    if (tipo === "sintattico") tot_sint_Ref.current++;

    setTrial({ ...t, scelta: idx, corretto });
    setFase("feedback");
  }, []);

  // ── T.Lim per trial → omissione ──────────────────────────────────────────
  useEffect(() => {
    if (completedRef.current) return;
    if (fase !== "lettura") return;
    const t = trialRef.current;
    if (!t) return;
    const restante = configRef.current.tLimMs - (Date.now() - t.startedAt);
    if (restante <= 0) {
      // Tempo già scaduto (in caso di refresh stato)
      gestisciOmissione();
      return;
    }
    const tid = setTimeout(() => gestisciOmissione(), restante);
    return () => clearTimeout(tid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fase, trial?.numero]);

  const gestisciOmissione = useCallback(() => {
    if (completedRef.current) return;
    if (faseRef.current !== "lettura") return;
    const t = trialRef.current;
    if (!t) return;
    omissioniRef.current++;
    bozzeTotaliRef.current++;
    const tipo: TipoErrore = t.bozza.tipo;
    if (tipo === "semantico")  tot_sem_Ref.current++;
    if (tipo === "sintattico") tot_sint_Ref.current++;
    setTrial({ ...t, scelta: null, corretto: null, omissione: true });
    setFase("feedback");
  }, []);

  // Feedback → ISI (più lungo per leggere la correzione)
  useEffect(() => {
    if (fase !== "feedback") return;
    const tid = setTimeout(() => setFase("isi"), 1600);
    return () => clearTimeout(tid);
  }, [fase, trial?.numero]);

  // ISI → nuovo trial (se non è scaduto il timer di sessione)
  useEffect(() => {
    if (fase !== "isi") return;
    const tid = setTimeout(() => {
      if (completedRef.current) return;
      setTrial(nuovoTrial());
      setFase("lettura");
    }, 350);
    return () => clearTimeout(tid);
  }, [fase, nuovoTrial]);

  // ── Fine sessione: tempoScaduto → emette metriche ─────────────────────────
  useEffect(() => {
    if (!tempoScaduto || completedRef.current) return;
    completedRef.current = true;

    const hits = erroriTrovatiRef.current;
    const fa   = falsiAllarmiRef.current;
    const om   = omissioniRef.current;
    const tot  = hits + fa + om;
    const acc  = tot > 0 ? hits / tot : 0;

    const tempi = tempiLetturaRef.current;
    const tempoMedio = tempi.length > 0
      ? Math.round(tempi.reduce((a, b) => a + b, 0) / tempi.length)
      : 0;

    const accSem  = tot_sem_Ref.current  > 0 ? ok_sem_Ref.current  / tot_sem_Ref.current  : 0;
    const accSint = tot_sint_Ref.current > 0 ? ok_sint_Ref.current / tot_sint_Ref.current : 0;

    salvaVisti(vistiRef.current);

    onCompleteRef.current({
      accuratezzaValutativa: acc,
      scoreGrezzo:           hits,
      metriche: {
        bozze_totali:           bozzeTotaliRef.current,
        errori_trovati:         hits,
        falsi_allarmi:          fa,
        omissioni:              om,
        tempo_medio_lettura_ms: tempoMedio,
        semantici_totali:       tot_sem_Ref.current,
        semantici_corretti:     ok_sem_Ref.current,
        sintattici_totali:      tot_sint_Ref.current,
        sintattici_corretti:    ok_sint_Ref.current,
        accuratezza_semantica:  Math.round(accSem * 100),
        accuratezza_sintattica: Math.round(accSint * 100),
      },
    });
  }, [tempoScaduto]);

  // ── Render ────────────────────────────────────────────────────────────────
  if (!trial) {
    return <div style={{ minHeight: 400, backgroundColor: PAPER, borderRadius: "0.5rem" }} />;
  }

  return (
    <div style={{
      width: "100%",
      userSelect: "none",
      padding: "1.1rem 1.05rem 1.2rem 1.05rem",
      backgroundColor: PAPER,
      borderRadius: "0.5rem",
      fontFamily: SERIF_BODY,
      color: INK,
      backgroundImage:
        "radial-gradient(circle at 20% 25%, rgba(122,98,64,0.10) 0, transparent 35%)," +
        "radial-gradient(circle at 78% 70%, rgba(122,98,64,0.08) 0, transparent 38%)," +
        "radial-gradient(circle at 90% 15%, rgba(89,68,40,0.07) 0, transparent 22%)," +
        "repeating-linear-gradient(0deg, rgba(89,68,40,0.025) 0 1px, transparent 1px 4px)," +
        "repeating-linear-gradient(90deg, rgba(89,68,40,0.02) 0 1px, transparent 1px 6px)",
      boxShadow:
        "0 1px 3px rgba(0,0,0,0.15)," +
        "inset 0 0 22px rgba(122,98,64,0.18)",
    }}>
      <style>{ANIM_CSS}</style>

      {/* ── Testata ──────────────────────────────────────────────────────── */}
      <div style={{ textAlign: "center", borderBottom: `2px double ${RULE}`, paddingBottom: "0.55rem", marginBottom: "0.7rem" }}>
        <div style={{
          fontFamily: SANS_LABEL,
          fontSize: "0.6rem",
          letterSpacing: "0.28em",
          color: INK_FADED,
          fontWeight: 700,
          textTransform: "uppercase",
          marginBottom: "0.15rem",
        }}>
          · Tipografia Centrale · Anno MCMLXIV ·
        </div>
        <h1 style={{
          margin: 0,
          fontFamily: SERIF_HEAD,
          fontSize: "1.55rem",
          fontWeight: 900,
          color: INK,
          letterSpacing: "0.02em",
          lineHeight: 1.05,
        }}>
          LA GAZZETTA DEL MATTINO
        </h1>
        <div style={{
          fontFamily: SERIF_BODY,
          fontSize: "0.72rem",
          fontStyle: "italic",
          color: INK_FADED,
          marginTop: "0.12rem",
          letterSpacing: "0.03em",
        }}>
          edizione del correttore — bozza di stampa
        </div>
      </div>

      {/* ── Foglio bozza ─────────────────────────────────────────────────── */}
      <div
        key={`bozza-${trial.numero}`}
        style={{
          position: "relative",
          marginTop: "0.3rem",
          padding: "1rem 0.95rem 1.1rem 0.95rem",
          backgroundColor: PAPER_SHADE,
          border: `1px solid ${RULE}`,
          borderRadius: "0.3rem",
          boxShadow:
            "0 2px 4px rgba(0,0,0,0.10) inset," +
            "0 1px 0 rgba(255,255,255,0.4) inset",
          animation: "cb-paper-in 360ms ease-out",
          minHeight: 160,
          overflow: "hidden",
        }}
      >
        {/* Numero bozza + etichetta REVISIONE */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "0.55rem",
          paddingBottom: "0.4rem",
          borderBottom: `1px dashed ${RULE}`,
        }}>
          <span style={{
            fontFamily: MONO,
            fontSize: "0.7rem",
            color: INK_FADED,
            letterSpacing: "0.14em",
            fontWeight: 700,
          }}>
            BOZZA N° {numeroRomano(trial.numero)}
          </span>
          <span style={{
            fontFamily: SANS_LABEL,
            fontSize: "0.6rem",
            color: STAMP_RED,
            letterSpacing: "0.22em",
            fontWeight: 800,
            border: `1px solid ${STAMP_RED}`,
            padding: "1px 6px",
            borderRadius: 2,
          }}>
            REVISIONE
          </span>
        </div>

        {/* Barra T.Lim — discreta, stile tipografico (deadline di stampa) */}
        <BarraTLim
          startedAt={trial.startedAt}
          tLimMs={config.tLimMs}
          attiva={fase === "lettura"}
        />

        {/* Frase tokenizzata */}
        <p style={{
          margin: 0,
          fontSize: "1.35rem",       // > 20px su base 16px
          lineHeight: 1.85,
          fontFamily: SERIF_BODY,
          color: INK,
          textAlign: "left",
          letterSpacing: "0.005em",
          textShadow: "0 0 0.4px rgba(31,26,18,0.5)",
        }}>
          {trial.bozza.tokens.map((tok, idx) => (
            <ParolaToken
              key={idx}
              testo={tok.testo}
              cliccabile={tok.cliccabile && fase === "lettura"}
              isErrore={tok.isErrore}
              isScelta={trial.scelta === idx}
              feedbackVisibile={fase !== "lettura"}
              onClick={() => handleClickParola(idx)}
            />
          ))}
        </p>

        {/* Timbro di feedback */}
        {fase === "feedback" && trial.corretto === true && <Timbro esito="ok" />}
        {fase === "feedback" && (trial.corretto === false || trial.omissione) && <Timbro esito="ko" />}
      </div>

      {/* ── Pannello istruzione / feedback ───────────────────────────────── */}
      <div style={{
        marginTop: "0.85rem",
        padding: "0.65rem 0.8rem",
        borderTop: `1px solid ${RULE}`,
        borderBottom: `1px solid ${RULE}`,
        backgroundColor: "rgba(122,98,64,0.05)",
        minHeight: 56,
      }}>
        {fase === "lettura" && (
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            fontFamily: SERIF_BODY,
            color: INK_FADED,
            textAlign: "center",
            fontStyle: "italic",
          }}>
            Trovi la parola sbagliata? <span style={{ color: INK, fontWeight: 700, fontStyle: "normal" }}>
              Tocchi sulla parola da correggere.
            </span>
          </p>
        )}
        {fase === "feedback" && trial.corretto === true && (
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            fontFamily: SERIF_BODY,
            color: OK,
            textAlign: "center",
            fontWeight: 700,
          }}>
            Corretto. Avrebbe dovuto essere <span style={{ fontStyle: "italic" }}>«{trial.bozza.correzione}»</span>.
          </p>
        )}
        {fase === "feedback" && trial.corretto === false && (
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            fontFamily: SERIF_BODY,
            color: ERR,
            textAlign: "center",
            animation: "cb-shake 280ms ease-out",
          }}>
            L'errore era un'altra parola. La parola giusta era <span style={{ fontWeight: 700, fontStyle: "italic" }}>«{trial.bozza.correzione}»</span>.
          </p>
        )}
        {fase === "feedback" && trial.omissione && (
          <p style={{
            margin: 0,
            fontSize: "0.95rem",
            fontFamily: SERIF_BODY,
            color: ERR,
            textAlign: "center",
            fontStyle: "italic",
          }}>
            Tempo scaduto. La parola sbagliata era <span style={{ fontWeight: 700, fontStyle: "normal" }}>«{trial.bozza.tokens.find((t) => t.isErrore)?.testo}»</span> — andava sostituita con <span style={{ fontWeight: 700, fontStyle: "normal", color: OK }}>«{trial.bozza.correzione}»</span>.
          </p>
        )}
        {fase === "isi" && (
          <p style={{ margin: 0, fontSize: "0.9rem", color: INK_FADED, textAlign: "center", fontStyle: "italic" }}>
            Prossima bozza…
          </p>
        )}
      </div>
    </div>
  );
}

// ── Sotto-componenti ────────────────────────────────────────────────────────

function ParolaToken({
  testo,
  cliccabile,
  isErrore,
  isScelta,
  feedbackVisibile,
  onClick,
}: {
  testo:            string;
  cliccabile:       boolean;
  isErrore:         boolean;
  isScelta:         boolean;
  feedbackVisibile: boolean;
  onClick:          () => void;
}) {
  let bg     = "transparent";
  let color  = INK;
  let underline = false;
  let strike = false;

  if (feedbackVisibile) {
    if (isScelta && isErrore) {
      bg = "rgba(63,106,46,0.22)";
      color = OK;
      underline = true;
    } else if (isScelta && !isErrore) {
      bg = "rgba(161,42,31,0.18)";
      color = ERR;
      strike = true;
    } else if (!isScelta && isErrore) {
      color = ERR;
      underline = true;
    }
  }

  if (!cliccabile && !feedbackVisibile) {
    return <span style={{ color: INK }}>{testo}</span>;
  }

  const interagibile = cliccabile;
  const isPunteggiatura = !interagibile && !feedbackVisibile;
  const spazio = !isPunteggiatura ? " " : "";

  if (!interagibile) {
    const isPunto = /^[.,;:!?"«»]$/.test(testo);
    return (
      <>
        {!isPunto && " "}
        <span style={{
          backgroundColor: bg,
          color,
          textDecoration: [
            underline ? "underline" : "",
            strike    ? "line-through" : "",
          ].filter(Boolean).join(" "),
          textDecorationThickness: underline ? 2 : undefined,
          textUnderlineOffset: underline ? 4 : undefined,
          borderRadius: bg !== "transparent" ? 3 : 0,
          padding: bg !== "transparent" ? "1px 3px" : 0,
          fontWeight: bg !== "transparent" ? 700 : 400,
        }}>
          {testo}
        </span>
      </>
    );
  }

  return (
    <>
      {spazio}
      <span
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
        style={{
          display: "inline-block",
          padding: "4px 6px",
          margin: "0 1px",
          borderRadius: 4,
          cursor: "pointer",
          color: INK,
          backgroundColor: "transparent",
          WebkitTapHighlightColor: "rgba(122,98,64,0.25)",
          transition: "background-color 120ms",
          lineHeight: 1.2,
        }}
        onMouseEnter={(e) => { (e.currentTarget as HTMLSpanElement).style.backgroundColor = "rgba(122,98,64,0.18)"; }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLSpanElement).style.backgroundColor = "transparent"; }}
      >
        {testo}
      </span>
    </>
  );
}

function BarraTLim({
  startedAt,
  tLimMs,
  attiva,
}: {
  startedAt: number;
  tLimMs:    number;
  attiva:    boolean;
}) {
  const trascorso = Math.max(0, Date.now() - startedAt);
  const rimasto   = Math.max(0, tLimMs - trascorso);
  const pct       = Math.max(0, Math.min(100, (rimasto / tLimMs) * 100));
  // soglia rossa: ultimi 25%
  const allarme = pct < 25;
  return (
    <div style={{
      position: "relative",
      width: "100%",
      height: 4,
      backgroundColor: "rgba(122,98,64,0.18)",
      borderRadius: 2,
      marginBottom: "0.65rem",
      overflow: "hidden",
      opacity: attiva ? 1 : 0.35,
    }}>
      <div style={{
        position: "absolute",
        top: 0, left: 0, bottom: 0,
        width: `${pct}%`,
        backgroundColor: allarme ? STAMP_RED : INK_FADED,
        transition: "width 200ms linear, background-color 200ms",
      }} />
    </div>
  );
}

function Timbro({ esito }: { esito: "ok" | "ko" }) {
  const colore = esito === "ok" ? OK : STAMP_RED;
  const testo  = esito === "ok" ? "VISTO" : "ERRATO";
  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        top: 22,
        right: 14,
        padding: "4px 12px",
        border: `3px solid ${colore}`,
        color: colore,
        fontFamily: SANS_LABEL,
        fontWeight: 900,
        fontSize: "1rem",
        letterSpacing: "0.18em",
        opacity: 0.9,
        animation: "cb-stamp-in 320ms ease-out forwards",
        transformOrigin: "center",
        backgroundColor: "rgba(240,228,200,0.4)",
        pointerEvents: "none",
        borderRadius: 4,
      }}
    >
      {testo}
    </div>
  );
}
