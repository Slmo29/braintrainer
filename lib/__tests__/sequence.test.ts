import { describe, it, expect } from "vitest";
import { cap, generaPool } from "@/components/esercizi/families/flanker-task/sequence";
import type { FlankerStimolo } from "@/components/esercizi/families/flanker-task/levels";

// ── RNG deterministico (mulberry32) ───────────────────────────────────────────

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6D2B79F5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Helper per le asserzioni ──────────────────────────────────────────────────

function countI(pool: FlankerStimolo[]): number {
  return pool.filter(s => !s.congruente).length;
}

function maxConsecutiveI(pool: FlankerStimolo[]): number {
  let max = 0;
  let run = 0;
  for (const s of pool) {
    if (!s.congruente) { run++; max = Math.max(max, run); }
    else { run = 0; }
  }
  return max;
}

// ── T1–T6: cap() ─────────────────────────────────────────────────────────────

describe("cap(N, tail)", () => {

  it("T1 — cap(20, 0) = 14", () => {
    expect(cap(20, 0)).toBe(14);
  });

  it("T2 — cap(20, 1) = 13", () => {
    expect(cap(20, 1)).toBe(13);
  });

  it("T3 — cap(20, 2) = 13", () => {
    expect(cap(20, 2)).toBe(13);
  });

  it("T4 — cap(19, 0) = 13", () => {
    expect(cap(19, 0)).toBe(13);
  });

  it("T5 — cap(19, 1) = 13", () => {
    expect(cap(19, 1)).toBe(13);
  });

  it("T6 — cap(19, 2) = 12", () => {
    expect(cap(19, 2)).toBe(12);
  });

});

// ── T7–T11: generaPool() count e vincoli ─────────────────────────────────────

describe("generaPool() — conteggio I e vincolo max-2-consecutivi", () => {

  it("T7 — chunk 20, ratio 0.70, tail 0 → esattamente 14 I, 0 triplette", () => {
    const pool = generaPool(20, 0.70, 4, 0, mulberry32(1));
    expect(countI(pool)).toBe(14);
    expect(maxConsecutiveI(pool)).toBeLessThanOrEqual(2);
  });

  it("T8 — chunk 20, ratio 0.70, tail 1 → esattamente 13 I, 0 triplette", () => {
    const pool = generaPool(20, 0.70, 4, 1, mulberry32(2));
    expect(countI(pool)).toBe(13);
    expect(maxConsecutiveI(pool)).toBeLessThanOrEqual(2);
  });

  it("T9 — chunk 20, ratio 0.70, tail 2 → esattamente 13 I, 0 triplette", () => {
    const pool = generaPool(20, 0.70, 4, 2, mulberry32(3));
    expect(countI(pool)).toBe(13);
    expect(maxConsecutiveI(pool)).toBeLessThanOrEqual(2);
  });

  it("T10 — pool 40, ratio 0.50, tail 0 → esattamente 20 I, 0 triplette", () => {
    const pool = generaPool(40, 0.50, 4, 0, mulberry32(4));
    expect(countI(pool)).toBe(20);
    expect(maxConsecutiveI(pool)).toBeLessThanOrEqual(2);
  });

  it("T11 — pool 40, ratio 0.70, tail 0 → 0 triplette incluso confine chunk 19→20", () => {
    const pool = generaPool(40, 0.70, 4, 0, mulberry32(5));
    // Nessuna tripletta nell'intero pool (confine incluso)
    expect(maxConsecutiveI(pool)).toBeLessThanOrEqual(2);
    // Verifica esplicita del confine: pos 18, 19, 20 non sono tutti I
    const slice = pool.slice(18, 21).map(s => s.congruente ? "C" : "I").join("");
    expect(slice).not.toBe("III");
  });

});

// ── T12: determinismo ─────────────────────────────────────────────────────────

describe("generaPool() — determinismo con RNG iniettato", () => {

  it("T12 — 100 chiamate con stesso seed → output identico", () => {
    const SEED = 42;
    const first = generaPool(40, 0.50, 4, 0, mulberry32(SEED));
    for (let i = 1; i < 100; i++) {
      const run = generaPool(40, 0.50, 4, 0, mulberry32(SEED));
      expect(run).toEqual(first);
    }
  });

});

// ── T13: fuzz ─────────────────────────────────────────────────────────────────

describe("generaPool() — fuzz: 1000 chiamate, mai 3+ I consecutivi", () => {

  it("T13 — ratio ∈ [0.20, 0.70], chunk 20, seed casuale → maxConsecutiveI ≤ 2", () => {
    const masterRng = mulberry32(0xC0FFEE);
    const ratios = [0.20, 0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60, 0.65, 0.70];
    const tails: (0 | 1 | 2)[] = [0, 1, 2];

    for (let i = 0; i < 1000; i++) {
      const ratio = ratios[Math.floor(masterRng() * ratios.length)];
      const tail  = tails[Math.floor(masterRng() * tails.length)];
      const seed  = Math.floor(masterRng() * 0xFFFFFFFF);
      const pool  = generaPool(20, ratio, 4, tail, mulberry32(seed));

      const maxRun = maxConsecutiveI(pool);
      if (maxRun > 2) {
        throw new Error(
          `Fuzz fallito: ratio=${ratio}, tail=${tail}, seed=${seed}, maxRun=${maxRun}`,
        );
      }
    }
  });

});
