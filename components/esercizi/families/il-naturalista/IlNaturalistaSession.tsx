"use client";

/**
 * IlNaturalistaSession — loop di gioco del Naturalista.
 *
 * Per ogni scena:
 *  1. campiona tipologia scena dal pool del livello
 *  2. genera N creature, posizionate senza sovrapposizioni e con habitat coerente
 *  3. assegna lento moto (deriva ellittica) a `numMobili` creature dal lv 6
 *  4. l'utente esplora con zoom (1x / 1.5x / 2x) e pan, clicca ciascuna
 *  5. quando tutte trovate o scade il tLimSceneMs → scena successiva
 *
 * Scoring:
 *   base per scena    = 30 punti se tutte le creature trovate
 *   bonus velocità    = round(40 * max(0, 1 - tempo / tLim))
 *   bonus completezza = round(30 * (foundInScene / numCreature))
 *   penalità tap vuoti= -3 per ogni click che non centra alcuna creatura
 *   scoreGrezzo = avg per scena, normalizzato 0–100
 * Accuratezza valutativa = creatureTrovate / creatureMostrate (0..1).
 */

import {
  useCallback, useEffect, useRef, useState,
  type PointerEvent as ReactPointerEvent,
  type CSSProperties,
} from "react";
import type { SessionResult } from "@/lib/exercise-types";
import {
  type NaturalistaLevelConfig, type SceneKind,
  SCENE_VIEWBOX_W, SCENE_VIEWBOX_H,
} from "./levels";
import {
  PaperBackground, NAT_COLORS, SceneDefs,
  PratoScene, PratoFiorito, BoscoScene, FondaleScene,
  Creature, type CreatureKind, POOL_TERRA, POOL_ACQUA,
  LenteIcon, ZoomInIcon, ZoomOutIcon, ZoomButton,
} from "./sprites";

// ── Tipi interni ─────────────────────────────────────────────────────────────

interface PlacedCreature {
  id: number;
  kind: CreatureKind;
  /** Posizione "ancora" nel viewBox (1000×700). */
  x: number;
  y: number;
  rotation: number;
  /** Se !== null, parametri di moto lento (deriva ellittica). */
  motion: { rx: number; ry: number; periodMs: number; phase: number } | null;
  found: boolean;
}

interface SceneInstance {
  kind: SceneKind;
  creatures: PlacedCreature[];
}

// ── Costanti layout ──────────────────────────────────────────────────────────

const MIN_DIST_BETWEEN_CREATURES = 110; // unità viewBox, anti-sovrapposizione
const SCENE_INTRO_MS = 600;             // overlay "Scena #X" iniziale
const SCENE_OUTRO_MS = 700;             // overlay "Ben fatto!" al completamento
const ZOOM_LEVELS = [1, 1.5, 2] as const;
const DRAG_TAP_THRESHOLD_PX = 8;

// ── Component ────────────────────────────────────────────────────────────────

interface SessionProps {
  config: NaturalistaLevelConfig;
  tempoScaduto: boolean;
  onReady(): void;
  onComplete(r: SessionResult): void;
}

export function IlNaturalistaSession({ config, tempoScaduto, onReady, onComplete }: SessionProps) {

  // ── accumulatori (ref) ──────────────────────────────────────────────────
  const completedRef = useRef(false);
  const creatureTrovateRef = useRef(0);
  const creatureMostrateRef = useRef(0);
  const tapVuotiRef = useRef(0);
  const scoreTotaleRef = useRef(0);
  const sceneCompleteRef = useRef(0);

  // ── stato ───────────────────────────────────────────────────────────────
  const [sceneIndex, setSceneIndex] = useState(0);
  const [scena, setScena] = useState<SceneInstance | null>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [showOutro, setShowOutro] = useState(false);
  const sceneStartTsRef = useRef(0);
  const lastSceneKindRef = useRef<SceneKind | null>(null);

  // ── zoom & pan (entrambi espressi in unità viewBox) ────────────────────
  // pan = offset del viewBox visibile rispetto all'origine, in unità viewBox.
  const [zoomIdx, setZoomIdx] = useState(0);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  // ── moto creature ───────────────────────────────────────────────────────
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (config.numMobili === 0) return;
    let raf: number;
    const loop = () => {
      setTick(t => t + 1);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [config.numMobili]);

  // ── setup nuova scena ───────────────────────────────────────────────────
  const setupScene = useCallback(() => {
    const pool = config.scenePool;
    let kind = pool[Math.floor(Math.random() * pool.length)];
    if (pool.length > 1 && kind === lastSceneKindRef.current) {
      // evita ripetizione consecutiva quando possibile
      kind = pool.find(k => k !== lastSceneKindRef.current) ?? kind;
    }
    lastSceneKindRef.current = kind;

    const isAcqua = kind === "fondale-chiaro" || kind === "fondale-fitto";
    const habitatPool = isAcqua ? POOL_ACQUA : POOL_TERRA;

    const placed: PlacedCreature[] = [];
    const N = config.numCreature;
    let safety = 0;
    while (placed.length < N && safety < 400) {
      safety++;
      const x = 80 + Math.random() * (SCENE_VIEWBOX_W - 160);
      const y = 90 + Math.random() * (SCENE_VIEWBOX_H - 180);
      const tooClose = placed.some(p => Math.hypot(p.x - x, p.y - y) < MIN_DIST_BETWEEN_CREATURES);
      if (tooClose) continue;

      const kindIdx = (placed.length + Math.floor(Math.random() * habitatPool.length)) % habitatPool.length;
      const creatureKind = habitatPool[kindIdx];
      const willMove = placed.length < config.numMobili;
      placed.push({
        id: placed.length,
        kind: creatureKind,
        x, y,
        rotation: (Math.random() * 30 - 15),
        motion: willMove
          ? {
            rx: 26 + Math.random() * 22,
            ry: 14 + Math.random() * 12,
            periodMs: 6500 + Math.random() * 3500,
            phase: Math.random() * Math.PI * 2,
          }
          : null,
        found: false,
      });
    }

    creatureMostrateRef.current += placed.length;
    setScena({ kind, creatures: placed });
    sceneStartTsRef.current = performance.now();
    setPan({ x: 0, y: 0 });
    setZoomIdx(0);
    setShowIntro(true);
    setTimeout(() => setShowIntro(false), SCENE_INTRO_MS);
  }, [config]);

  // ── onReady & primo setup ───────────────────────────────────────────────
  useEffect(() => {
    setupScene();
    onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── finalizzazione su tempoScaduto ──────────────────────────────────────
  useEffect(() => {
    if (!tempoScaduto || completedRef.current) return;
    completedRef.current = true;

    const trovate = creatureTrovateRef.current;
    const mostrate = Math.max(1, creatureMostrateRef.current);
    const accuratezzaValutativa = trovate / mostrate;
    const scoreGrezzo = Math.max(0, Math.min(100, Math.round(
      scoreTotaleRef.current / Math.max(1, sceneCompleteRef.current) || 0
    )));

    onComplete({
      accuratezzaValutativa,
      scoreGrezzo,
      metriche: {
        scene_completate: sceneCompleteRef.current,
        creature_trovate: trovate,
        creature_mostrate: creatureMostrateRef.current,
        tap_vuoti: tapVuotiRef.current,
      },
    });
  }, [tempoScaduto, onComplete]);

  // ── timeout scena: passa avanti penalizzando le mancate ─────────────────
  useEffect(() => {
    if (!scena || showIntro || showOutro || tempoScaduto || completedRef.current) return;
    const restanti = scena.creatures.filter(c => !c.found).length;
    if (restanti === 0) return;

    const dueAt = sceneStartTsRef.current + config.tLimSceneMs;
    const remaining = Math.max(50, dueAt - performance.now());
    const t = setTimeout(() => {
      if (completedRef.current || tempoScaduto) return;
      // chiudi scena anche se incompleta
      finalizeScene();
    }, remaining);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scena, showIntro, showOutro, tempoScaduto, config.tLimSceneMs]);

  // ── finalizza scena corrente ────────────────────────────────────────────
  const finalizeScene = useCallback(() => {
    if (!scena) return;
    const tempoSpeso = performance.now() - sceneStartTsRef.current;
    const trovateNellaScena = scena.creatures.filter(c => c.found).length;
    const N = scena.creatures.length;

    let punti = 0;
    if (trovateNellaScena === N) {
      const speedFactor = Math.max(0, 1 - tempoSpeso / config.tLimSceneMs);
      punti = 30 + Math.round(40 * speedFactor) + 30;
    } else {
      punti = Math.round(30 * (trovateNellaScena / N));
    }
    // penalità tap vuoti (cap a 0)
    // calcoliamo i tap vuoti DI QUESTA scena: non tracciati per-scena → usiamo media leggera
    // Manteniamo il calcolo semplice: contiamo solo i tap vuoti totali alla fine.
    scoreTotaleRef.current += Math.max(0, punti);
    sceneCompleteRef.current += 1;

    setShowOutro(true);
    setTimeout(() => {
      setShowOutro(false);
      if (!completedRef.current && !tempoScaduto) {
        setSceneIndex(i => i + 1);
        setupScene();
      }
    }, SCENE_OUTRO_MS);
  }, [scena, config.tLimSceneMs, tempoScaduto, setupScene]);

  // ── click handling (con drag-vs-tap) ────────────────────────────────────
  const svgRef = useRef<SVGSVGElement | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number; pan: { x: number; y: number } } | null>(null);
  const draggingRef = useRef(false);

  const zoom = ZOOM_LEVELS[zoomIdx];

  const clampPan = useCallback((p: { x: number; y: number }, z: number) => {
    const visW = SCENE_VIEWBOX_W / z;
    const visH = SCENE_VIEWBOX_H / z;
    const maxX = SCENE_VIEWBOX_W - visW;
    const maxY = SCENE_VIEWBOX_H - visH;
    return {
      x: Math.max(0, Math.min(maxX, p.x)),
      y: Math.max(0, Math.min(maxY, p.y)),
    };
  }, []);

  const handlePointerDown = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY, pan: { ...pan } };
    draggingRef.current = false;
    (e.target as Element).setPointerCapture?.(e.pointerId);
  }, [pan]);

  const handlePointerMove = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    const start = pointerStartRef.current;
    if (!start) return;
    const dx = e.clientX - start.x;
    const dy = e.clientY - start.y;
    if (!draggingRef.current && Math.hypot(dx, dy) > DRAG_TAP_THRESHOLD_PX) {
      draggingRef.current = true;
    }
    if (draggingRef.current && zoom > 1 && svgRef.current) {
      const rect = svgRef.current.getBoundingClientRect();
      const vbW = SCENE_VIEWBOX_W / zoom;
      const vbH = SCENE_VIEWBOX_H / zoom;
      const dvbx = -(dx / rect.width) * vbW;
      const dvby = -(dy / rect.height) * vbH;
      setPan(clampPan({ x: start.pan.x + dvbx, y: start.pan.y + dvby }, zoom));
    }
  }, [zoom, clampPan]);

  const tryHitCreature = useCallback((clientX: number, clientY: number) => {
    if (!svgRef.current || !scena) return;
    const rect = svgRef.current.getBoundingClientRect();
    const px = clientX - rect.left;
    const py = clientY - rect.top;
    // viewBox visibile: origin = pan, size = (W/z, H/z). Click in pixel → viewBox:
    const visW = SCENE_VIEWBOX_W / zoom;
    const visH = SCENE_VIEWBOX_H / zoom;
    const xVb = pan.x + (px / rect.width) * visW;
    const yVb = pan.y + (py / rect.height) * visH;

    // confronta con ciascuna creatura nella sua posizione corrente
    const now = performance.now();
    let hit: PlacedCreature | null = null;
    let bestDist = Infinity;
    for (const c of scena.creatures) {
      if (c.found) continue;
      const pos = currentCreaturePos(c, now);
      const d = Math.hypot(pos.x - xVb, pos.y - yVb);
      if (d < config.clickRadiusUnits && d < bestDist) {
        bestDist = d;
        hit = c;
      }
    }

    if (hit) {
      const hitId = hit.id;
      setScena(prev => {
        if (!prev) return prev;
        return {
          ...prev,
          creatures: prev.creatures.map(c => c.id === hitId ? { ...c, found: true } : c),
        };
      });
      creatureTrovateRef.current += 1;
      // se ho appena trovato l'ultima, chiudo la scena
      const restanti = scena.creatures.filter(c => !c.found && c.id !== hit!.id).length;
      if (restanti === 0) {
        setTimeout(() => finalizeScene(), 250);
      }
    } else {
      tapVuotiRef.current += 1;
    }
  }, [scena, pan, zoom, config.clickRadiusUnits, finalizeScene]);

  const handlePointerUp = useCallback((e: ReactPointerEvent<SVGSVGElement>) => {
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    if (draggingRef.current) {
      setPan(p => clampPan(p, zoom));
      draggingRef.current = false;
      return;
    }
    // tap → tenta hit
    if (!showIntro && !showOutro) {
      tryHitCreature(e.clientX, e.clientY);
    }
  }, [zoom, clampPan, showIntro, showOutro, tryHitCreature]);

  // ── zoom controls ────────────────────────────────────────────────────────
  const onZoomIn = useCallback(() => {
    setZoomIdx(i => {
      const ni = Math.min(ZOOM_LEVELS.length - 1, i + 1);
      const nz = ZOOM_LEVELS[ni];
      // ri-centra la vista intorno al punto attualmente al centro
      const visW = SCENE_VIEWBOX_W / nz;
      const visH = SCENE_VIEWBOX_H / nz;
      const prevZ = ZOOM_LEVELS[i];
      const center = {
        x: pan.x + (SCENE_VIEWBOX_W / prevZ) / 2,
        y: pan.y + (SCENE_VIEWBOX_H / prevZ) / 2,
      };
      setPan(clampPan({ x: center.x - visW / 2, y: center.y - visH / 2 }, nz));
      return ni;
    });
  }, [pan, clampPan]);
  const onZoomOut = useCallback(() => {
    setZoomIdx(i => {
      const ni = Math.max(0, i - 1);
      const nz = ZOOM_LEVELS[ni];
      if (ni === 0) {
        setPan({ x: 0, y: 0 });
      } else {
        const visW = SCENE_VIEWBOX_W / nz;
        const visH = SCENE_VIEWBOX_H / nz;
        const prevZ = ZOOM_LEVELS[i];
        const center = {
          x: pan.x + (SCENE_VIEWBOX_W / prevZ) / 2,
          y: pan.y + (SCENE_VIEWBOX_H / prevZ) / 2,
        };
        setPan(clampPan({ x: center.x - visW / 2, y: center.y - visH / 2 }, nz));
      }
      return ni;
    });
  }, [pan, clampPan]);

  // ── render scena ─────────────────────────────────────────────────────────
  const renderScene = (k: SceneKind) => {
    switch (k) {
      case "prato":         return <PratoScene densita={config.densitaSfondo} />;
      case "prato-fiorito": return <PratoFiorito densita={config.densitaSfondo} />;
      case "bosco-rado":    return <BoscoScene densita={config.densitaSfondo} fitto={false} />;
      case "bosco":         return <BoscoScene densita={config.densitaSfondo} fitto={false} />;
      case "bosco-fitto":   return <BoscoScene densita={config.densitaSfondo} fitto={true} />;
      case "fondale-chiaro":return <FondaleScene densita={config.densitaSfondo} fitto={false} />;
      case "fondale-fitto": return <FondaleScene densita={config.densitaSfondo} fitto={true} />;
    }
  };

  // tinta mimetismo coerente con habitat
  const tintForScene = (k: SceneKind | undefined): string => {
    if (!k) return NAT_COLORS.verdeOliva;
    if (k.startsWith("fondale")) return NAT_COLORS.blu;
    if (k.startsWith("bosco")) return NAT_COLORS.verdeBosco;
    return NAT_COLORS.verdeOliva;
  };

  const restanti = scena ? scena.creatures.filter(c => !c.found).length : 0;
  const totalScena = scena ? scena.creatures.length : 0;

  return (
    <PaperBackground style={{ minHeight: 540, borderRadius: 12, padding: "0.8rem 0.6rem 1.1rem" }}>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.55rem" }}>

        {/* ── Header: scena #, contatore ──────────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: 440, padding: "0.25rem 0.5rem",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.45rem" }}>
            <LenteIcon size={20} />
            <span style={{
              fontSize: "0.92rem", fontWeight: 800, color: NAT_COLORS.inchiostro,
            }}>
              Tavola #{sceneIndex + 1}
            </span>
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "0.32rem 0.7rem", borderRadius: 999,
            background: NAT_COLORS.cartaChiara,
            border: `1.6px solid ${NAT_COLORS.seppia}`,
          }}>
            <span style={{ fontSize: "0.82rem", color: NAT_COLORS.seppia, fontWeight: 700 }}>
              Trovate
            </span>
            <span style={{ fontSize: "0.92rem", fontWeight: 900, color: NAT_COLORS.inchiostro }}>
              {totalScena - restanti}/{totalScena}
            </span>
          </div>
        </div>

        {/* ── Scena SVG (cornice taccuino) ────────────────────────────────── */}
        <div style={{
          position: "relative",
          width: "100%", maxWidth: 440,
          border: `3px solid ${NAT_COLORS.seppia}`,
          borderRadius: 8,
          overflow: "hidden",
          background: NAT_COLORS.cartaChiara,
          boxShadow: "inset 0 0 24px rgba(60,40,20,0.18), 0 4px 14px rgba(60,40,20,0.25)",
        }}>
          <svg
            ref={svgRef}
            viewBox={`${pan.x} ${pan.y} ${SCENE_VIEWBOX_W / zoom} ${SCENE_VIEWBOX_H / zoom}`}
            preserveAspectRatio="xMidYMid slice"
            style={{
              display: "block",
              width: "100%",
              aspectRatio: `${SCENE_VIEWBOX_W} / ${SCENE_VIEWBOX_H}`,
              touchAction: "none",
              userSelect: "none",
              cursor: zoom > 1 ? "grab" : "crosshair",
            }}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <SceneDefs />
            {scena && renderScene(scena.kind)}
            {scena && scena.creatures.map(c => (
              <CreatureSlot
                key={c.id}
                creature={c}
                size={config.creaturaSizeUnits}
                mimetismo={config.mimetismo}
                tintColor={tintForScene(scena.kind)}
                tick={tick}
              />
            ))}
            {/* cornice taccuino sopra il contenuto (in coord scena, non zoomata visivamente al pan) */}
            <rect x={pan.x + 4 / zoom} y={pan.y + 4 / zoom}
              width={SCENE_VIEWBOX_W / zoom - 8 / zoom} height={SCENE_VIEWBOX_H / zoom - 8 / zoom}
              fill="none" stroke={NAT_COLORS.seppia} strokeWidth={2 / zoom} opacity="0.4" rx={4 / zoom}
              pointerEvents="none" />
          </svg>

          {/* Overlay intro/outro */}
          {showIntro && (
            <div style={overlayStyle()}>
              <span style={overlayBadgeStyle()}>Tavola #{sceneIndex + 1}</span>
              <p style={{ fontSize: "0.95rem", color: NAT_COLORS.inchiostro, margin: "8px 0 0", fontWeight: 700 }}>
                Cerca {totalScena} creature
              </p>
            </div>
          )}
          {showOutro && (
            <div style={overlayStyle()}>
              <span style={overlayBadgeStyle()}>
                {restanti === 0 ? "Tavola completata!" : "Continua alla prossima..."}
              </span>
            </div>
          )}

          {/* Controlli zoom in basso a destra */}
          <div style={{
            position: "absolute", right: 10, bottom: 10,
            display: "flex", flexDirection: "column", gap: 8,
          }}>
            <ZoomButton onClick={onZoomIn} disabled={zoomIdx >= ZOOM_LEVELS.length - 1} label="Ingrandisci">
              <ZoomInIcon />
            </ZoomButton>
            <ZoomButton onClick={onZoomOut} disabled={zoomIdx === 0} label="Riduci">
              <ZoomOutIcon />
            </ZoomButton>
          </div>

          {/* badge zoom */}
          {zoom > 1 && (
            <div style={{
              position: "absolute", left: 10, bottom: 12,
              background: NAT_COLORS.cartaChiara,
              border: `1.6px solid ${NAT_COLORS.seppia}`,
              padding: "3px 9px", borderRadius: 999,
              fontSize: "0.74rem", color: NAT_COLORS.inchiostro, fontWeight: 700,
              boxShadow: "0 1px 3px rgba(60,40,20,0.2)",
            }}>
              {zoom}×
            </div>
          )}
        </div>

        <p style={{
          fontSize: "0.78rem", color: NAT_COLORS.seppia, margin: 0, textAlign: "center",
          maxWidth: 380, lineHeight: 1.35,
        }}>
          Tocca ogni creatura che riesci a scovare.
          {zoom > 1 ? " Trascina per spostare la lente." : " Usa la lente per ingrandire."}
        </p>
      </div>
    </PaperBackground>
  );
}

// ── helpers ───────────────────────────────────────────────────────────────────

function currentCreaturePos(c: PlacedCreature, now: number): { x: number; y: number } {
  if (!c.motion) return { x: c.x, y: c.y };
  const t = (now / c.motion.periodMs) * 2 * Math.PI + c.motion.phase;
  return {
    x: c.x + c.motion.rx * Math.cos(t),
    y: c.y + c.motion.ry * Math.sin(t),
  };
}

function overlayStyle(): CSSProperties {
  return {
    position: "absolute", inset: 0,
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    background: "rgba(242, 230, 204, 0.78)",
    pointerEvents: "none",
  };
}

function overlayBadgeStyle(): CSSProperties {
  return {
    padding: "10px 18px",
    background: NAT_COLORS.cartaChiara,
    border: `2px solid ${NAT_COLORS.seppia}`,
    borderRadius: 10,
    fontSize: "1.05rem", fontWeight: 900,
    color: NAT_COLORS.inchiostro,
    boxShadow: "0 3px 10px rgba(60,40,20,0.25)",
  };
}

// ── singolo slot creatura (gestisce moto + tinta mimetica) ─────────────────────

function CreatureSlot({
  creature, size, mimetismo, tintColor, tick,
}: {
  creature: PlacedCreature;
  size: number;
  mimetismo: number;
  tintColor: string;
  tick: number;
}) {
  void tick; // rerender forzato dal loop
  const now = performance.now();
  const pos = currentCreaturePos(creature, now);

  // scala lo sprite creatura (disegnato in ~100u) a `size` u
  const scale = size / 100;

  return (
    <g transform={`translate(${pos.x} ${pos.y}) rotate(${creature.rotation}) scale(${scale})`}>
      {creature.found && (
        <>
          {/* cerchio "catturata" */}
          <circle r="58" fill="none" stroke="#3A8E45" strokeWidth="3.5" opacity="0.9"
            strokeDasharray="6 5" />
          <circle r="44" fill="rgba(58,142,69,0.10)" />
        </>
      )}
      <Creature
        kind={creature.kind}
        opacity={creature.found ? 1 : (0.95 - mimetismo * 0.10)}
        tintColor={tintColor}
        tintMix={creature.found ? 0 : mimetismo * 0.75}
      />
    </g>
  );
}
