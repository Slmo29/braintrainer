/**
 * components/esercizi/families/path-tracing/sequence.ts
 *
 * Tipi stimolo/risposta per Path Tracing.
 */

import { generateMaze, type Maze } from "./maze";

export type { Maze };

export interface StimoloPathTracing {
  maze:         Maze;
  targetTimeMs: number;
}

export type RispostaPathTracing = {
  tempoMs:    number;
  resetCount: number;
} | null;

export function generaStimoloPathTracing(
  gridSize:     number,
  targetTimeMs: number,
  rng:          () => number,
): StimoloPathTracing {
  return {
    maze: generateMaze(gridSize, rng),
    targetTimeMs,
  };
}
