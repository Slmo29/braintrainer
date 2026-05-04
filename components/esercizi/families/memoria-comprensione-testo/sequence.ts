/**
 * components/esercizi/families/memoria-comprensione-testo/sequence.ts
 *
 * Generatore stimoli per Memoria e Comprensione del Testo — varianti MBT.
 * Flusso: lettura testo → domande MCQ (N domande, nOpzioni opzioni ciascuna).
 */

import { MC_TESTI, type MCTesto } from "./testi";

export type { MCTesto };

// ── Tipi ───────────────────────────────────────────────────────────────────────

export type MCTVariante = "fattuale" | "inferenziale";

export interface StimoloMCT {
  variante: MCTVariante;
  testo:    string;
  domande:  Array<{
    testo:   string;
    opzioni: string[];  // nOpzioni opzioni (già tagliate)
    idxCorr: number;
  }>;
}

export type RispostaMCT = {
  risposte: number[]; // indice opzione scelta per ogni domanda
} | null;

// ── Pool senza ripetizione per band (nFrasi) ──────────────────────────────────

export interface MCTPoolRef {
  bands: Record<number, { shuffled: MCTesto[]; idx: number }>;
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function creaMCTPoolRef(rng: () => number): MCTPoolRef {
  const bands: MCTPoolRef["bands"] = {};
  for (const n of [3, 4, 5, 6]) {
    const filtered = [...MC_TESTI].filter((t) => t.nFrasi === n);
    bands[n] = { shuffled: shuffle(filtered, rng), idx: 0 };
  }
  return { bands };
}

// ── Generatore principale ──────────────────────────────────────────────────────

export function generaStimoloMCT(
  nFrasi:    number,
  nDomande:  number,
  nOpzioni:  number,
  variante:  MCTVariante,
  poolRef:   MCTPoolRef,
  rng:       () => number,
): StimoloMCT {
  const band = poolRef.bands[nFrasi];
  const testo = band.shuffled[band.idx];
  band.idx = (band.idx + 1) % band.shuffled.length;
  if (band.idx === 0) {
    band.shuffled = shuffle(
      [...MC_TESTI].filter((t) => t.nFrasi === nFrasi),
      rng,
    );
  }

  const allDomande = variante === "fattuale" ? testo.fattuale : testo.inferenziale;
  const n = Math.min(nDomande, allDomande.length);

  const domande = allDomande.slice(0, n).map((d) => ({
    testo:   d.testo,
    opzioni: d.opzioni.slice(0, nOpzioni),
    idxCorr: d.idxCorr < nOpzioni ? d.idxCorr : 0,
  }));

  return { variante, testo: testo.testo, domande };
}
