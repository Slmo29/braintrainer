import { describe, it, expect } from "vitest";
import {
  generaPool,
  BLOCK_SIZE,
  NOGO_PER_BLOCK,
  GO_PER_BLOCK,
  type GoNogoStimolo,
} from "@/components/esercizi/families/go-nogo/sequence";
import type { CoppiaColore } from "@/components/esercizi/families/go-nogo/levels";

// ── RNG deterministica (mulberry32) ───────────────────────────────────────────
// Stessa funzione usata nel test Stroop — duplicata inline, no astrazione preventiva.

function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6D2B79F5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 0x100000000;
  };
}

// ── Helper ────────────────────────────────────────────────────────────────────

function countNogo(pool: GoNogoStimolo[]): number {
  return pool.filter(s => s.tipo === "nogo").length;
}

function maxConsecutiveNogo(pool: GoNogoStimolo[]): number {
  let max = 0, run = 0;
  for (const s of pool) {
    if (s.tipo === "nogo") { run++; max = Math.max(max, run); }
    else { run = 0; }
  }
  return max;
}

// ── Coppia test ───────────────────────────────────────────────────────────────
// Autonoma dal modulo levels — i test non dipendono dalla selezione palette.

const COPPIA_TEST: CoppiaColore = { go: "verde", nogo: "rosso" };

// ── Test suite ────────────────────────────────────────────────────────────────

describe("Go/No-Go sequence — Costanti esportate", () => {
  it("T1: BLOCK_SIZE === 10", () => {
    expect(BLOCK_SIZE).toBe(10);
  });

  it("T2: NOGO_PER_BLOCK === 2", () => {
    expect(NOGO_PER_BLOCK).toBe(2);
  });

  it("T3: GO_PER_BLOCK === 8 (BLOCK_SIZE - NOGO_PER_BLOCK)", () => {
    expect(GO_PER_BLOCK).toBe(8);
    expect(GO_PER_BLOCK).toBe(BLOCK_SIZE - NOGO_PER_BLOCK);
  });
});

describe("Go/No-Go sequence — Conteggio e bilanciamento", () => {
  it("T4: pool 40 (4 blocchi), tail 0 → 8 nogo esatti", () => {
    const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(1));
    expect(countNogo(pool)).toBe(8);
  });

  it("T5: pool 100 (10 blocchi), tail 0 → 20 nogo esatti", () => {
    const pool = generaPool(100, COPPIA_TEST, 0, mulberry32(2));
    expect(countNogo(pool)).toBe(20);
  });

  it("T6: pool 140 (14 blocchi), tail 0 → 28 nogo esatti", () => {
    const pool = generaPool(140, COPPIA_TEST, 0, mulberry32(3));
    expect(countNogo(pool)).toBe(28);
  });

  it("T7: pool 40, tail 1 → 8 nogo esatti (vincolo non riduce count)", () => {
    // Il vincolo max-1 redistribuisce, non riduce il totale nogo.
    const pool = generaPool(40, COPPIA_TEST, 1, mulberry32(4));
    expect(countNogo(pool)).toBe(8);
  });

  it("T8: ratio esatto 20% per tutti i pool sizes GDD", () => {
    for (const size of [40, 50, 60, 70, 80, 90, 100, 110, 120, 130, 140]) {
      const pool = generaPool(size, COPPIA_TEST, 0, mulberry32(size));
      expect(countNogo(pool)).toBe(size * 0.20);
    }
  });
});

describe("Go/No-Go sequence — Vincolo max-1 nogo consecutivi", () => {
  it("T9: pool 40, tail 0 → nessun nogo consecutivo", () => {
    const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(10));
    expect(maxConsecutiveNogo(pool)).toBeLessThanOrEqual(1);
  });

  it("T10: pool 40, tail 1 → primo stimolo è go (vincolo cross-boundary)", () => {
    const pool = generaPool(40, COPPIA_TEST, 1, mulberry32(11));
    expect(pool[0].tipo).toBe("go");
    expect(maxConsecutiveNogo(pool)).toBeLessThanOrEqual(1);
  });

  it("T11: pool 100 con più seed → maxConsecutiveNogo <= 1 per tutti", () => {
    for (const seed of [100, 200, 300, 400, 500]) {
      const pool = generaPool(100, COPPIA_TEST, 0, mulberry32(seed));
      expect(maxConsecutiveNogo(pool)).toBeLessThanOrEqual(1);
    }
  });

  it("T12: confine tra blocchi — ultimo nogo di un blocco non è seguito da nogo", () => {
    // Genera pool da 20 stimoli (2 blocchi da 10) con seed che tende a mettere
    // nogo in fondo al primo blocco, e verifica che il confine non violi il vincolo.
    for (let seed = 0; seed < 50; seed++) {
      const pool = generaPool(20, COPPIA_TEST, 0, mulberry32(seed));
      // Controlla specificamente la giunzione tra blocco 1 e blocco 2 (indici 9 e 10)
      if (pool[9].tipo === "nogo") {
        expect(pool[10].tipo).toBe("go");
      }
      // Invariante globale
      expect(maxConsecutiveNogo(pool)).toBeLessThanOrEqual(1);
    }
  });
});

describe("Go/No-Go sequence — Invariante stimolo", () => {
  it("T13: ogni stimolo go ha colore === COPPIA_TEST.go", () => {
    const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(20));
    const goStimoli = pool.filter(s => s.tipo === "go");
    expect(goStimoli.length).toBeGreaterThan(0);
    for (const s of goStimoli) {
      expect(s.colore).toBe(COPPIA_TEST.go);
    }
  });

  it("T14: ogni stimolo nogo ha colore === COPPIA_TEST.nogo", () => {
    const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(21));
    const nogoStimoli = pool.filter(s => s.tipo === "nogo");
    expect(nogoStimoli.length).toBeGreaterThan(0);
    for (const s of nogoStimoli) {
      expect(s.colore).toBe(COPPIA_TEST.nogo);
    }
  });

  it("T15: nessuno stimolo ha colore estraneo alla coppia", () => {
    const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(22));
    for (const s of pool) {
      expect([COPPIA_TEST.go, COPPIA_TEST.nogo]).toContain(s.colore);
    }
  });
});

describe("Go/No-Go sequence — Determinismo", () => {
  it("T16: 100 chiamate con stesso seed producono output identico", () => {
    const baseline = generaPool(40, COPPIA_TEST, 0, mulberry32(42));
    for (let i = 0; i < 99; i++) {
      const pool = generaPool(40, COPPIA_TEST, 0, mulberry32(42));
      expect(pool).toEqual(baseline);
    }
  });
});

describe("Go/No-Go sequence — Fuzz", () => {
  it("T17: 1000 pool casuali rispettano count 20% e max-1 nogo consecutivi", () => {
    const masterRng = mulberry32(0xC0FFEE);
    const sizes = [40, 80, 120];
    const tails: (0 | 1)[] = [0, 1];

    for (let i = 0; i < 1000; i++) {
      const size = sizes[Math.floor(masterRng() * sizes.length)];
      const tail = tails[Math.floor(masterRng() * tails.length)];
      const seed = Math.floor(masterRng() * 0xFFFFFFFF);
      const pool = generaPool(size, COPPIA_TEST, tail, mulberry32(seed));

      const maxRun = maxConsecutiveNogo(pool);
      const expectedNogo = size * 0.20;
      const actualNogo = countNogo(pool);

      if (maxRun > 1) {
        throw new Error(
          `Fuzz fallito: size=${size}, tail=${tail}, seed=${seed}, maxRun=${maxRun}`,
        );
      }
      if (actualNogo !== expectedNogo) {
        throw new Error(
          `Fuzz count fallito: size=${size}, tail=${tail}, seed=${seed}, ` +
          `expected=${expectedNogo}, got=${actualNogo}`,
        );
      }
    }
  });
});
