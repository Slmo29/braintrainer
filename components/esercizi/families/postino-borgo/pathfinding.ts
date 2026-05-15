/**
 * Utility di grafo per "Il Postino del Borgo".
 *
 * Il grafo è una griglia rows × cols con 4-connessione. Gli archi vivono in
 * una Map indicizzata per "chiave normalizzata" (i due nodi ordinati). Lo
 * stato `kind` determina se l'arco è transitabile e in che direzione:
 *   - "open"    → percorribile in entrambi i sensi
 *   - "oneway"  → percorribile solo da (fromRow,fromCol) → (toRow,toCol)
 *   - "closed"  → non percorribile (sbarra/lavori)
 *   - "stairs"  → non percorribile (scalinata, scelta visiva)
 */

import type { EdgeKind } from "./levels";

export interface NodeId { row: number; col: number; }
export interface Edge {
  fromRow: number; fromCol: number;
  toRow:   number; toCol:   number;
  kind: EdgeKind;
}

export function edgeKey(a: NodeId, b: NodeId): string {
  const [r1, c1, r2, c2] = (a.row < b.row || (a.row === b.row && a.col < b.col))
    ? [a.row, a.col, b.row, b.col]
    : [b.row, b.col, a.row, a.col];
  return `${r1},${c1}|${r2},${c2}`;
}

function edgeBetween(
  edges: Map<string, Edge>,
  a: NodeId, b: NodeId,
): Edge | null {
  return edges.get(edgeKey(a, b)) ?? null;
}

/** Restituisce true se è possibile attraversare l'arco da `from` a `to`. */
export function canTraverse(
  edges: Map<string, Edge>,
  from: NodeId, to: NodeId,
): boolean {
  const e = edgeBetween(edges, from, to);
  if (!e) return false;
  if (e.kind === "closed" || e.kind === "stairs") return false;
  if (e.kind === "open") return true;
  // oneway: consentito solo se from→to coincide con la direzione dell'arco
  return e.fromRow === from.row && e.fromCol === from.col
      && e.toRow   === to.row   && e.toCol   === to.col;
}

export function neighbors(
  rows: number, cols: number,
  edges: Map<string, Edge>,
  n: NodeId,
): NodeId[] {
  const cand: NodeId[] = [
    { row: n.row - 1, col: n.col     },
    { row: n.row + 1, col: n.col     },
    { row: n.row,     col: n.col - 1 },
    { row: n.row,     col: n.col + 1 },
  ];
  return cand.filter(p =>
    p.row >= 0 && p.row < rows &&
    p.col >= 0 && p.col < cols &&
    canTraverse(edges, n, p),
  );
}

export function isReachable(
  rows: number, cols: number,
  edges: Map<string, Edge>,
  start: NodeId, goal: NodeId,
): boolean {
  return shortestPathLength(rows, cols, edges, start, goal) !== Infinity;
}

export function shortestPathLength(
  rows: number, cols: number,
  edges: Map<string, Edge>,
  start: NodeId, goal: NodeId,
): number {
  if (start.row === goal.row && start.col === goal.col) return 0;
  const visited = new Uint8Array(rows * cols);
  const key = (n: NodeId) => n.row * cols + n.col;
  let frontier: NodeId[] = [start];
  visited[key(start)] = 1;
  let dist = 0;
  while (frontier.length > 0) {
    dist++;
    const next: NodeId[] = [];
    for (const n of frontier) {
      for (const m of neighbors(rows, cols, edges, n)) {
        if (visited[key(m)]) continue;
        if (m.row === goal.row && m.col === goal.col) return dist;
        visited[key(m)] = 1;
        next.push(m);
      }
    }
    frontier = next;
  }
  return Infinity;
}

/** Verifica che un percorso (sequenza di nodi) sia legale sul grafo. */
export function pathIsLegal(
  edges: Map<string, Edge>,
  path: NodeId[],
): boolean {
  for (let i = 0; i + 1 < path.length; i++) {
    if (!canTraverse(edges, path[i], path[i + 1])) return false;
  }
  return true;
}
