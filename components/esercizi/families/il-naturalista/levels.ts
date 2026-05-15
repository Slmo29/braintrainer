/**
 * Livelli per "Il Naturalista".
 *
 * Dominio: Visuospaziale — ricerca visiva figura/sfondo. Il giocatore
 * trova tutte le creature nascoste nella scena (bosco, fondale marino,
 * prato) e le tocca per "catturarle" sul taccuino del naturalista.
 *
 * Modello A — timer sessione 90s, scene a catena. Quando una scena è
 * completata (tutte le creature trovate) o scade il tempo della scena,
 * si passa alla successiva.
 *
 * Progressione (10 livelli):
 *   - lv 1–2 : 3 creature grandi, sfondi semplici, no camouflage
 *   - lv 3–5 : 4–5 creature, sfondi più ricchi, lieve mimetismo
 *   - lv 6–7 : 6 creature, scene dense, 1–2 si muovono lentamente
 *   - lv 8–10: 7–8 creature minuscole, scene densissime, fino a 3 si muovono
 */

export const NATURALISTA_SESSION_TIMER_MS = 90_000;

export type SceneKind = "prato" | "prato-fiorito" | "bosco-rado" | "bosco" | "bosco-fitto" | "fondale-chiaro" | "fondale-fitto";

export interface NaturalistaLevelConfig {
  livello: number;
  /** Numero di creature da nascondere. */
  numCreature: number;
  /** Lato sprite creatura in unità SVG (viewBox 1000×700). */
  creaturaSizeUnits: number;
  /** Raggio area di click generoso intorno al centro sprite (unità SVG). */
  clickRadiusUnits: number;
  /** Pool di scene tra cui campionare. */
  scenePool: readonly SceneKind[];
  /**
   * Mimetismo 0–1: 0 = colori vivaci e contrastati con lo sfondo,
   * 1 = colori molto simili allo sfondo. Influenza saturazione/opacità sprite.
   */
  mimetismo: number;
  /** Numero di creature che si muovono lentamente (deriva ellittica). */
  numMobili: number;
  /** Tempo limite per scena (ms): oltre, si passa avanti penalizzando le mancate. */
  tLimSceneMs: number;
  /** Densità di distrattori statici nello sfondo (foglie/sassi extra), 0–1. */
  densitaSfondo: number;
}

export const NATURALISTA_LEVELS: readonly NaturalistaLevelConfig[] = [
  { livello:  1, numCreature: 3, creaturaSizeUnits: 110, clickRadiusUnits: 90, scenePool: ["prato"],                                  mimetismo: 0.00, numMobili: 0, tLimSceneMs: 28_000, densitaSfondo: 0.15 },
  { livello:  2, numCreature: 3, creaturaSizeUnits:  98, clickRadiusUnits: 82, scenePool: ["prato", "prato-fiorito"],                 mimetismo: 0.10, numMobili: 0, tLimSceneMs: 30_000, densitaSfondo: 0.25 },
  { livello:  3, numCreature: 4, creaturaSizeUnits:  88, clickRadiusUnits: 76, scenePool: ["prato-fiorito", "bosco-rado"],            mimetismo: 0.20, numMobili: 0, tLimSceneMs: 34_000, densitaSfondo: 0.35 },
  { livello:  4, numCreature: 5, creaturaSizeUnits:  78, clickRadiusUnits: 70, scenePool: ["bosco-rado", "fondale-chiaro"],           mimetismo: 0.32, numMobili: 0, tLimSceneMs: 38_000, densitaSfondo: 0.45 },
  { livello:  5, numCreature: 5, creaturaSizeUnits:  70, clickRadiusUnits: 62, scenePool: ["bosco", "fondale-chiaro"],                mimetismo: 0.45, numMobili: 0, tLimSceneMs: 42_000, densitaSfondo: 0.55 },
  { livello:  6, numCreature: 6, creaturaSizeUnits:  62, clickRadiusUnits: 58, scenePool: ["bosco", "fondale-fitto"],                 mimetismo: 0.55, numMobili: 1, tLimSceneMs: 48_000, densitaSfondo: 0.65 },
  { livello:  7, numCreature: 6, creaturaSizeUnits:  56, clickRadiusUnits: 54, scenePool: ["bosco-fitto", "fondale-fitto"],           mimetismo: 0.65, numMobili: 2, tLimSceneMs: 52_000, densitaSfondo: 0.75 },
  { livello:  8, numCreature: 7, creaturaSizeUnits:  50, clickRadiusUnits: 50, scenePool: ["bosco-fitto", "fondale-fitto"],           mimetismo: 0.74, numMobili: 2, tLimSceneMs: 58_000, densitaSfondo: 0.82 },
  { livello:  9, numCreature: 7, creaturaSizeUnits:  46, clickRadiusUnits: 48, scenePool: ["bosco-fitto", "fondale-fitto"],           mimetismo: 0.82, numMobili: 3, tLimSceneMs: 64_000, densitaSfondo: 0.90 },
  { livello: 10, numCreature: 8, creaturaSizeUnits:  42, clickRadiusUnits: 46, scenePool: ["bosco-fitto", "fondale-fitto"],           mimetismo: 0.88, numMobili: 3, tLimSceneMs: 72_000, densitaSfondo: 1.00 },
] as const;

export function getNaturalistaLevel(livello: number): NaturalistaLevelConfig {
  return NATURALISTA_LEVELS[Math.min(10, Math.max(1, livello)) - 1];
}

/** Dimensione viewBox SVG di riferimento per tutte le scene. */
export const SCENE_VIEWBOX_W = 1000;
export const SCENE_VIEWBOX_H = 700;
