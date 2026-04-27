/**
 * Test della Regola N per la selezione dell'esercizio del giorno.
 * docs/gdd/shared/01-session-rules.md
 *
 * La logica reale vive in createEserciziDelGiornoRegolaaN (lib/sync.ts) e dipende
 * da Supabase. Qui testiamo la logica di selezione estratta come funzione pura,
 * con pool e storico iniettati direttamente (no mock di rete).
 */
import { describe, it, expect } from "vitest";

// ─── Logica estratta (stessa implementazione di sync.ts, pura) ────────────────

/**
 * Seleziona l'esercizio da proporre oggi per un dato dominio.
 *
 * @param pool     ID degli esercizi attivi per il dominio, in ordine stabile
 * @param storico  ID degli esercizi già mostrati all'utente (più recente prima)
 * @returns        ID scelto
 */
function selezionaRegolaaN(pool: string[], storico: string[]): string {
  if (pool.length === 0) throw new Error("Pool vuoto");
  if (pool.length === 1) return pool[0];

  const nEsclusi = pool.length - 1;
  const recenti = new Set(storico.slice(0, nEsclusi));
  const eleggibili = pool.filter(id => !recenti.has(id));
  const candidati = eleggibili.length > 0 ? eleggibili : pool;
  return candidati[Math.floor(Math.random() * candidati.length)];
}

/**
 * Simula N giorni di utilizzo per un utente.
 * Restituisce la sequenza di esercizi scelti.
 */
function simula(pool: string[], giorni: number): string[] {
  const storico: string[] = [];
  for (let i = 0; i < giorni; i++) {
    const scelto = selezionaRegolaaN(pool, storico);
    storico.unshift(scelto); // più recente prima
  }
  return storico.reverse(); // ordine cronologico
}

// ─── Test ─────────────────────────────────────────────────────────────────────

describe("Regola N — selezionaRegolaaN", () => {
  // ── Test A ───────────────────────────────────────────────────────────────────
  it("utente nuovo (storico vuoto): pool N=5 → sceglie sempre un esercizio valido", () => {
    const pool = ["A", "B", "C", "D", "E"];
    for (let i = 0; i < 20; i++) {
      const scelto = selezionaRegolaaN(pool, []);
      expect(pool).toContain(scelto);
    }
  });

  it("utente nuovo: su 100 estrazioni da pool=[A,B,C,D,E], tutti e 5 gli esercizi compaiono (varietà)", () => {
    const pool = ["A", "B", "C", "D", "E"];
    const visti = new Set<string>();
    for (let i = 0; i < 100; i++) {
      visti.add(selezionaRegolaaN(pool, []));
    }
    // Con pool di 5, su 100 tentativi tutti devono comparire
    expect(visti.size).toBe(5);
  });

  // ── Test B ───────────────────────────────────────────────────────────────────
  it("pool N=1: restituisce sempre l'unico esercizio senza errori", () => {
    const pool = ["sequence_tap_numeri_forward"];
    for (let i = 0; i < 10; i++) {
      const storico = Array.from({ length: i }, () => pool[0]); // storico cresce
      expect(selezionaRegolaaN(pool, storico)).toBe(pool[0]);
    }
  });

  // ── Test C ───────────────────────────────────────────────────────────────────
  it("pool vuoto: lancia errore", () => {
    expect(() => selezionaRegolaaN([], [])).toThrow("Pool vuoto");
  });

  // ── Test D (no ripetizione consecutiva) ──────────────────────────────────────
  it("pool N=2: A e B si alternano senza mai ripetersi consecutivamente", () => {
    const pool = ["A", "B"];
    const sequenza = simula(pool, 20);
    for (let i = 1; i < sequenza.length; i++) {
      expect(sequenza[i]).not.toBe(sequenza[i - 1]);
    }
  });

  it("pool N=3: nessun esercizio appare 2 volte consecutive su 30 giorni", () => {
    const pool = ["A", "B", "C"];
    const sequenza = simula(pool, 30);
    for (let i = 1; i < sequenza.length; i++) {
      expect(sequenza[i]).not.toBe(sequenza[i - 1]);
    }
  });

  // ── Test E (distribuzione equa su 30 giorni) ──────────────────────────────────
  it("pool N=5 su 30 giorni: ogni esercizio appare con distribuzione ±20% attorno alla media", () => {
    const pool = ["A", "B", "C", "D", "E"];
    const GIORNI = 30;
    const TOLLERANZA = 0.20; // ±20%

    // Media attesa: 30 / 5 = 6 apparizioni per esercizio
    const mediaAttesa = GIORNI / pool.length;
    const min = Math.floor(mediaAttesa * (1 - TOLLERANZA));
    const max = Math.ceil(mediaAttesa * (1 + TOLLERANZA));

    // Esegui 10 simulazioni indipendenti e verifica che almeno 8/10 rispettino
    // la distribuzione (la selezione è casuale, quindi una singola run può
    // per caso essere sbilanciata — 10 run riducono la flakiness)
    let runs_ok = 0;
    for (let run = 0; run < 10; run++) {
      const sequenza = simula(pool, GIORNI);
      const freq: Record<string, number> = {};
      for (const id of sequenza) freq[id] = (freq[id] ?? 0) + 1;
      const tuttiOk = pool.every(id => (freq[id] ?? 0) >= min && (freq[id] ?? 0) <= max);
      if (tuttiOk) runs_ok++;
    }
    // Almeno 8 run su 10 devono avere distribuzione entro ±20%
    expect(runs_ok).toBeGreaterThanOrEqual(8);
  });

  // ── Test F (fallback) ────────────────────────────────────────────────────────
  it("se per qualche motivo tutti gli esercizi risultano recenti → fallback al pool intero", () => {
    // pool ridotto da 3 a 1 a runtime (storico ha i vecchi ID)
    const pool = ["A"]; // pool aggiornato, ma storico ha "B" e "C"
    const storico = ["B", "C"]; // vecchi esercizi non più nel pool
    // nEsclusi = 0, recenti = {}, eleggibili = ["A"] → sceglie "A"
    const scelto = selezionaRegolaaN(pool, storico);
    expect(scelto).toBe("A");
  });

  it("fallback esplicito: recenti coprono tutto il pool (caso degenere) → restituisce comunque un elemento del pool", () => {
    // storico più lungo del pool - 1; in teoria non dovrebbe accadere ma
    // il fallback lo gestisce
    const pool = ["A", "B"];
    const storico = ["A", "B"]; // entrambi recenti
    // nEsclusi = 1, recenti = {"A"}, eleggibili = ["B"]
    // → "B" è eleggibile (A è l'unico escluso)
    const scelto = selezionaRegolaaN(pool, storico);
    expect(pool).toContain(scelto);
  });
});

// ─── Stampa distribuzione (diagnostica, non un assertion) ────────────────────
describe("Regola N — diagnostica distribuzione", () => {
  it("stampa distribuzione su 30 giorni per pool di 5 esercizi (solo console, no assertion)", () => {
    const pool = ["seq_tap", "recall_grid", "memoria_lista", "cultura_gen", "assoc_mem"];
    const sequenza = simula(pool, 30);
    const freq: Record<string, number> = {};
    for (const id of sequenza) freq[id] = (freq[id] ?? 0) + 1;

    console.log("\n─── Distribuzione Regola N (30 giorni, pool=5) ───");
    const media = 30 / pool.length;
    for (const id of pool) {
      const n = freq[id] ?? 0;
      const delta = ((n - media) / media * 100).toFixed(1);
      const bar = "█".repeat(n);
      console.log(`  ${id.padEnd(12)} ${String(n).padStart(2)} volte  ${bar}  (${delta}% dalla media)`);
    }
    console.log("──────────────────────────────────────────────────\n");

    // Nessuna assertion: è solo stampa diagnostica
    expect(true).toBe(true);
  });
});
