/**
 * components/esercizi/families/hayling-game/sequence.ts
 *
 * Tipi stimolo/risposta e logica di generazione per Hayling Game.
 *
 * Variante A (completamento logico): qualsiasi risposta non vuota è corretta.
 * Variante B (parola non correlata): risposta valida ↔ NON è nella blacklist.
 */

import { HAYLING_FRASI, type HaylingFrase } from "./frasi";

export type { HaylingFrase };

export type HaylingVariante = "A" | "B";

export interface StimoloHayling {
  frase:        string;
  blacklist:    string[];
  variante:     HaylingVariante;
  tRispostaMs:  number;
}

export type RispostaHayling = {
  parola:  string;
  tempoMs: number;
} | null;

// ── Pool senza ripetizione ─────────────────────────────────────────────────────

export interface HaylingPoolRef {
  shuffled: HaylingFrase[];
  idx:      number;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function creaHaylingPoolRef(rng: () => number): HaylingPoolRef {
  return { shuffled: shuffle([...HAYLING_FRASI], rng), idx: 0 };
}

// ── Generatore ────────────────────────────────────────────────────────────────

export function generaStimoloHayling(
  variante:    HaylingVariante,
  tRispostaMs: number,
  poolRef:     HaylingPoolRef,
  rng:         () => number,
): StimoloHayling {
  const item = poolRef.shuffled[poolRef.idx];
  poolRef.idx = (poolRef.idx + 1) % poolRef.shuffled.length;
  if (poolRef.idx === 0) {
    poolRef.shuffled = shuffle([...HAYLING_FRASI], rng);
  }

  return {
    frase:       item.frase,
    blacklist:   item.blacklist,
    variante,
    tRispostaMs,
  };
}

// ── Validazione ───────────────────────────────────────────────────────────────

function normalizza(s: string): string {
  return s.trim().toLowerCase().replace(/[àáâãäå]/g, "a")
    .replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i")
    .replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u");
}

export function isRispostaValida(
  parola:    string,
  blacklist: string[],
  variante:  HaylingVariante,
): boolean {
  const p = normalizza(parola);
  if (p.length < 2) return false;

  if (variante === "A") {
    // Variante A: qualsiasi risposta non vuota è accettata
    return true;
  }

  // Variante B: la parola non deve essere nella blacklist
  return !blacklist.some((b) => normalizza(b) === p);
}
