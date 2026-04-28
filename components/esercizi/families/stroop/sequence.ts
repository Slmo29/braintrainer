/**
 * Generazione stimoli Stroop Task con bilanciamento congruente/incongruente.
 *
 * DEVIAZIONE DAL GDD §Generazione stimoli:
 * Il GDD specifica "proporzione rispettata per blocchi di 10 trial".
 * Questa implementazione usa blocchi di 20 trial (BLOCK_SIZE = 20).
 *
 * Motivazione aritmetica: tutti i ratio del GDD Stroop (multipli di 0.05)
 * producono conteggi interi esatti in blocchi da 20
 * (es. 0.35×20 = 7, 0.45×20 = 9, 0.70×20 = 14).
 *
 * Caso degenere documentato: per prevTailIncongruenti >= 1 e ratio = 0.70
 * (livello 20, chunk da 20), cap(20, 1) = cap(20, 2) = 13 < 14 = nI_target.
 * Il chunk interessato conterrà 13 I invece di 14. Deviazione massima: ±1 per
 * chunk. Il vincolo "max 2 I consecutivi" ha priorità assoluta sul target numerico.
 *
 * TODO (validazione clinica):
 * 1. Verificare che blocchi-20 producano un profilo di interferenza
 *    equivalente a blocchi-10 per la popolazione target (60+). La nota originale
 *    nel GDD ("blocchi di 10") rimane come riferimento clinico in
 *    docs/gdd/families/stroop.md.
 */

import type { ColoreStroop } from "./levels";

// ── Tipo stimolo (esportato — usato da StroopTaskEngine e StroopStimulus) ──────

export interface StroopStimolo {
  parola: ColoreStroop;
  coloreInchiostro: ColoreStroop;
  congruente: boolean;
}

// ── Costante ──────────────────────────────────────────────────────────────────

export const BLOCK_SIZE = 20;

// ── Helper privato ────────────────────────────────────────────────────────────

function pickRandom<T>(arr: readonly T[], rng: () => number): T {
  return arr[Math.floor(rng() * arr.length)];
}

// ── Helper matematici (esportati per test) ────────────────────────────────────

/**
 * Massimo numero di stimoli incongruenti (I) piazzabili in `n` posizioni
 * rispettando il vincolo "max 2 I consecutivi".
 * Formula: ceil(2n/3).
 */
export function maxFeasibleI(n: number): number {
  return n <= 0 ? 0 : Math.ceil((2 * n) / 3);
}

/**
 * Capacità massima di I in un chunk di `n` posizioni dato il numero di I
 * consecutivi in coda al pool precedente (`tail`).
 *
 * - tail = 0: cap = ceil(2n/3)
 * - tail = 2: pos 0 forzato C → cap = ceil(2(n-1)/3)
 * - tail = 1: massimo tra "piazzo I in pos 0 (consecutivi→2, poi C obbligatorio,
 *             poi n-2 posizioni libere)" e "piazzo C in pos 0 (n-1 posizioni libere)"
 */
export function cap(n: number, tail: 0 | 1 | 2): number {
  if (n <= 0) return 0;
  if (tail === 0) return Math.ceil((2 * n) / 3);
  if (tail === 2) return Math.ceil((2 * (n - 1)) / 3);
  // tail === 1
  return Math.max(
    1 + Math.ceil((2 * Math.max(0, n - 2)) / 3),
    Math.ceil((2 * (n - 1)) / 3),
  );
}

// ── generaPool ────────────────────────────────────────────────────────────────

/**
 * Genera un pool di `poolSize` StroopStimolo rispettando:
 * - Proporzione congruente/incongruente calibrata su `ratio`,
 *   bilanciata per blocchi di BLOCK_SIZE (20) trial.
 * - Vincolo "max 2 stimoli incongruenti consecutivi" anche al confine
 *   tra chiamate successive a generaPool, tramite `prevTailIncongruenti`.
 *
 * @param poolSize             Numero totale di stimoli da generare.
 * @param ratio                Proporzione target di trial incongruenti (0.0–1.0).
 * @param coloriAttivi         Colori disponibili nel livello (4 o 6).
 * @param prevTailIncongruenti I consecutivi in fondo al pool precedente (0|1|2).
 *                             Passare 0 per il primo pool della sessione.
 * @param rng                  Generatore di numeri casuali. Default: Math.random.
 *                             Iniettare una funzione deterministica nei test.
 */
export function generaPool(
  poolSize: number,
  ratio: number,
  coloriAttivi: readonly ColoreStroop[],
  prevTailIncongruenti: 0 | 1 | 2,
  rng: () => number = Math.random,
): StroopStimolo[] {
  if (ratio > 0 && coloriAttivi.length < 2) {
    throw new Error(
      "[stroop/sequence] coloriAttivi deve avere ≥2 elementi se incongruentRatio>0",
    );
  }

  const result: StroopStimolo[] = [];
  let consecutivi = prevTailIncongruenti as number;
  let posizione = 0;

  while (posizione < poolSize) {
    const chunkSize = Math.min(BLOCK_SIZE, poolSize - posizione);
    const nI_target = Math.round(chunkSize * ratio);

    // Pre-correzione: cap() calcolato usando la tail effettiva (derivata da
    // consecutivi al confine di ogni chunk). Garantisce nI ≤ capacità effettiva
    // rispettando il vincolo "max 2 I consecutivi" anche ai confini tra chunk.
    // Caso degenere: se la tail porta a cap(chunkSize, tail) < nI_target,
    // nI viene ridotto di conseguenza (deviazione ±1 per chunk).
    // Il vincolo consecutivi ha priorità assoluta sul target numerico.
    const tail: 0 | 1 | 2 = consecutivi === 0 ? 0 : consecutivi === 1 ? 1 : 2;
    const nI = Math.min(nI_target, cap(chunkSize, tail));

    let rimasti_I = nI;
    let rimasti_C = chunkSize - nI;

    for (let i = 0; i < chunkSize; i++) {
      const rimasti_totali = rimasti_I + rimasti_C;

      // deveEssereC: tre I consecutivi vietati dal GDD.
      const deveEssereC = consecutivi >= 2;

      // deveEssereI: se piazzassimo C qui, non avremmo abbastanza posizioni
      // per contenere tutti i rimasti_I. Dopo una C: rimasti_totali-1 posizioni
      // libere, consecutive reset a 0 → max I = maxFeasibleI(rimasti_totali-1).
      const deveEssereI = rimasti_I > maxFeasibleI(rimasti_totali - 1);

      let isIncongruente: boolean;

      if (deveEssereC && deveEssereI) {
        // Conflitto: il vincolo consecutivi impone C, ma piazzare C renderebbe
        // i rimasti_I infeasibili. Questo ramo non dovrebbe mai essere
        // raggiunto con cap() correttamente calcolato.
        if (rimasti_C === 0) {
          throw new Error(
            `[stroop/sequence] balancer infeasibility — bug in cap(). ` +
            `chunk=${chunkSize}, tail=${tail}, localPos=${i}, ` +
            `posGlobale=${posizione + i}, rimasti_I=${rimasti_I}, ` +
            `rimasti_C=${rimasti_C}, consecutivi=${consecutivi}`,
          );
        }
        // Caso degenere legittimo: accetta ±1 deviazione su nI.
        // Il vincolo consecutivi ha priorità assoluta.
        isIncongruente = false;
        rimasti_I--;
        rimasti_C--;
        consecutivi = 0;
      } else if (deveEssereC) {
        isIncongruente = false;
        rimasti_C--;
        consecutivi = 0;
      } else if (deveEssereI) {
        isIncongruente = true;
        rimasti_I--;
        consecutivi++;
      } else {
        // Scelta probabilistica calibrata: P(I) = rimasti_I / rimasti_totali.
        // Converge esattamente al target nI entro la fine del chunk.
        const P_I = rimasti_totali > 0 ? rimasti_I / rimasti_totali : 0;
        if (rng() < P_I) {
          isIncongruente = true;
          rimasti_I--;
          consecutivi++;
        } else {
          isIncongruente = false;
          rimasti_C--;
          consecutivi = 0;
        }
      }

      // Genera lo stimolo Stroop.
      // Congruente: stessa parola e colore inchiostro.
      // Incongruente: colore inchiostro casuale, parola diversa dall'inchiostro.
      const coloreInchiostro = pickRandom(coloriAttivi, rng);
      const parola = isIncongruente
        ? pickRandom(coloriAttivi.filter(c => c !== coloreInchiostro), rng)
        : coloreInchiostro;

      result.push({ parola, coloreInchiostro, congruente: !isIncongruente });
    }

    posizione += chunkSize;
  }

  return result;
}
