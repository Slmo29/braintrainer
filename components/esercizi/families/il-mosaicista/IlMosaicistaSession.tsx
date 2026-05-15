"use client";

/**
 * IlMosaicistaSession — loop di gioco del Mosaicista.
 *
 * Per ogni mosaico:
 *  1. genera/scegli mosaico in base al livello
 *  2. assegna a ciascun frammento eventuale rotazione iniziale (livello 8+)
 *  3. mescola pool, l'utente trascina i frammenti sul board
 *  4. drag con pointer events: tap = ruota 90°, drag = move + snap magnetico
 *  5. tutti piazzati → animazione lucidatura 800ms → next mosaico
 *
 * Punteggio composito per mosaico:
 *   base = 50 (se mosaico completato senza alcun errore di drop)
 *   bonus_velocità = round(50 * max(0, 1 - tempo_speso / tLimMosaicoMs))
 *   penalità errori = - 4 per ogni drop sbagliato (cap a 0)
 *
 * Accuratezza valutativa = correctDrops / totalDrops (0..1) su tutti i drop
 * della sessione.
 */

import {
  useCallback, useEffect, useRef, useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import type { SessionResult } from "@/lib/exercise-types";
import {
  type MosaicistaLevelConfig,
  SNAP_RADIUS_FRACTION,
} from "./levels";
import {
  type MosaicDef, type MosaicCell,
  generateProceduralMosaic, pickCuratedMosaic,
} from "./mosaics";
import {
  AtelierBackground, MosaicCellRenderer, MosaicPreview,
  LucidaturaOverlay, RotateIcon,
} from "./sprites";

// ── Stato fragment del pool ────────────────────────────────────────────────

type RotationDeg = 0 | 90 | 180 | 270;

interface PoolFragment {
  /** Chiave stabile = `${col}-${row}` del mosaico. */
  key: string;
  cell: MosaicCell;
  rotation: RotationDeg;
  /** Ordine corrente nel pool (per layout). */
  poolIndex: number;
  /** True se piazzato sul board (più dentro al pool). */
  placed: boolean;
}

interface BoardSlot {
  key: string;
  cell: MosaicCell;
  occupatoDa: string | null;  // key del fragment piazzato
}

// ── Layout costanti ────────────────────────────────────────────────────────

const BOARD_GAP_PX = 4;
const POOL_GAP_PX = 8;
const POOL_ROWS_MAX = 3;
const DRAG_TAP_THRESHOLD_PX = 7;
const FINGER_OFFSET_Y = -42;  // frammento sopra il dito durante il drag

// ── Component ──────────────────────────────────────────────────────────────

interface SessionProps {
  config: MosaicistaLevelConfig;
  tempoScaduto: boolean;
  onReady(): void;
  onComplete(r: SessionResult): void;
}

export function IlMosaicistaSession({ config, tempoScaduto, onReady, onComplete }: SessionProps) {

  // ── Stato sessione (refs per accumulatori, state per render) ─────────────
  const totalDropsRef = useRef(0);
  const correctDropsRef = useRef(0);
  const mosaiciCompletatiRef = useRef(0);
  const mosaiciSenzaErroriRef = useRef(0);
  const scoreTotaleRef = useRef(0);
  const completedRef = useRef(false);

  const [mosaicIndex, setMosaicIndex] = useState(0);
  const [currentMosaic, setCurrentMosaic] = useState<MosaicDef | null>(null);
  const [pool, setPool] = useState<PoolFragment[]>([]);
  const [slots, setSlots] = useState<BoardSlot[]>([]);
  const lastMosaicIdRef = useRef<string | undefined>(undefined);
  const mosaicStartTsRef = useRef<number>(0);
  const erroriMosaicoCorrenteRef = useRef(0);
  const [showLucida, setShowLucida] = useState(false);
  const [fase, setFase] = useState<"preview" | "playing">("preview");
  const [previewElapsedPct, setPreviewElapsedPct] = useState(0);

  // ── Drag state ───────────────────────────────────────────────────────────
  const [dragKey, setDragKey] = useState<string | null>(null);
  const dragStartRef = useRef<{ x: number; y: number } | null>(null);
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null);
  const [hoverSlotKey, setHoverSlotKey] = useState<string | null>(null);
  const [wrongFlash, setWrongFlash] = useState<string | null>(null);  // key fragment

  // ── Refs sincronizzati con state (fonte fresca dentro handler window) ─────
  const poolRef = useRef<PoolFragment[]>([]);
  const slotsRef = useRef<BoardSlot[]>([]);
  useEffect(() => { poolRef.current = pool; }, [pool]);
  useEffect(() => { slotsRef.current = slots; }, [slots]);

  // ── Refs DOM per snap ─────────────────────────────────────────────────────
  const stageRef = useRef<HTMLDivElement | null>(null);
  const slotRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // ── Genera mosaico ───────────────────────────────────────────────────────
  const setupMosaic = useCallback(() => {
    const numFrags =
      config.fragmentsMin === config.fragmentsMax
        ? config.fragmentsMin
        : config.fragmentsMin + Math.floor(Math.random() * (config.fragmentsMax - config.fragmentsMin + 1));

    let m: MosaicDef;
    if (config.source === "procedural") {
      m = generateProceduralMosaic(config.livello);
    } else {
      m = pickCuratedMosaic(config.fragmentsMin, config.fragmentsMax, lastMosaicIdRef.current);
    }
    lastMosaicIdRef.current = m.id;

    // build slots
    const newSlots: BoardSlot[] = m.cells.map(c => ({
      key: `${c.col}-${c.row}`,
      cell: c,
      occupatoDa: null,
    }));

    // build pool (rotazione iniziale solo per cells con shape non-solid:
    // ruotare una tessera "solid" è invisibile e non aggiunge difficoltà)
    const rotated: PoolFragment[] = m.cells.map(c => {
      let rot: RotationDeg = 0;
      if (
        config.rotazioneAttiva &&
        c.shape !== "solid" &&
        Math.random() < config.rotazioneRatio
      ) {
        const opts: RotationDeg[] = [90, 180, 270];
        rot = opts[Math.floor(Math.random() * opts.length)];
      }
      return {
        key: `${c.col}-${c.row}`,
        cell: c,
        rotation: rot,
        poolIndex: 0,
        placed: false,
      };
    });
    // mescola pool
    for (let i = rotated.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [rotated[i], rotated[j]] = [rotated[j], rotated[i]];
    }
    rotated.forEach((f, idx) => { f.poolIndex = idx; });

    setCurrentMosaic(m);
    setSlots(newSlots);
    setPool(rotated);
    erroriMosaicoCorrenteRef.current = 0;
    // mosaicStartTsRef sarà settato al passaggio preview → playing
    slotRefs.current.clear();
    setFase("preview");
    setPreviewElapsedPct(0);

    // suppress unused (numFrags solo per chiarezza intent)
    void numFrags;
  }, [config]);

  // ── onReady all'avvio ─────────────────────────────────────────────────────
  useEffect(() => {
    setupMosaic();
    onReady();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Countdown della fase preview ──────────────────────────────────────────
  useEffect(() => {
    if (fase !== "preview" || !currentMosaic) return;
    const startTs = performance.now();
    const totalMs = config.previewMs;

    let raf = 0;
    const tick = () => {
      const elapsed = performance.now() - startTs;
      const pct = Math.min(1, elapsed / totalMs);
      setPreviewElapsedPct(pct);
      if (elapsed >= totalMs) {
        // passa alla fase di gioco
        mosaicStartTsRef.current = performance.now();
        setFase("playing");
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [fase, currentMosaic, config.previewMs]);

  // ── Finalizzazione su tempoScaduto ────────────────────────────────────────
  useEffect(() => {
    if (!tempoScaduto || completedRef.current) return;
    completedRef.current = true;

    const totalDrops = Math.max(1, totalDropsRef.current);
    const accuratezzaValutativa = correctDropsRef.current / totalDrops;
    const scoreGrezzo = Math.min(100, Math.round(
      scoreTotaleRef.current / Math.max(1, mosaiciCompletatiRef.current * 100) * 100
    ));

    onComplete({
      accuratezzaValutativa,
      scoreGrezzo: isFinite(scoreGrezzo) ? scoreGrezzo : 0,
      metriche: {
        mosaici_completati: mosaiciCompletatiRef.current,
        mosaici_senza_errori: mosaiciSenzaErroriRef.current,
        drop_corretti: correctDropsRef.current,
        drop_totali: totalDropsRef.current,
        livello_speed_bonus_avg: scoreTotaleRef.current,
      },
    });
  }, [tempoScaduto, onComplete]);

  // ── Completamento mosaico corrente ────────────────────────────────────────
  const completeMosaic = useCallback(() => {
    if (!currentMosaic) return;
    const tempoSpesoMs = performance.now() - mosaicStartTsRef.current;
    const errori = erroriMosaicoCorrenteRef.current;

    // score composito
    let punti = 0;
    if (errori === 0) {
      const base = 50;
      const speedFactor = Math.max(0, 1 - tempoSpesoMs / config.tLimMosaicoMs);
      const bonus = Math.round(50 * speedFactor);
      punti = base + bonus;
      mosaiciSenzaErroriRef.current += 1;
    } else {
      punti = Math.max(0, 50 - errori * 4);
    }
    scoreTotaleRef.current += punti;
    mosaiciCompletatiRef.current += 1;

    setShowLucida(true);
    setTimeout(() => {
      setShowLucida(false);
      if (!completedRef.current && !tempoScaduto) {
        setMosaicIndex(i => i + 1);
        setupMosaic();
      }
    }, 850);
  }, [currentMosaic, config.tLimMosaicoMs, setupMosaic, tempoScaduto]);

  // ── Drag logic ────────────────────────────────────────────────────────────

  const findNearestSlot = useCallback((x: number, y: number): { key: string; dist: number } | null => {
    let best: { key: string; dist: number } | null = null;
    slotRefs.current.forEach((el, key) => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(x - cx, y - cy);
      if (best === null || d < best.dist) best = { key, dist: d };
    });
    return best;
  }, []);

  const flashWrong = useCallback((key: string) => {
    setWrongFlash(key);
    setTimeout(() => setWrongFlash(prev => prev === key ? null : prev), 320);
  }, []);

  /** Inizia drag (chiamato dall'onPointerDown del fragment nel pool). */
  const handlePointerDown = useCallback((e: ReactPointerEvent, key: string) => {
    if (showLucida || fase !== "playing") return;
    const f = poolRef.current.find(p => p.key === key);
    if (!f || f.placed) return;
    e.preventDefault();
    dragStartRef.current = { x: e.clientX, y: e.clientY };
    setDragKey(key);
    setDragPos({ x: e.clientX, y: e.clientY + FINGER_OFFSET_Y });
  }, [showLucida, fase]);

  // ── Window listeners attivi solo durante drag ─────────────────────────────
  useEffect(() => {
    if (!dragKey) return;

    const snapRadius = config.cellSizePx * SNAP_RADIUS_FRACTION;

    const onMove = (ev: PointerEvent) => {
      setDragPos({ x: ev.clientX, y: ev.clientY + FINGER_OFFSET_Y });
      const nearest = findNearestSlot(ev.clientX, ev.clientY + FINGER_OFFSET_Y);
      if (nearest && nearest.dist <= snapRadius) {
        const slot = slotsRef.current.find(s => s.key === nearest.key);
        if (slot && !slot.occupatoDa) {
          setHoverSlotKey(nearest.key);
          return;
        }
      }
      setHoverSlotKey(null);
    };

    const onUp = (ev: PointerEvent) => {
      const start = dragStartRef.current;
      const draggedKey = dragKey;
      // cleanup PRIMA della logica per evitare doppi fire
      setDragKey(null);
      setDragPos(null);
      setHoverSlotKey(null);
      dragStartRef.current = null;

      if (!start) return;
      const fragment = poolRef.current.find(p => p.key === draggedKey);
      if (!fragment) return;

      const dist = Math.hypot(ev.clientX - start.x, ev.clientY - start.y);

      // tap (no drag): rotazione se attiva
      if (dist < DRAG_TAP_THRESHOLD_PX) {
        if (config.rotazioneAttiva && fragment.rotation !== 0) {
          setPool(prev => prev.map(p =>
            p.key === draggedKey
              ? { ...p, rotation: ((p.rotation + 90) % 360) as RotationDeg }
              : p
          ));
        }
        return;
      }

      // drop: trova slot più vicino
      const dropY = ev.clientY + FINGER_OFFSET_Y;
      const nearest = findNearestSlot(ev.clientX, dropY);
      totalDropsRef.current += 1;

      if (!nearest || nearest.dist > snapRadius) {
        erroriMosaicoCorrenteRef.current += 1;
        flashWrong(draggedKey);
        return;
      }

      const targetSlot = slotsRef.current.find(s => s.key === nearest.key);
      if (!targetSlot) return;

      if (targetSlot.occupatoDa) {
        erroriMosaicoCorrenteRef.current += 1;
        flashWrong(draggedKey);
        return;
      }

      // match per equivalenza visiva: colore + shape (+ rotazione se shape non-solid)
      const fc = fragment.cell;
      const sc = targetSlot.cell;
      const sameColor = fc.color === sc.color && fc.color2 === sc.color2;
      const sameShape = fc.shape === sc.shape;
      // per shape "solid" la rotazione è invisibile → sempre ok;
      // per shape diagonal la rotazione del frammento deve essere 0
      const rotationOk = sc.shape === "solid" ? true : fragment.rotation === 0;

      if (!sameColor || !sameShape || !rotationOk) {
        erroriMosaicoCorrenteRef.current += 1;
        flashWrong(draggedKey);
        return;
      }

      // SUCCESSO
      correctDropsRef.current += 1;
      let mosaicoCompleto = false;
      setSlots(prev => {
        const next = prev.map(s =>
          s.key === targetSlot.key ? { ...s, occupatoDa: draggedKey } : s
        );
        // check completamento mosaico via stato NUOVO degli slot
        mosaicoCompleto = next.every(s => s.occupatoDa !== null);
        return next;
      });
      setPool(prev => prev.map(p =>
        p.key === draggedKey ? { ...p, placed: true } : p
      ));

      if (mosaicoCompleto) {
        setTimeout(() => completeMosaic(), 180);
      }
    };

    const onCancel = (ev: PointerEvent) => onUp(ev);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onCancel);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onCancel);
    };
  }, [dragKey, config.cellSizePx, config.rotazioneAttiva, findNearestSlot, flashWrong, completeMosaic]);

  // ── Render ─────────────────────────────────────────────────────────────────

  if (!currentMosaic) {
    return <div style={{ minHeight: 500 }} />;
  }

  const cellPx = config.cellSizePx;
  const boardWidth = currentMosaic.cols * cellPx + (currentMosaic.cols - 1) * BOARD_GAP_PX;
  const boardHeight = currentMosaic.rows * cellPx + (currentMosaic.rows - 1) * BOARD_GAP_PX;
  const draggingFragment = dragKey ? pool.find(p => p.key === dragKey) : null;
  const visiblePool = pool.filter(p => !p.placed);

  return (
    <AtelierBackground style={{ minHeight: 540, borderRadius: 12, padding: "0.8rem 0.6rem 1.1rem" }}>
      <div
        ref={stageRef}
        style={{
          position: "relative",
          touchAction: "none",
          userSelect: "none",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "0.7rem",
        }}
      >
        {/* ── Header: anteprima + mosaico # ───────────────────────────────── */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          width: "100%", maxWidth: 380, padding: "0.3rem 0.4rem",
        }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <span style={{
              fontSize: "0.66rem", fontWeight: 700, color: "#6B4F2A",
              letterSpacing: "0.06em",
            }}>
              {fase === "preview" ? "MEMORIZZA" : "DA MEMORIA"}
            </span>
            {fase === "preview" ? (
              <MosaicPreview mosaic={currentMosaic} sizePx={88} />
            ) : (
              <div
                style={{
                  width: 88, height: 88,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  background: "rgba(58,38,20,0.18)",
                  border: "1.5px dashed #8B5A2B",
                  borderRadius: 6,
                  fontSize: "1.8rem", color: "#8B5A2B",
                }}
                aria-label="Modello nascosto"
              >
                ?
              </div>
            )}
          </div>

          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
            fontSize: "0.78rem", color: "#3F2E1C",
          }}>
            <span style={{ fontWeight: 700, fontSize: "0.95rem" }}>{currentMosaic.nome}</span>
            <span style={{ fontSize: "0.72rem", color: "#6B4F2A" }}>
              Mosaico #{mosaicIndex + 1}
            </span>
            {config.rotazioneAttiva && (
              <span style={{
                marginTop: 4, padding: "2px 8px",
                background: "#FFF8EC", borderRadius: 999,
                border: "1.2px solid #C6A476",
                fontSize: "0.68rem", color: "#6B4F2A", fontWeight: 700,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <RotateIcon size={14} /> Tocca per ruotare
              </span>
            )}
          </div>
        </div>

        {/* ── Board ───────────────────────────────────────────────────────── */}
        <div style={{ position: "relative" }}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${currentMosaic.cols}, ${cellPx}px)`,
              gridTemplateRows: `repeat(${currentMosaic.rows}, ${cellPx}px)`,
              gap: BOARD_GAP_PX,
              padding: 10,
              background: "rgba(58, 38, 20, 0.10)",
              border: "2px solid #8B5A2B",
              borderRadius: 8,
              boxShadow: "inset 0 2px 8px rgba(60,40,20,0.18)",
            }}
          >
            {slots.map((slot) => {
              const filled = slot.occupatoDa
                ? pool.find(p => p.key === slot.occupatoDa)
                : null;
              const isHover = hoverSlotKey === slot.key && !slot.occupatoDa;
              return (
                <div
                  key={slot.key}
                  ref={(el) => {
                    if (el) slotRefs.current.set(slot.key, el);
                    else slotRefs.current.delete(slot.key);
                  }}
                  style={{
                    gridColumn: slot.cell.col + 1,
                    gridRow: slot.cell.row + 1,
                    width: cellPx,
                    height: cellPx,
                  }}
                >
                  {filled ? (
                    <MosaicCellRenderer cell={slot.cell} sizePx={cellPx} highlight="placed" />
                  ) : (
                    <div
                      style={{
                        width: cellPx,
                        height: cellPx,
                        borderRadius: 4,
                        border: isHover
                          ? "3px dashed #3A8E45"
                          : "2px dashed rgba(110,72,32,0.45)",
                        background: isHover
                          ? "rgba(58,142,69,0.10)"
                          : "rgba(255,250,235,0.18)",
                        boxSizing: "border-box",
                        transition: "border-color 80ms, background 80ms",
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {showLucida && <LucidaturaOverlay width={boardWidth + 20} height={boardHeight + 20} />}

          {/* Overlay preview: mostra il mosaico completo per previewMs ms */}
          {fase === "preview" && (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "0.7rem",
                background: "rgba(255, 248, 230, 0.96)",
                border: "2px solid #8B5A2B",
                borderRadius: 8,
                padding: "0.6rem",
                zIndex: 5,
              }}
            >
              <div style={{
                fontSize: "0.72rem", fontWeight: 800, color: "#6B4F2A",
                letterSpacing: "0.08em",
              }}>
                MEMORIZZA IL MODELLO
              </div>

              {/* Anteprima del mosaico, ridimensionata per stare nel board */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: `repeat(${currentMosaic.cols}, ${cellPx}px)`,
                  gridTemplateRows: `repeat(${currentMosaic.rows}, ${cellPx}px)`,
                  gap: BOARD_GAP_PX,
                }}
              >
                {currentMosaic.cells.map((c) => (
                  <div
                    key={`${c.col}-${c.row}`}
                    style={{ gridColumn: c.col + 1, gridRow: c.row + 1 }}
                  >
                    <MosaicCellRenderer cell={c} sizePx={cellPx} highlight="placed" />
                  </div>
                ))}
              </div>

              {/* Barra countdown */}
              <div style={{
                width: "85%", height: 8, borderRadius: 999,
                background: "rgba(110,72,32,0.18)",
                overflow: "hidden",
              }}>
                <div style={{
                  width: `${Math.round((1 - previewElapsedPct) * 100)}%`,
                  height: "100%",
                  background: "#8B5A2B",
                  transition: "width 80ms linear",
                }} />
              </div>
              <div style={{ fontSize: "0.78rem", color: "#6B4F2A" }}>
                {Math.max(0, Math.ceil((1 - previewElapsedPct) * (config.previewMs / 1000)))}s
              </div>
            </div>
          )}
        </div>

        {/* ── Pool frammenti ──────────────────────────────────────────────── */}
        <div
          style={{
            width: "100%", maxWidth: 380,
            minHeight: cellPx + 16,
            padding: "0.55rem",
            background: "rgba(255, 248, 230, 0.55)",
            border: "1.5px solid #C6A476",
            borderRadius: 8,
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            gap: POOL_GAP_PX,
            maxHeight: (cellPx + POOL_GAP_PX) * POOL_ROWS_MAX + 14,
            overflowY: "auto",
            opacity: fase === "preview" ? 0.35 : 1,
            pointerEvents: fase === "preview" ? "none" : "auto",
            transition: "opacity 200ms",
          }}
        >
          {visiblePool.length === 0 && !showLucida && (
            <div style={{ fontSize: "0.85rem", color: "#6B4F2A", padding: "0.5rem" }}>
              Mosaico completato!
            </div>
          )}
          {visiblePool.map((f) => {
            const isDragging = dragKey === f.key;
            const isWrong = wrongFlash === f.key;
            return (
              <div
                key={f.key}
                onPointerDown={(e) => handlePointerDown(e, f.key)}
                style={{
                  width: cellPx, height: cellPx,
                  cursor: "grab",
                  touchAction: "none",
                  opacity: isDragging ? 0 : 1,
                  pointerEvents: isDragging ? "none" : "auto",
                }}
              >
                <MosaicCellRenderer
                  cell={f.cell}
                  sizePx={cellPx}
                  rotation={f.rotation}
                  highlight={isWrong ? "wrong" : "none"}
                />
              </div>
            );
          })}
        </div>

        {/* ── Frammento in drag (overlay assoluto rispetto al viewport) ───── */}
        {draggingFragment && dragPos && (
          <div
            style={{
              position: "fixed",
              left: dragPos.x - cellPx / 2,
              top: dragPos.y - cellPx / 2,
              width: cellPx, height: cellPx,
              pointerEvents: "none",
              zIndex: 1000,
            }}
          >
            <MosaicCellRenderer
              cell={draggingFragment.cell}
              sizePx={cellPx}
              rotation={draggingFragment.rotation}
              highlight="drag"
            />
          </div>
        )}
      </div>
    </AtelierBackground>
  );
}
