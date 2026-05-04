/**
 * components/esercizi/families/path-tracing/maze.ts
 *
 * Generatore labirinto con recursive backtracker (DFS).
 * Start = (0,0) top-left, End = (size-1,size-1) bottom-right.
 */

export interface PTCell {
  n: boolean; // muro nord
  e: boolean; // muro est
  s: boolean; // muro sud
  w: boolean; // muro ovest
}

export interface Maze {
  size:  number;
  cells: PTCell[][];
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateMaze(size: number, rng: () => number): Maze {
  // Inizializza ogni cella con tutti i muri presenti
  const cells: PTCell[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => ({ n: true, e: true, s: true, w: true })),
  );

  const visited = Array.from({ length: size }, () =>
    new Array<boolean>(size).fill(false),
  );

  const dirs = [
    { dr: -1, dc:  0, wall: "n" as const, opp: "s" as const }, // nord
    { dr:  0, dc:  1, wall: "e" as const, opp: "w" as const }, // est
    { dr:  1, dc:  0, wall: "s" as const, opp: "n" as const }, // sud
    { dr:  0, dc: -1, wall: "w" as const, opp: "e" as const }, // ovest
  ];

  function carve(r: number, c: number) {
    visited[r][c] = true;
    for (const d of shuffle(dirs, rng)) {
      const nr = r + d.dr;
      const nc = c + d.dc;
      if (nr >= 0 && nr < size && nc >= 0 && nc < size && !visited[nr][nc]) {
        cells[r][c][d.wall] = false;
        cells[nr][nc][d.opp] = false;
        carve(nr, nc);
      }
    }
  }

  carve(0, 0);
  return { size, cells };
}
