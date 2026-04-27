/**
 * Generazione stimoli Flanker Task con bilanciamento congruente/incongruente.
 *
 * DEVIAZIONE DAL GDD §Generazione stimoli:
 * Il GDD specifica "proporzione rispettata per blocchi di 10 trial".
 * Questa implementazione usa blocchi di 20 trial (BLOCK_SIZE = 20).
 *
 * Motivazione aritmetica: 5 dei 20 livelli hanno incongruentRatio a multipli
 * di 0.05 che producono conteggi non interi in blocchi da 10
 * (es. 0.35×10 = 3.5). In blocchi da 20 tutti i ratio del GDD producono
 * interi esatti (0.35×20 = 7, 0.45×20 = 9, ecc.).
 *
 * Caso degenere documentato: per prevTailIncongruenti >= 1 e ratio = 0.70
 * (livello 20, chunk da 20), cap(20, 1) = cap(20, 2) = 13 < 14 = nI_target.
 * Il chunk interessato conterrà 13 I invece di 14. Deviazione massima: ±1 per
 * chunk. Il vincolo "max 2 I consecutivi" ha priorità assoluta sul target numerico.
 *
 * TODO (validazione clinica con neuropsicologo del team):
 * 1. Verificare che blocchi-20 producano un profilo di carico attentivo
 *    equivalente a blocchi-10 per la popolazione target (60+). La nota originale
 *    nel GDD ("blocchi di 10") rimane come riferimento clinico in
 *    docs/gdd/families/flanker-task.md.
 * 2. Nel paradigma Eriksen classico, la direzione centrale (sinistra/destra)
 *    viene bilanciata 50/50 per controllare i bias motori. Questa implementazione
 *    usa distribuzione casuale senza bilanciamento per blocco. Su sessioni di
 *    25-30 trial, la convergenza al 50/50 non è garantita per il singolo utente.
 *    Valutare se introdurre bilanciamento esplicito su centrale.
 */

import type { Direzione, FlankerStimolo } from "./levels";

// ── Costante ──────────────────────────────────────────────────────────────────

export const BLOCK_SIZE = 20;

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
 * Genera un pool di `dimensione` FlankerStimolo rispettando:
 * - Proporzione congruente/incongruente calibrata su `incongruentRatio`,
 *   bilanciata per blocchi di BLOCK_SIZE (20) trial.
 * - Vincolo "max 2 stimoli incongruenti consecutivi" anche al confine
 *   tra chiamate successive a generaPool, tramite `prevTailIncongruenti`.
 *
 * @param dimensione           Numero totale di stimoli da generare.
 * @param incongruentRatio     Proporzione target di trial incongruenti (0.0–1.0).
 * @param nFlankers            Numero totale di frecce flanker (2, 4 o 6).
 * @param prevTailIncongruenti I consecutivi in fondo al pool precedente (0|1|2).
 *                             Passare 0 per il primo pool della sessione.
 * @param rng                  Generatore di numeri casuali. Default: Math.random.
 *                             Iniettare una funzione deterministica nei test.
 */
export function generaPool(
  dimensione: number,
  incongruentRatio: number,
  nFlankers: 2 | 4 | 6,
  prevTailIncongruenti: 0 | 1 | 2,
  rng: () => number = Math.random,
): FlankerStimolo[] {
  const result: FlankerStimolo[] = [];
  let consecutivi = prevTailIncongruenti as number;
  let posizione = 0;

  while (posizione < dimensione) {
    const chunkSize = Math.min(BLOCK_SIZE, dimensione - posizione);
    const nI_target = Math.round(chunkSize * incongruentRatio);

    // Pre-correzione: cap() calcolato usando il consecutivi corrente al confine.
    // Applicato ad ogni chunk (non solo il primo) per gestire correttamente i
    // confini interni. cap(N, tail) garantisce nI ≤ capacità effettiva.
    // Nota: cap(N, 0) per chunk interni — la tail effettiva al confine può essere
    // 0, 1 o 2, ma il loop gestisce il caso degenere con deviazione ±1
    // (ramo deveEssereC && deveEssereI). Pool grandi possono accumulare
    // deviazioni: max ±1 per chunk × numero chunk.
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
            `[flanker/sequence] balancer infeasibility — bug in cap(). ` +
            `chunk=${chunkSize}, tail=${tail}, localPos=${i}, ` +
            `posGlobale=${posizione + i}, rimasti_I=${rimasti_I}, ` +
            `rimasti_C=${rimasti_C}, consecutivi=${consecutivi}`,
          );
        }
        // Caso degenere legittimo (cap() per chunk interni usa tail=0 anche se
        // il consecutivi effettivo è >0): accetta ±1 deviazione su nI.
        // Il vincolo consecutivi ha priorità assoluta.
        isIncongruente = false;
        rimasti_I--; // accetta un I in meno in questo chunk
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

      // Genera lo stimolo: direzione centrale casuale 50/50, flanker derivati.
      const centrale: Direzione = rng() < 0.5 ? "sinistra" : "destra";
      const flankerDir: Direzione =
        isIncongruente
          ? centrale === "sinistra" ? "destra" : "sinistra"
          : centrale;

      result.push({
        centrale,
        flankers: Array(nFlankers).fill(flankerDir) as Direzione[],
        congruente: !isIncongruente,
      });
    }

    posizione += chunkSize;
  }

  return result;
}
